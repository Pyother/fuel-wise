// * Types:
import type { SearchStationsResult } from "@/modules/search/types/search-stations-result.type";
import type { SearchPoint } from "@/modules/search/types/search-point.type";
import type { SearchLocationsResult } from "@/modules/search/types/search-locations-result.type";

export type MapProps = {
    fullScreen: boolean;
    location?: SearchLocationsResult | null;
    onPick?: (latitude: number, longitude: number) => void;
    stations?: SearchStationsResult[];
    searchPoint?: SearchPoint | null;
    selectedStation?: SearchStationsResult | null;
    onStationSelect?: (station: SearchStationsResult) => void;
}
