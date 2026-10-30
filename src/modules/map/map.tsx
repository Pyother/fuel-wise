"use client";

// * React and Next:


// * MapLibre:
import { Map as MapLibreMap } from '@vis.gl/react-maplibre';
import { setWorkerUrl } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

// * Types:
import type { MapProps } from "./types/MapProps"

// * UI:
import { Wrapper } from "./ui/wrapper";
import "./map.css";

setWorkerUrl(
    new URL('maplibre-gl/dist/maplibre-gl-worker.mjs', import.meta.url).toString()
);

export function Map(props: MapProps) {
    return (
        <Wrapper 
            fullScreen={props.fullScreen}
        >
            <MapLibreMap
                initialViewState={{
                    longitude: -100,
                    latitude: 40,
                    zoom: 3.5
                }}
                style={{width: '100%', height: 'auto', flex: 1, minHeight: 0}}
                mapStyle="https://demotiles.maplibre.org/style.json"
            />
        </Wrapper>
    )
}
