// * Types:
import type { Price } from "@/modules/prices/types/price.type";

export type SearchStationsResult = {
	place_id: string;
	formatted: string;
	lat: number;
	lon: number;
	distance: number;
	name?: string;
	brand?: string;
	country_code?: string;
	prices?: Price["prices"] | null;
	fuel_options?: Record<string, boolean>;
};
