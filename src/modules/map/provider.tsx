"use client";

// * React and Next:
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";

// * Types:
import type { SearchStationsResult } from "@/modules/search/types/search-stations-result.type";

const StationsContext = createContext<{
    stations: SearchStationsResult[];
    selectedStation: SearchStationsResult | null;
    onStationsChange: (stations: SearchStationsResult[]) => void;
    setSelectedStation: (station: SearchStationsResult | null) => void;
} | null>(null);

export default function StationsProvider({ children }: { children: ReactNode }) {
    const [stations, setStations] = useState<SearchStationsResult[]>([]);
    const [selectedStation, setSelectedStation] = useState<SearchStationsResult | null>(null);
    const onStationsChange = useCallback((results: SearchStationsResult[]) => {
        setStations(results);
        setSelectedStation(null);
    }, []);
    const value = useMemo(() => ({
        stations, selectedStation, onStationsChange, setSelectedStation,
    }), [stations, selectedStation, onStationsChange]);

    return <StationsContext.Provider value={value}>{children}</StationsContext.Provider>;
}

export function useStations() {
    const context = useContext(StationsContext);
    if (!context) throw new Error("useStations must be used within StationsProvider.");
    return context;
}
