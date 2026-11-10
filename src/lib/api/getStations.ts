// * Types:
import type { SearchStationsParams } from "@/modules/search/types/search-stations-params.type";
import type { SearchStationsResult } from "@/modules/search/types/search-stations-result.type";

export async function getStations(params: SearchStationsParams): Promise<SearchStationsResult[]> {
    
    const { latitude, longitude, radius_m, limit } = params;
    if (![latitude, longitude, radius_m, limit].every(Number.isFinite) ||
        Math.abs(latitude) > 90 || Math.abs(longitude) > 180 || radius_m <= 0 ||
        !Number.isInteger(limit) || limit < 1 || limit > 20) {
        throw new Error("Invalid station search parameters.");
    }

    const apiKey = process.env.GEOAPIFY_API_KEY;
    if (!apiKey) throw new Error("GEOAPIFY_API_KEY is not configured.");

    const query = new URLSearchParams({
        categories: "service.vehicle.fuel",
        filter: `circle:${longitude},${latitude},${radius_m}`,
        bias: `proximity:${longitude},${latitude}`,
        limit: String(limit),
        apiKey,
    });
    const response = await fetch(`https://api.geoapify.com/v2/places?${query}`, {
        cache: "no-store",
        signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) throw new Error(`Geoapify API returned HTTP ${response.status}.`);

    const data: { features: { properties: Partial<SearchStationsResult> & { categories?: string[] } }[] } =
        await response.json();
    const stations = new Map<string, SearchStationsResult>();

    for (const { properties } of data.features) {
        const { place_id, formatted, lat, lon, distance, name, fuel_options, categories } = properties;
        if (!categories?.includes("service.vehicle.fuel") ||
            typeof place_id !== "string" || typeof formatted !== "string" ||
            typeof lat !== "number" || !Number.isFinite(lat) ||
            typeof lon !== "number" || !Number.isFinite(lon) ||
            typeof distance !== "number" || !Number.isFinite(distance) ||
            distance < 0 || distance > radius_m || stations.has(place_id)) continue;

        stations.set(place_id, {
            place_id, formatted, lat, lon, distance,
            ...(name !== undefined && { name }),
            ...(fuel_options !== undefined && { fuel_options }),
        });
    }

    return [...stations.values()].sort((a, b) => a.distance - b.distance).slice(0, limit);
}
