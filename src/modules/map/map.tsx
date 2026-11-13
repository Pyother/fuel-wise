"use client";

// * React and Next:
import { useEffect, useRef, useState } from "react";

// * MapLibre:
import { Layer, Map as MapLibreMap, Marker, Source } from '@vis.gl/react-maplibre';
import type { MapRef } from '@vis.gl/react-maplibre';
import { LngLatBounds, setWorkerUrl } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

// * Modules:
import { useTheme } from '../theme/provider';
import { useStations } from "./provider";

// * Types:
import type { MapProps } from "./types/MapProps"

// * UI:
import { Fuel } from "lucide-react";
import { Wrapper } from "./ui/wrapper";
import { SearchPointMarker } from "@/modules/search/ui/search-point-marker";
import "./map.css";

setWorkerUrl(
    new URL('maplibre-gl/dist/maplibre-gl-worker.mjs', import.meta.url).toString()
);

export function Map(props: MapProps) {

    const { theme } = useTheme();
    const mapRef = useRef<MapRef>(null);
    const [loaded, setLoaded] = useState(false);
    const { stations, selectedStation, searchPoint } = props;
    const geometry = useStations().selectedRanking?.route?.geometry;

    useEffect(() => {
        const map = mapRef.current;
        if (!loaded || !map) return;
        map.stop();
        if (geometry) {
            const lines = geometry.type === "LineString" ? [geometry.coordinates] : geometry.coordinates;
            const bounds = new LngLatBounds();
            for (const line of lines) {
                for (const [lon, lat] of line) bounds.extend([lon, lat]);
            }
            map.fitBounds(bounds, { padding: 48, maxZoom: 15, duration: 700 });
            return;
        }
        if (selectedStation) {
            map.flyTo({ center: [selectedStation.lon, selectedStation.lat], zoom: 15, duration: 700 });
            return;
        }
        const points: [number, number][] = (stations ?? []).map(({ lon, lat }) => [lon, lat]);
        if (searchPoint) points.push([searchPoint.longitude, searchPoint.latitude]);
        if (!points.length) return;
        if (points.length === 1) {
            map.flyTo({ center: points[0], zoom: 15, duration: 700 });
            return;
        }
        const bounds = new LngLatBounds();
        points.forEach(point => bounds.extend(point));
        map.fitBounds(bounds, { padding: 48, maxZoom: 15, duration: 700 });
    }, [loaded, stations, selectedStation, searchPoint, geometry]);
 
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
                {geometry && <Source id="ranking-route" type="geojson" data={geometry}>
                    <Layer id="ranking-route-line" type="line"
                        layout={{ "line-cap": "round", "line-join": "round" }}
                        paint={{ "line-color": "#008b64", "line-width": 5 }} />
                </Source>}
                {searchPoint && <SearchPointMarker point={searchPoint} />}
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
