// * Types:
import type { SearchStationsResult } from "@/modules/search/types/search-stations-result.type";

export type MapProps = {
    fullScreen: boolean;
    stations?: SearchStationsResult[];
    selectedStation?: SearchStationsResult | null;
    onStationSelect?: (station: SearchStationsResult) => void;
}
