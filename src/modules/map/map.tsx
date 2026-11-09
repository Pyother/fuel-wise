"use client";

// * React and Next:


// * MapLibre:
import { Map as MapLibreMap } from '@vis.gl/react-maplibre';
import { setWorkerUrl } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

// * Modules:
import { useTheme } from '../theme/provider';

// * Types:
import type { MapProps } from "./types/MapProps"

// * UI:
import { Wrapper } from "./ui/wrapper";
import "./map.css";

setWorkerUrl(
    new URL('maplibre-gl/dist/maplibre-gl-worker.mjs', import.meta.url).toString()
);

export function Map(props: MapProps) {

    const { theme } = useTheme();
 
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
                mapStyle={
                    theme === "dark" ? process.env.NEXT_PUBLIC_MAP_STYLE_DARK :
                    process.env.NEXT_PUBLIC_MAP_STYLE_BRIGHT
                }
            />
        </Wrapper>
    )
}
