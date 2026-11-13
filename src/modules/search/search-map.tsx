"use client";

// * Modules:
import { Map } from "@/modules/map/map";
import { useStations } from "@/modules/map/provider";
import { Search } from "./search";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import useSearch from "./hooks/useSearch";

export const SearchMap = () => {
    const { stations, selectedStation, onStationsChange, setSelectedStation, searchPoint, setSearchPoint } = useStations();
    const { i18n } = useTranslation();
    const search = useSearch(i18n.resolvedLanguage ?? "en", onStationsChange, setSearchPoint);
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
