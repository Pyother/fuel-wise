"use client";

// * Modules:
import { Map } from "@/modules/map/map";
import { useStations } from "@/modules/map/provider";
import { Search } from "./search";

export const SearchMap = () => {
    const { stations, selectedStation, onStationsChange, setSelectedStation } = useStations();

    return (
        <>
            <Search onStationsChange={onStationsChange} onStationSelect={setSelectedStation} />
            <Map fullScreen={false} stations={stations} selectedStation={selectedStation}
                onStationSelect={setSelectedStation} />
        </>
    )
}
