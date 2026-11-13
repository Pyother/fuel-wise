"use client";

// * React and Next:
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";

// * Types:
import type { RankingResult } from "@/modules/ranking/types/ranking-result.type";
import type { SearchStationsResult } from "@/modules/search/types/search-stations-result.type";
import type { SearchPoint } from "@/modules/search/types/search-point.type";

const StationsContext = createContext<{
    stations: SearchStationsResult[];
    searchPoint: SearchPoint | null;
    setSearchPoint: (point: SearchPoint | null) => void;
    selectedStation: SearchStationsResult | null;
    selectedRanking: RankingResult | null;
    toggleRanking: (item: RankingResult) => void;
    onStationsChange: (stations: SearchStationsResult[]) => void;
    setSelectedStation: (station: SearchStationsResult | null) => void;
} | null>(null);

export default function StationsProvider({ children }: { children: ReactNode }) {
    const [stations, setStations] = useState<SearchStationsResult[]>([]);
    const [searchPoint, setSearchPoint] = useState<SearchPoint | null>(null);
    const [selection, setSelection] = useState<{ station: SearchStationsResult; ranking: RankingResult | null } | null>(null);
    const setSelectedStation = useCallback((station: SearchStationsResult | null) => {
        setSelection(station ? { station, ranking: null } : null);
    }, []);
    const toggleRanking = useCallback((item: RankingResult) => {
        setSelection(current => current?.ranking?.station.place_id === item.station.place_id
            ? null : { station: item.station, ranking: item });
    }, []);
    const onStationsChange = useCallback((results: SearchStationsResult[]) => {
        setStations(results);
        setSelection(null);
    }, []);
    const value = useMemo(() => ({
        stations, selectedStation: selection?.station ?? null, selectedRanking: selection?.ranking ?? null,
        toggleRanking, onStationsChange, setSelectedStation, searchPoint, setSearchPoint,
    }), [stations, selection, toggleRanking, onStationsChange, setSelectedStation, searchPoint]);

    return <StationsContext.Provider value={value}>{children}</StationsContext.Provider>;
}

export function useStations() {
    const context = useContext(StationsContext);
    if (!context) throw new Error("useStations must be used within StationsProvider.");
    return context;
}
