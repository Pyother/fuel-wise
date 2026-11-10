"use client";

// * React and Next:
import { useCallback, useEffect, useState } from "react";

// * Lib:
import { getLocations } from "@/lib/api/getLocations";
import { getStations } from "@/lib/api/getStations";

// * Types:
import type { SearchLocationsResult } from "../types/search-locations-result.type";
import type { SearchStationsResult } from "../types/search-stations-result.type";

const useSearch = (lang = "en", onStationsChange?: (stations: SearchStationsResult[]) => void) => {
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [selected, setSelected] = useState<SearchLocationsResult | null>(null);
    const [stationsResponse, setStationsResponse] = useState<{
        location: SearchLocationsResult | null; results: SearchStationsResult[]; error: boolean;
    }>({ location: null, results: [], error: false });
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

    useEffect(() => {
        if (!selected) return;
        let active = true;
        getStations({ latitude: selected.lat, longitude: selected.lon, radius_m: 5000, limit: 20 })
            .then((results) => {
                if (active) {
                    setStationsResponse({ location: selected, results, error: false });
                    onStationsChange?.(results);
                }
            })
            .catch(() => {
                if (active) setStationsResponse({ location: selected, results: [], error: true });
            });
        return () => { active = false; };
    }, [selected, onStationsChange]);

    const results = isSearching && response.key === key ? response.results : [];
    const stations = selected && stationsResponse.location === selected ? stationsResponse.results : [];
    const resultCount = selected ? stations.length : results.length;
    const pageCount = Math.ceil(resultCount / pageSize);
    const currentPage = Math.min(page, Math.max(1, pageCount));

    const listRef = useCallback((list: HTMLDivElement | null) => {
        if (!list || !resultCount) return;
        const observer = new ResizeObserver(() => {
            const items = list.querySelectorAll<HTMLElement>('[data-slot="command-item"]');
            const itemHeight = Math.max(...Array.from(items, (item) => item.getBoundingClientRect().height));
            if (itemHeight > 0 && list.clientHeight > 0) {
                setPageSize(Math.max(1, Math.floor(list.clientHeight / itemHeight)));
            }
        });
        observer.observe(list);
        list.querySelectorAll('[data-slot="command-item"]').forEach((item) => observer.observe(item));
        return () => observer.disconnect();
    }, [resultCount]);

    return {
        query,
        setQuery: (value: string) => {
            setQuery(value);
            setPage(1);
            setSelected(null);
            onStationsChange?.([]);
            setResponse({ key: "", results: [], error: false });
        },
        selectLocation: (result: SearchLocationsResult) => {
            setQuery(result.formatted);
            setSelected(result);
            onStationsChange?.([]);
            setPage(1);
            setStationsResponse({ location: null, results: [], error: false });
        },
        selectedLocation: selected,
        listRef,
        resultCount,
        stations: stations.slice((currentPage - 1) * pageSize, currentPage * pageSize),
        results: results.slice((currentPage - 1) * pageSize, currentPage * pageSize),
        page: currentPage,
        pageCount,
        setPage: (value: number) => setPage(Math.max(1, Math.min(value, pageCount))),
        isSearching,
        isLoading: selected ? stationsResponse.location !== selected : isSearching && response.key !== key,
        error: selected ? stationsResponse.location === selected && stationsResponse.error :
            isSearching && response.key === key && response.error,
    };
}

export default useSearch;
