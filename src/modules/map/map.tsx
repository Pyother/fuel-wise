// * React and Next:


// * MapLibre:


// * Types:
import type { MapProps } from "./types/MapProps"

// * UI:
import { Wrapper } from "./ui/wrapper";
import "./map.css";

export function Map(props: MapProps) {
    return (
        <Wrapper 
            fullScreen={props.fullScreen}
        >
            <div>
                Map Content
            </div>
        </Wrapper>
    )
}