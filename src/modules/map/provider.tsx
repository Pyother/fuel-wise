"use client";

// * React and Next:
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";

// * Types:
import type { SearchStationsResult } from "@/modules/search/types/search-stations-result.type";
import type { SearchPoint } from "@/modules/search/types/search-point.type";

const StationsContext = createContext<{
    stations: SearchStationsResult[];
    searchPoint: SearchPoint | null;
    setSearchPoint: (point: SearchPoint | null) => void;
    selectedStation: SearchStationsResult | null;
    onStationsChange: (stations: SearchStationsResult[]) => void;
    setSelectedStation: (station: SearchStationsResult | null) => void;
} | null>(null);

export default function StationsProvider({ children }: { children: ReactNode }) {
    const [stations, setStations] = useState<SearchStationsResult[]>([]);
    const [searchPoint, setSearchPoint] = useState<SearchPoint | null>(null);
    const [selectedStation, setSelectedStation] = useState<SearchStationsResult | null>(null);
    const onStationsChange = useCallback((results: SearchStationsResult[]) => {
        setStations(results);
        setSelectedStation(null);
    }, []);
    const value = useMemo(() => ({
        stations, selectedStation, onStationsChange, setSelectedStation, searchPoint, setSearchPoint,
    }), [stations, selectedStation, onStationsChange, searchPoint]);

    return <StationsContext.Provider value={value}>{children}</StationsContext.Provider>;
}

export function useStations() {
    const context = useContext(StationsContext);
    if (!context) throw new Error("useStations must be used within StationsProvider.");
    return context;
}
