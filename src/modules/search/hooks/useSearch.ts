"use client";

// * React and Next:
import { useEffect, useState } from "react";

// * Lib:
import { getLocations } from "@/lib/api/getLocations";

// * Types:
import type { SearchLocationsResult } from "../types/search-locations-result.type";

const useSearch = (lang = "en") => {
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);
    const [selected, setSelected] = useState(false);
    const [response, setResponse] = useState<{
        key: string; results: SearchLocationsResult[]; error: boolean;
    }>({ key: "", results: [], error: false });
    const text = query.trim();
    const key = `${lang}:${text}`;
    const isSearching = text.length >= 3 && !selected;

    useEffect(() => {
        if (!isSearching) return;
        let active = true;
        const timer = setTimeout(async () => {
            try {
                const results = await getLocations({ query: text, limit: 10, lang });
                if (active) setResponse({ key, results, error: false });
            } catch {
                if (active) setResponse({ key, results: [], error: true });
            }
        }, 300);

        return () => {
            active = false;
            clearTimeout(timer);
        };
    }, [query, text, lang, key, isSearching]);

    const results = isSearching && response.key === key ? response.results : [];
    const pageCount = Math.ceil(results.length / 5);
    const currentPage = Math.min(page, Math.max(1, pageCount));

    return {
        query,
        setQuery: (value: string) => {
            setQuery(value);
            setPage(1);
            setSelected(false);
            setResponse({ key: "", results: [], error: false });
        },
        selectLocation: (result: SearchLocationsResult) => {
            setQuery(result.formatted);
            setSelected(true);
        },
        results: results.slice((currentPage - 1) * 5, currentPage * 5),
        page: currentPage,
        pageCount,
        setPage: (value: number) => setPage(Math.max(1, Math.min(value, pageCount))),
        isSearching,
        isLoading: isSearching && response.key !== key,
        error: isSearching && response.key === key && response.error,
    };
}

export default useSearch;
