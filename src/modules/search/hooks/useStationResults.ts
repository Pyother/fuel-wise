"use client";

// * React and Next:
import { useEffect, useMemo, useState } from "react";

// * Lib:
import { getStations } from "../lib/getStations";

// * Types:
import type { SearchOptions, SearchPoint } from "../types/search-point.type";
import type { SearchStationsResult } from "../types/search-stations-result.type";

export function useStationResults(point: SearchPoint | null, options: SearchOptions,
    onChange?: (stations: SearchStationsResult[]) => void) {
    const request = useMemo(() => point ? { ...point, ...options } : null, [point, options]);
    const [response, setResponse] = useState<{
        request: typeof request; results: SearchStationsResult[]; error: boolean;
    }>();

    useEffect(() => {
        if (!request) return;
        let active = true;
        getStations(request).then((results) => {
            if (!active) return;
            setResponse({ request, results, error: false });
            onChange?.(results);
        }).catch(() => {
            if (!active) return;
            setResponse({ request, results: [], error: true });
            onChange?.([]);
        });
        return () => { active = false; };
    }, [request, onChange]);

    return {
        results: request && response?.request === request ? response.results : [],
        loading: !!request && response?.request !== request,
        error: !!request && response?.request === request && response.error,
    };
}
