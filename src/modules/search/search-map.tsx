"use client";

// * React and Next:
import { useCallback, useState } from "react";

// * Modules:
import { Map } from "@/modules/map/map";
import { Search } from "./search";

// * Types:
import type { SearchStationsResult } from "./types/search-stations-result.type";

export const SearchMap = () => {
    const [stations, setStations] = useState<SearchStationsResult[]>([]);
    const [selectedStation, setSelectedStation] = useState<SearchStationsResult | null>(null);
    const onStationsChange = useCallback((results: SearchStationsResult[]) => {
        setStations(results);
        setSelectedStation(null);
    }, []);

    return (
        <>
            <Search onStationsChange={onStationsChange} onStationSelect={setSelectedStation} />
            <Map fullScreen={false} stations={stations} selectedStation={selectedStation}
                onStationSelect={setSelectedStation} />
        </>
    )
}
