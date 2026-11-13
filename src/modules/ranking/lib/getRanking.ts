"use server";

// * Lib:
import { getRoute } from "@/lib/api/getRoute";

// * Types:
import type { RouteParams } from "@/lib/types/route-params.type";
import type { SearchStationsResult } from "@/modules/search/types/search-stations-result.type";
import type { RankingResult } from "../types/ranking-result.type";

export async function getRanking(origin: RouteParams["origin"], stations: SearchStationsResult[]): Promise<RankingResult[]> {
    if (!origin || !Number.isFinite(origin.lat) || Math.abs(origin.lat) > 90 ||
        !Number.isFinite(origin.lon) || Math.abs(origin.lon) > 180 ||
        !Array.isArray(stations) || stations.length > 20) {
        throw new Error("Invalid ranking parameters.");
    }
    const results: RankingResult[] = [];
    // Limit simultaneous routing requests; every destination starts at the same origin.
    for (let offset = 0; offset < stations.length; offset += 4) {
        results.push(...await Promise.all(stations.slice(offset, offset + 4).map(async station => {
            try {
                const route = await getRoute({ origin, destination: { lat: station.lat, lon: station.lon } });
                return { station, route };
            } catch {
                return { station, route: null };
            }
        })));
    }
    return results.sort((a, b) => {
        if (!a.route) return b.route ? 1 : 0;
        if (!b.route) return -1;
        const priceA = a.station.prices?.pb95 ?? Infinity;
        const priceB = b.station.prices?.pb95 ?? Infinity;
        if (priceA !== priceB) return priceA - priceB;
        return a.route.distance - b.route.distance || a.route.time - b.route.time;
    });
}
