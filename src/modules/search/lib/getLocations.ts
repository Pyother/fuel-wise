"use server";

// * Types:
import type { SearchLocationsParams } from "@/modules/search/types/search-locations-params.type";
import type { SearchLocationsResult } from "@/modules/search/types/search-locations-result.type";

export async function getLocations({
    query,
    limit = 5,
    lang,
    country_codes,
}: SearchLocationsParams): Promise<SearchLocationsResult[]> {
    if (typeof query !== "string" || query.length > 300 ||
        !Number.isInteger(limit) || limit < 1 || limit > 10) {
        throw new Error("Invalid location search parameters.");
    }
    if (!query.trim()) return [];

    const apiKey = process.env.GEOAPIFY_API_KEY;
    if (!apiKey) throw new Error("GEOAPIFY_API_KEY is not configured.");

    const params = new URLSearchParams({
        text: query.trim(),
        type: "city",
        limit: String(limit),
        format: "json",
        apiKey,
    });

    if (lang) params.set("lang", lang);
    if (country_codes?.length) {
        params.set("filter", `countrycode:${country_codes.join(",")}`);
    }

    const response = await fetch(
        `https://api.geoapify.com/v1/geocode/search?${params}`,
        {
            cache: "no-store",
            signal: AbortSignal.timeout(10_000),
        }
    );

    if (!response.ok) {
        throw new Error(`Geoapify API returned HTTP ${response.status}.`);
    }

    const data: {
        results: (Partial<SearchLocationsResult> & { result_type?: string; city?: string })[];
    } =
        await response.json();

    return data.results.flatMap(({ place_id, city, lat, lon, result_type, country_code, bbox }) =>
        result_type === "city" &&
        typeof place_id === "string" &&
        typeof city === "string" && city.trim().length > 0 &&
        typeof lat === "number" && Number.isFinite(lat) &&
        typeof lon === "number" && Number.isFinite(lon)
            ? [{ place_id, formatted: city, lat, lon, country_code, bbox }]
            : []
    );
}
