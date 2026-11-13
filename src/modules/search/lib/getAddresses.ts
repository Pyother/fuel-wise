"use server";

// * Types:
import type { SearchLocationsResult } from "../types/search-locations-result.type";

export async function getAddresses(query: string, city: SearchLocationsResult, lang: string): Promise<SearchLocationsResult[]> {
    if (typeof query !== "string" || query.length > 300 || !city ||
        typeof city.formatted !== "string" || typeof city.place_id !== "string" || !city.place_id ||
        !Number.isFinite(city.lat) || !Number.isFinite(city.lon)) {
        throw new Error("Invalid address search parameters.");
    }
    if (!query.trim()) return [];
    const apiKey = process.env.GEOAPIFY_API_KEY;
    if (!apiKey) throw new Error("GEOAPIFY_API_KEY is not configured.");

    const params = new URLSearchParams({
        text: `${query.trim()}, ${city.formatted}`,
        filter: `place:${city.place_id}`,
        bias: `proximity:${city.lon},${city.lat}`,
        format: "json", limit: "10", lang, apiKey,
    });
    async function lookup(endpoint: "search" | "autocomplete") {
        const response = await fetch(`https://api.geoapify.com/v1/geocode/${endpoint}?${params}`, {
            cache: "no-store", signal: AbortSignal.timeout(10_000),
        });
        if (!response.ok) throw new Error(`Geoapify API returned HTTP ${response.status}.`);
        const data: { results: (Partial<SearchLocationsResult> & { result_type?: string })[] } =
            await response.json();

        return data.results.flatMap(({ place_id, formatted, lat, lon, result_type }) => {
            if (!["street", "building", "amenity", "amenity_name"].includes(result_type ?? "") ||
                typeof place_id !== "string" || typeof formatted !== "string" ||
                typeof lat !== "number" || !Number.isFinite(lat) ||
                typeof lon !== "number" || !Number.isFinite(lon)) return [];
            return [{ place_id, formatted, lat, lon }];
        });
    }

    const matches = await lookup("search");
    if (matches.length) return matches;
    params.set("text", query.trim());
    return lookup("autocomplete");
}
