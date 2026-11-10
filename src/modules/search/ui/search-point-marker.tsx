"use client";

// * MapLibre:
import { Marker } from "@vis.gl/react-maplibre";

// * Translations:
import { useTranslation } from "react-i18next";

// * Types:
import type { SearchPoint } from "../types/search-point.type";

// * UI:
import { MapPin } from "lucide-react";
import "./search-point-marker.css";

export function SearchPointMarker({ point }: { point: SearchPoint }) {
    const { t } = useTranslation();
    const label = t("search_point", { location: point.label });
    return (
        <Marker longitude={point.longitude} latitude={point.latitude} anchor="bottom" style={{ zIndex: 1 }}>
            <span className="search-point-marker" role="img" aria-label={label} title={label}>
                <MapPin size={36} fill="#e11d48" stroke="white" strokeWidth={1.5} aria-hidden="true" />
            </span>
        </Marker>
    );
}
