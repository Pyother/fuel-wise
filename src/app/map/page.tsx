"use client";

// * Modules:
import { Map } from "@/modules/map/map"
import { useStations } from "@/modules/map/provider";
import { useSearchState } from "@/modules/search/provider";

export default function Page() {
    const { stations, selectedStation, setSelectedStation, searchPoint } = useStations();
    const { city } = useSearchState();
    return (
        <div className="flex min-h-0 flex-1 flex-col">
            <Map 
                fullScreen
                location={city}
                stations={stations}
                searchPoint={searchPoint}
                selectedStation={selectedStation}
                onStationSelect={setSelectedStation}
            />
        </div>
    )
}
