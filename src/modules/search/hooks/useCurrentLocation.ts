"use client";

// * React and Next:
import { useEffect, useRef, useState } from "react";

// * Lib:
import { getLocation } from "../lib/getLocation";

// * Types:
import type { SearchCoordinates } from "../types/search-point.type";

export function useCurrentLocation() {
    const version = useRef(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    useEffect(() => () => { version.current++; }, []);

    return {
        loading, error,
        cancel: () => { version.current++; setLoading(false); setError(""); },
        locate: async (onLocated: (coordinates: SearchCoordinates) => void) => {
            const current = ++version.current;
            setLoading(true);
            setError("");
            try {
                const coordinates = await getLocation();
                if (current === version.current) onLocated(coordinates);
            } catch (error) {
                if (current === version.current) setError(error instanceof Error ? error.message : "search_location_unavailable");
            } finally {
                if (current === version.current) setLoading(false);
            }
        },
    };
}
