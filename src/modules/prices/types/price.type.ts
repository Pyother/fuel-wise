import type stationsSample from "../data/stations-eur-sample.json";

export type Price = (typeof stationsSample)["stations"][number];
