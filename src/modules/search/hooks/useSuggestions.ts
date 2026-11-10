"use client";

// * React and Next:
import { useEffect, useState } from "react";

// * Lib:
import { getLocations } from "../lib/getLocations";
import { getAddresses } from "../lib/getAddresses";

// * Types:
import type { SearchLocationsResult } from "../types/search-locations-result.type";

export function useSuggestions(query: string, city: SearchLocationsResult | null, lang: string, enabled: boolean) {
    const key = JSON.stringify([query, city?.place_id, lang]);
    const active = enabled && query.trim().length >= (city ? 2 : 3);
    const [response, setResponse] = useState<{ key: string; results: SearchLocationsResult[]; error: boolean }>();

    useEffect(() => {
        if (!active) return;
        let current = true;
        const timer = setTimeout(async () => {
            try {
                const results = city ? await getAddresses(query, city, lang) :
                    await getLocations({ query, lang, limit: 10 });
                if (current) setResponse({ key, results, error: false });
            } catch {
                if (current) setResponse({ key, results: [], error: true });
            }
        }, 300);
        return () => { current = false; clearTimeout(timer); };
    }, [active, query, city, lang, key]);

    return {
        active,
        results: active && response?.key === key ? response.results : [],
        loading: active && response?.key !== key,
        error: active && response?.key === key && response.error,
    };
}
