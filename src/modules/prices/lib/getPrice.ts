"use server";

// * Data:
import fuelData from "../data/stations-eur-sample.json";

// * Types:
import type { SearchStationsResult } from "@/modules/search/types/search-stations-result.type";
import type { Price } from "../types/price.type";
import { createHash } from "node:crypto";

function normalize(value: string) {
    return value.normalize("NFKD").toLowerCase().replace(/\p{M}/gu, "")
        .replace(/[^\p{L}\p{N}]+/gu, " ").trim();
}

const brands = new Map<string, Price[]>();
for (const sample of fuelData.stations) {
    const key = normalize(sample.brand_name);
    const records = brands.get(key);
    if (records) records.push(sample);
    else brands.set(key, [sample]);
}
for (const records of brands.values()) {
    records.sort((a, b) => a.station_id.localeCompare(b.station_id));
}

// Common words in station names are reliable only as exact brand labels.
const generic = new Set(["petrol", "tank", "oil", "go", "ok", "star", "team", "classic", "match"]);

function findBrand(label: string) {
    const name = normalize(label);
    const exact = brands.get(name);
    if (exact) return exact;

    const matches = [...brands.keys()].filter(brand =>
        !generic.has(brand) && ` ${name} `.includes(` ${brand} `)
    );
    return matches.length === 1 ? brands.get(matches[0]) : undefined;
}

export default async function getPrice(station: SearchStationsResult): Promise<Price | null> {
    if (!station.place_id) return null;
    const label = station.brand?.trim() || station.name;
    const records = label && findBrand(label);
    if (!records) return null;

    const country = station.country_code?.trim().toUpperCase();
    const local = records.filter(sample => sample.country_code === country);
    // A known brand can supply a EUR demo price even without a local sample.
    const candidates = local.length ? local : records;
    const hash = createHash("sha256").update(station.place_id).digest().readUInt32BE(0);
    return candidates[hash % candidates.length];
}
