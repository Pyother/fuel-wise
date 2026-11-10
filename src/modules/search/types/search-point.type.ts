export type SearchCoordinates = { latitude: number; longitude: number };

export type SearchPoint = SearchCoordinates & { label: string };

export type SearchOptions = { radius_m: number; limit: number };
