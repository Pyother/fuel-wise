"use server";

// * Types:
import type { RouteParams } from "@/lib/types/route-params.type";
import type { RouteResult } from "@/lib/types/route-result.type";

export async function getRoute(params: RouteParams): Promise<RouteResult> {
    const { origin, destination } = params ?? {};
    if (![origin, destination].every(point => point &&
        Number.isFinite(point.lat) && Math.abs(point.lat) <= 90 &&
        Number.isFinite(point.lon) && Math.abs(point.lon) <= 180)) {
        throw new Error("Invalid route coordinates.");
    }

    const apiKey = process.env.GEOAPIFY_API_KEY;
    if (!apiKey) throw new Error("GEOAPIFY_API_KEY is not configured.");
    const query = new URLSearchParams({
        waypoints: `${origin.lat},${origin.lon}|${destination.lat},${destination.lon}`,
        mode: "drive",
        units: "metric",
        format: "geojson",
        apiKey,
    });
    const response = await fetch(`https://api.geoapify.com/v1/routing?${query}`, {
        cache: "no-store",
        signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) throw new Error(`Geoapify API returned HTTP ${response.status}.`);

    const data: { features?: { properties?: Partial<RouteResult>; geometry?: RouteResult["geometry"] }[] } =
        await response.json();
    const route = data?.features?.[0];
    if (!route) throw new Error("No route found between the selected points.");

    const { distance, time } = route.properties ?? {};
    const geometry = route.geometry;
    const lines = geometry?.type === "LineString" ? [geometry.coordinates] :
        geometry?.type === "MultiLineString" ? geometry.coordinates : [];
    if (typeof distance !== "number" || !Number.isFinite(distance) || distance < 0 ||
        typeof time !== "number" || !Number.isFinite(time) || time < 0 ||
        !geometry || !Array.isArray(lines) || !lines.length ||
        !lines.every(line => Array.isArray(line) && line.length >= 2 && line.every(point =>
            Array.isArray(point) && point.length >= 2 &&
            Number.isFinite(point[0]) && Math.abs(point[0]) <= 180 &&
            Number.isFinite(point[1]) && Math.abs(point[1]) <= 90))) {
        throw new Error("Geoapify API returned an invalid route.");
    }

    return { distance, time, geometry };
}
