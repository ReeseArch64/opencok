import { expect, test } from "bun:test";
import { compactPoint, pointSections } from "@opencok/world/mappings/world-map";
import { viewport } from "@opencok/world/rules/viewport";
import type { WorldPointProjections } from "@opencok/world/contracts/runtime";
import { Type } from "@opencok/messages/sfs";

const projections: WorldPointProjections = {
    cosmetics: () => ({}),
    monster: () => ({}),
};

test("compact castle points serialize resolved alliance abbreviations", () => {
    const alliances = new Map([
        ["guild", { uid: "guild", abbr: "联盟" }],
        ["empty", { uid: "empty", abbr: "" }],
        ["missing-name", { uid: "missing-name", abbr: null }],
    ]);
    const allied = JSON.parse(
        compactPoint(
            { id: 1, pointType: 1, allianceId: "guild" },
            [],
            projections,
            0n,
            alliances,
        ),
    );
    expect(allied).toMatchObject({ ai: "guild", asn: "联盟" });
    expect(
        JSON.parse(
            compactPoint(
                { id: 3, pointType: 1, allianceId: "empty" },
                [],
                projections,
                0n,
                alliances,
            ),
        ),
    ).toMatchObject({ ai: "empty", asn: "" });
});

test("compact castle points omit abbreviations without an authoritative alliance", () => {
    const alliances = new Map([["guild", { uid: "guild", abbr: "ABC" }]]);
    const unaffiliated = JSON.parse(
        compactPoint({ id: 1, pointType: 1 }, [], projections, 0n, alliances),
    );
    const missing = JSON.parse(
        compactPoint(
            { id: 2, pointType: 1, allianceId: "deleted" },
            [],
            projections,
            0n,
            alliances,
        ),
    );
    const missingName = JSON.parse(
        compactPoint(
            { id: 3, pointType: 1, allianceId: "unnamed" },
            [],
            projections,
            0n,
            new Map([["unnamed", { uid: "unnamed", abbr: null }]]),
        ),
    );
    expect(unaffiliated.ai).toBeUndefined();
    expect(unaffiliated.asn).toBeUndefined();
    expect(missing).toMatchObject({ ai: "deleted" });
    expect(missing.asn).toBeUndefined();
    expect(missingName).toMatchObject({ ai: "unnamed" });
    expect(missingName.asn).toBeUndefined();
});

test("legacy isometric viewport has 340 tiles at center and clips at kingdom edges", () => {
    const points = viewport(600, 600, 1200);
    expect(points.length).toBe(340);
    expect(points).toContain(1 + 600 + 600 * 1200);
    expect(new Set(points).size).toBe(points.length);
    expect(viewport(0, 0, 1200).every((id) => id >= 1 && id <= 1440000)).toBe(true);
});

test("v12 point sections contain JSON objects below the signed-short UTF limit", () => {
    const points = Array.from(
        { length: 200 },
        (_, i) => JSON.stringify({ i, o: "城".repeat(100) }),
    );
    const output = pointSections(points);
    expect(output.points?.type).toBe(Type.Array);
    const parts = output.points!.value as { value: string; }[];
    expect(parts.flatMap((p) => JSON.parse(p.value))).toEqual(
        points.map((point) => JSON.parse(point)),
    );
    expect(parts.every((p) => Buffer.byteLength(p.value) < 32767)).toBe(true);
});

test("map sections reject malformed or non-object points", () => {
    for (const point of ["null", "[]", "1", "\"point\"", "{"])
    {
        expect(() => pointSections([point])).toThrow();
    }
});
