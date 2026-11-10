"use server";

// * Types:
import type { SearchLocationsResult } from "../types/search-locations-result.type";

export async function getAddresses(query: string, city: SearchLocationsResult, lang: string): Promise<SearchLocationsResult[]> {
    if (typeof query !== "string" || query.length > 300 || !city ||
        typeof city.formatted !== "string" || !Number.isFinite(city.lat) || !Number.isFinite(city.lon)) {
        throw new Error("Invalid address search parameters.");
    }
    if (!query.trim()) return [];
    const apiKey = process.env.GEOAPIFY_API_KEY;
    if (!apiKey) throw new Error("GEOAPIFY_API_KEY is not configured.");

    const params = new URLSearchParams({
        text: `${query.trim()}, ${city.formatted}`,
        bias: `proximity:${city.lon},${city.lat}`,
        format: "json", limit: "10", lang, apiKey,
    });
    if (city.country_code) params.set("filter", `countrycode:${city.country_code}`);
    const response = await fetch(`https://api.geoapify.com/v1/geocode/search?${params}`, {
        cache: "no-store", signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) throw new Error(`Geoapify API returned HTTP ${response.status}.`);
    const data: { results: (Partial<SearchLocationsResult> & { result_type?: string; city?: string })[] } =
        await response.json();

    return data.results.flatMap((place) => {
        const { place_id, formatted, lat, lon, result_type } = place;
        if ((result_type !== "street" && result_type !== "building") ||
            typeof place_id !== "string" || typeof formatted !== "string" ||
            typeof lat !== "number" || !Number.isFinite(lat) ||
            typeof lon !== "number" || !Number.isFinite(lon) ||
            place.city?.toLocaleLowerCase() !== city.formatted.toLocaleLowerCase() ||
            (city.country_code && place.country_code !== city.country_code)) return [];
        const bounds = city.bbox;
        if (bounds && (lat < bounds.lat1 || lat > bounds.lat2 || lon < bounds.lon1 || lon > bounds.lon2)) return [];
        return [{ place_id, formatted, lat, lon }];
    });
}
