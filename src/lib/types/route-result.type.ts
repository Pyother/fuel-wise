export type RouteResult = {
    distance: number; // Metres along the route.
    time: number; // Estimated travel time in seconds.
    geometry:
        | { type: "LineString"; coordinates: number[][] }
        | { type: "MultiLineString"; coordinates: number[][][] };
};
