import assert from "node:assert/strict";
import test from "node:test";
import { calculateRanking } from "./calculateRanking.ts";

const station = (id, price, distance) => ({
    station: { place_id: id, prices: { pb95: price } },
    route: distance === null ? null : { distance, time: 60 },
});

test("driving can outweigh a cheaper pump price, and consumption changes the winner", () => {
    const results = [station("far", 1.5, 20000), station("near", 1.55, 1000)];
    const high = calculateRanking(results, 10);
    assert.equal(high[0].station.place_id, "near");
    assert.equal(high[0].costs.fuel, 62);
    assert.ok(Math.abs(high[0].costs.driving - 0.155) < 1e-10);
    assert.ok(Math.abs(high[0].costs.total - 62.155) < 1e-10);
    assert.equal(calculateRanking(results, 2)[0].station.place_id, "far");
    assert.equal(results[0].station.place_id, "far", "input order must stay unchanged");
});

test("unavailable or invalid costs go last and never receive a cost", () => {
    const results = [station("no-price", null, 100), station("no-route", 1, null),
        station("bad-price", NaN, 100), station("negative-distance", 1, -1), station("valid", 2, 0)];
    const ranked = calculateRanking(results, 7);
    assert.equal(ranked[0].station.place_id, "valid");
    assert.deepEqual(ranked[0].costs, { fuel: 80, driving: 0, total: 80 });
    assert.ok(ranked.slice(1).every(item => item.costs === null));
    for (const invalid of [NaN, Infinity, 0, -1, 101]) {
        assert.ok(calculateRanking(results, invalid).every(item => item.costs === null));
    }
});

test("equal totals prefer the shorter drive", () => {
    const ranked = calculateRanking([station("far", 1, 100000), station("near", 1.25, 0)], 10);
    assert.equal(ranked[0].station.place_id, "near");
    assert.equal(ranked[0].costs.total, ranked[1].costs.total);
});
