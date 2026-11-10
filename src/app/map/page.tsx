"use client";

// * Modules:
import { Map } from "@/modules/map/map"
import { useStations } from "@/modules/map/provider";

export default function Page() {
    const { stations, selectedStation, setSelectedStation } = useStations();
    return (
        <div className="flex min-h-0 flex-1 flex-col">
            <Map 
                fullScreen
                stations={stations}
                selectedStation={selectedStation}
                onStationSelect={setSelectedStation}
            />
        </div>
    )
}
