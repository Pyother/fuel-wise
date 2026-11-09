type SpatialParams =
	| { filter: string; bias?: string }
	| { filter?: string; bias: string };

export type SearchParams = {
	apiKey: string;
	categories: "service.vehicle.fuel";
	conditions?: string;
	limit?: number;
	offset?: number;
	lang?: string;
	name?: string;
} & SpatialParams;