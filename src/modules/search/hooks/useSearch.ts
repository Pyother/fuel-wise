"use client";

// * React and Next:
import { useState } from "react";

// * Hooks:
import { useSuggestions } from "./useSuggestions";
import { useStationResults } from "./useStationResults";
import { useCurrentLocation } from "./useCurrentLocation";
import { useResultsPage } from "./useResultsPage";

// * Types:
import type { SearchLocationsResult } from "../types/search-locations-result.type";
import type { SearchStationsResult } from "../types/search-stations-result.type";
import type { SearchOptions, SearchPoint } from "../types/search-point.type";

const useSearch = (lang = "en", onStationsChange?: (stations: SearchStationsResult[]) => void,
    onPointChange?: (point: SearchPoint | null) => void) => {
    const [query, setQuery] = useState("");
    const [city, setCity] = useState<SearchLocationsResult | null>(null);
    const [point, updatePoint] = useState<SearchPoint | null>(null);
    const setPoint = (value: SearchPoint | null) => { updatePoint(value); onPointChange?.(value); };
    const [options, setOptions] = useState<SearchOptions>({ radius_m: 5000, limit: 20 });
    const current = useCurrentLocation();
    const suggestions = useSuggestions(query, city, lang, !point && !current.loading);
    const stations = useStationResults(point, options, onStationsChange);
    const count = point ? stations.results.length : suggestions.results.length;
    const pagination = useResultsPage(count, JSON.stringify([query, city?.place_id, point, options]));
    const clearStations = () => { setPoint(null); onStationsChange?.([]); };

    return {
        query, city, point, options,
        ...pagination,
        resultCount: count,
        results: suggestions.results.slice(pagination.offset, pagination.offset + pagination.size),
        stations: stations.results.slice(pagination.offset, pagination.offset + pagination.size),
        showResults: !!point || suggestions.active || current.loading || !!current.error,
        isLoading: current.loading || suggestions.loading || stations.loading,
        isLocating: current.loading,
        error: current.error || (suggestions.error || stations.error ? "search_error" : ""),
        setQuery: (value: string) => {
            current.cancel();
            setQuery(value);
            clearStations();
        },
        selectLocation: (location: SearchLocationsResult) => {
            current.cancel();
            onStationsChange?.([]);
            if (!city) {
                setCity(location);
                setQuery("");
                setPoint(null);
            } else {
                setQuery(location.formatted);
                setPoint({ latitude: location.lat, longitude: location.lon, label: location.formatted });
            }
        },
        changeCity: () => {
            current.cancel();
            setCity(null);
            setQuery("");
            clearStations();
        },
        setOptions: (value: SearchOptions) => {
            if (value.limit === options.limit && value.radius_m === options.radius_m) return;
            setOptions(value);
            if (point) onStationsChange?.([]);
        },
        locate: (label: string) => {
            setCity(null);
            setQuery("");
            clearStations();
            void current.locate(coordinates => {
                setQuery(label);
                setPoint({ ...coordinates, label });
            });
        },
    };
};

export default useSearch;
