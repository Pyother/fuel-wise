// * Types:
import type { RouteResult } from "@/lib/types/route-result.type";
import type { SearchStationsResult } from "@/modules/search/types/search-stations-result.type";

export type RankingResult = {
    station: SearchStationsResult;
    route: Pick<RouteResult, "distance" | "time"> | null;
};
