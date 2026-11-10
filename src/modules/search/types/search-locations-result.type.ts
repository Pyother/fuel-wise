export type SearchLocationsResult = {
    place_id: string;
    formatted: string;
    lat: number;
    lon: number;
    country_code?: string;
    bbox?: { lon1: number; lat1: number; lon2: number; lat2: number };
};
