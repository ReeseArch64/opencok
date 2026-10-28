import { expect, test } from "bun:test";
import { worldFootprint, ordinaryMarchDuration } from "@opencok/rules/world-march-runtime";
import { worldCityCandidates, resolveWorldCityGeometry } from "@opencok/rules/world-city-geometry";
import { Rules } from "@opencok/rules/game";
function city(anchor: number, points: number[], type = 8)
{
    return points.map((id) => ({
        id,
        worldId: 0,
        x: (id - 1) % 10,
        y: Math.floor((id - 1) / 10),
        ownerId: "owner",
        pointType: id === anchor ? 1 : type,
        pointItem: id === anchor ? "" : String(anchor),
    }));
}
test("native city footprints use the source lower-right anchor and reject edge wrapping", () => {
    expect(worldFootprint(12, 10)).toEqual([11, 2, 1, 12]);
    expect(worldFootprint(100, 10)).toEqual([99, 90, 89, 100]);
    for (const point of [1, 10, 11, 91])
    {
        expect(() => worldFootprint(point, 10)).toThrow();
    }
    expect(worldFootprint(1, 10, false)).toEqual([1]);
    expect(worldCityCandidates(1, 10)).toEqual([1, 2, 11, 12]);
});
test("only complete unique owned city evidence identifies legacy and native layouts", () => {
    expect(resolveWorldCityGeometry(1, 10, "owner", city(1, [1, 2, 11, 12]))).toEqual({
        orientation: "legacy",
        anchor: 12,
        points: [1, 2, 11, 12],
    });
    expect(resolveWorldCityGeometry(12, 10, "owner", city(12, [1, 2, 11, 12]))?.orientation).toBe(
        "native",
    );
    expect(resolveWorldCityGeometry(1, 10, "owner", city(1, [1, 2, 11]))).toBeUndefined();
    expect(resolveWorldCityGeometry(1, 10, "foreign", city(1, [1, 2, 11, 12]))).toBeUndefined();
    expect(
        resolveWorldCityGeometry(12, 10, "owner", city(12, [1, 2, 11, 12, 13, 22, 23])),
    ).toBeUndefined();
});
test("future native routes measure the same physical city as an explicitly retained legacy footprint", () => {
    const rules = new Rules(new Map(), new Map(), new Map());
    rules.items.set("world_marchtime", {
        id: "world_marchtime",
        k1: "1",
        k2: "60",
        k3: "60",
        k5: "1",
    });
    expect(ordinaryMarchDuration(rules, 10, 12, 8, 1, 0)).toBe(
        ordinaryMarchDuration(rules, 10, 1, 8, 1, 0, true, false, 0, false, [1, 2, 11, 12]),
    );
    expect(ordinaryMarchDuration(rules, 10, 12, 8, 1, 0)).not.toBe(
        ordinaryMarchDuration(rules, 10, 23, 8, 1, 0),
    );
});

test("native source ranges can omit ownership and retain unused point metadata", () => {
    const rows = city(12, [1, 2, 11, 12]).map((row) =>
        row.id === 12 ? row : { ...row, ownerId: "", pointItem: "stale-unused-range-value" }
    );
    expect(resolveWorldCityGeometry(12, 10, "owner", rows)?.points).toEqual([11, 2, 1, 12]);
    expect(
        resolveWorldCityGeometry(
            1,
            10,
            "owner",
            city(1, [1, 2, 11, 12]).map((row) => (row.id === 1 ? row : { ...row, ownerId: "" })),
        ),
    ).toBeUndefined();
});

test("maintained type-two ranges retain legacy evidence despite their previously unassigned pointItem", () => {
    const rows = city(1, [1, 2, 11, 12], 2).map((row) =>
        row.id === 1 ? row : { ...row, pointItem: "retained-free-tile-value" }
    );
    expect(resolveWorldCityGeometry(1, 10, "owner", rows)?.orientation).toBe("legacy");
});
