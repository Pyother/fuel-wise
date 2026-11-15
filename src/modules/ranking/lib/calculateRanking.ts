import type { RankingResult } from "../types/ranking-result.type";

export const REFUEL_LITERS = 40;

export type CostedRankingResult = RankingResult & {
    costs: { fuel: number; driving: number; total: number } | null;
};

// One-way driving, valued at the destination's sample Pb95 price.
export function calculateRanking(results: RankingResult[], consumption: number): CostedRankingResult[] {
    const validConsumption = Number.isFinite(consumption) && consumption >= 0.1 && consumption <= 100;
    return results.map(item => {
        const price = item.station.prices?.pb95;
        const distance = item.route?.distance;
        if (!validConsumption || typeof price !== "number" || !Number.isFinite(price) || price <= 0 ||
            typeof distance !== "number" || !Number.isFinite(distance) || distance < 0) {
            return { ...item, costs: null };
        }
        const fuel = REFUEL_LITERS * price;
        const driving = distance / 1000 * consumption / 100 * price;
        return { ...item, costs: { fuel, driving, total: fuel + driving } };
    }).sort((a, b) => {
        if (!a.costs) return b.costs ? 1 : 0;
        if (!b.costs) return -1;
        return a.costs.total - b.costs.total || a.route!.distance - b.route!.distance;
    });
}
