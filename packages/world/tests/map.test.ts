import { expect, test } from "bun:test";
import { pointSections } from "@opencok/world/mappings/world-map";
import { viewport } from "@opencok/world/rules/viewport";
import { Type } from "@opencok/messages/sfs";

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
