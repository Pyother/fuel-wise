export type SearchStationsResult = {
	place_id: string;
	formatted: string;
	lat: number;
	lon: number;
	distance: number;
	name?: string;
	fuel_options?: Record<string, boolean>;
};
