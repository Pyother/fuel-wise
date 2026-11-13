"use client";

// * Modules:
import { Map } from "@/modules/map/map";
import { useStations } from "@/modules/map/provider";
import { Search } from "./search";
import { useState } from "react";
import { useSearchState } from "./provider";

export const SearchMap = () => {
    const { stations, selectedStation, setSelectedStation, searchPoint } = useStations();
    const search = useSearchState();
    const [picking, setPicking] = useState(false);

    return (
        <>
            <Search search={search} onStationSelect={setSelectedStation} picking={picking}
                onTogglePick={() => setPicking(active => !active)} />
            <Map fullScreen={false} stations={stations} selectedStation={selectedStation}
                onStationSelect={setSelectedStation} searchPoint={searchPoint}
                onPick={picking ? (latitude, longitude) => {
                    search.pickPoint(latitude, longitude);
                    setPicking(false);
                } : undefined} />
        </>
    )
}
