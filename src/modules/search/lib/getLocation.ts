// * Types:
import type { SearchCoordinates } from "../types/search-point.type";

export function getLocation(): Promise<SearchCoordinates> {
    return new Promise((resolve, reject) => {
        if (typeof navigator === "undefined" || !navigator.geolocation) {
            reject(new Error("search_location_unavailable"));
            return;
        }
        navigator.geolocation.getCurrentPosition(
            ({ coords }) => resolve({ latitude: coords.latitude, longitude: coords.longitude }),
            ({ code }) => reject(new Error(code === 1 ? "search_location_denied" :
                code === 3 ? "search_location_timeout" : "search_location_unavailable")),
            { enableHighAccuracy: true, timeout: 10_000, maximumAge: 60_000 },
        );
    });
}
