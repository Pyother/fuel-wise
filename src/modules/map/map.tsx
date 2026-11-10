"use client";

// * React and Next:
import { useEffect, useRef, useState } from "react";

// * MapLibre:
import { Map as MapLibreMap, Marker } from '@vis.gl/react-maplibre';
import type { MapRef } from '@vis.gl/react-maplibre';
import { LngLatBounds, setWorkerUrl } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

// * Modules:
import { useTheme } from '../theme/provider';

// * Types:
import type { MapProps } from "./types/MapProps"

// * UI:
import { Fuel } from "lucide-react";
import { Wrapper } from "./ui/wrapper";
import "./map.css";

setWorkerUrl(
    new URL('maplibre-gl/dist/maplibre-gl-worker.mjs', import.meta.url).toString()
);

export function Map(props: MapProps) {

    const { theme } = useTheme();
    const mapRef = useRef<MapRef>(null);
    const [loaded, setLoaded] = useState(false);
    const { stations, selectedStation } = props;

    useEffect(() => {
        const map = mapRef.current;
        if (!loaded || !map) return;
        map.stop();
        if (!stations?.length) return;

        const station = selectedStation ?? (stations.length === 1 ? stations[0] : null);
        if (station) {
            map.flyTo({ center: [station.lon, station.lat], zoom: 15, duration: 700 });
        } else {
            const bounds = new LngLatBounds();
            stations.forEach(({ lon, lat }) => bounds.extend([lon, lat]));
            map.fitBounds(bounds, { padding: 48, maxZoom: 15, duration: 700 });
        }
    }, [loaded, stations, selectedStation]);
 
    return (
        <Wrapper 
            fullScreen={props.fullScreen}
        >
            <MapLibreMap
                ref={mapRef}
                onLoad={() => setLoaded(true)}
                initialViewState={{
                    longitude: -100,
                    latitude: 40,
                    zoom: 3.5
                }}
                style={{width: '100%', height: 'auto', flex: 1, minHeight: 0}}
                mapStyle={
                    theme === "dark" ? process.env.NEXT_PUBLIC_MAP_STYLE_DARK :
                    process.env.NEXT_PUBLIC_MAP_STYLE_BRIGHT
                }
            >
                {stations?.map((station) => (
                    <Marker key={station.place_id} longitude={station.lon} latitude={station.lat}>
                        <button type="button" className="map-station"
                            aria-label={station.name || station.formatted}
                            title={station.name ? `${station.name} — ${station.formatted}` : station.formatted}
                            aria-pressed={selectedStation?.place_id === station.place_id}
                            onClick={() => props.onStationSelect?.(station)}>
                            <Fuel size={18} aria-hidden="true" />
                        </button>
                    </Marker>
                ))}
            </MapLibreMap>
        </Wrapper>
    )
}
