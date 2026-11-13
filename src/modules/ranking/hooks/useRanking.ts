"use client";

// * React and Next:
import { useEffect, useState } from "react";

// * Hooks:
import { useResultsPage } from "@/modules/search/hooks/useResultsPage";

// * Lib:
import { getRanking } from "../lib/getRanking";

// * Types:
import type { SearchPoint } from "@/modules/search/types/search-point.type";
import type { SearchStationsResult } from "@/modules/search/types/search-stations-result.type";
import type { RankingResult } from "../types/ranking-result.type";

// Reuse completed and pending requests across client-side navigation.
const cache = new Map<string, Promise<RankingResult[]>>();

export function useRanking(point: SearchPoint | null, stations: SearchStationsResult[]) {
    const key = point && stations.length ? JSON.stringify([point.latitude, point.longitude, stations]) : "";
    const [attempt, setAttempt] = useState(0);
    const [response, setResponse] = useState<{ key: string; attempt: number; results: RankingResult[]; error: boolean }>();

    useEffect(() => {
        if (!key || !point) return;
        let active = true;
        let request = cache.get(key);
        if (!request) {
            request = getRanking({ lat: point.latitude, lon: point.longitude }, stations);
            cache.set(key, request);
            if (cache.size > 5) cache.delete(cache.keys().next().value!);
        }
        request.then(results => {
            if (active) setResponse({ key, attempt, results, error: false });
        }).catch(() => {
            cache.delete(key);
            if (active) setResponse({ key, attempt, results: [], error: true });
        });
        return () => { active = false; };
    }, [key, point, stations, attempt]);

    const ready = !!key && response?.key === key && response.attempt === attempt;
    const results = ready ? response.results : [];
    const pagination = useResultsPage(results.length, key, ".ranking-list li");
    return {
        ...pagination,
        items: results.slice(pagination.offset, pagination.offset + pagination.size),
        loading: !!key && !ready,
        error: ready && response.error,
        failed: results.filter(item => !item.route).length,
        count: results.length,
        retry: () => { cache.delete(key); setAttempt(value => value + 1); },
    };
}
