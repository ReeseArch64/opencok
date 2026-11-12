import { describe, expect, test } from "bun:test";
import { mapQuery, mapRegion, packets } from "./world";
import {
    createQuery,
    createRegion,
    queryLimits,
    regionLimits,
    objectLimits,
} from "../tests/support/world-fixtures";

describe("world query schema", () => {
    for (const [field, maximum] of queryLimits)
    {
        test(`${field} accepts unsigned boundaries and rejects invalid scalar values`, () => {
            for (const value of [0, maximum])
            {
                expect(mapQuery.parse({ ...createQuery(), [field]: value })[field]).toBe(value);
            }
            for (const value of [-1, maximum + 1, 0.5, NaN, Infinity, "1", null, undefined])
            {
                expect(mapQuery.safeParse({ ...createQuery(), [field]: value }).success).toBe(
                    false,
                );
            }
        });
    }

    test("requires exactly the six query fields", () => {
        expect(mapQuery.safeParse({ ...createQuery(), extra: 1 }).success).toBe(false);
        for (const field of Object.keys(createQuery()))
        {
            const value: Record<string, unknown> = { ...createQuery() };
            delete value[field];
            expect(mapQuery.safeParse(value).success).toBe(false);
        }
        expect(mapQuery.safeParse(null).success).toBe(false);
        expect(mapQuery.safeParse([]).success).toBe(false);
    });

    test("wire validation does not impose game-specific region ordering", () => {
        const value = createQuery({ minX: 1200, minY: 1200, maxX: 0, maxY: 0, kingdomId: 0 });
        expect(mapQuery.parse(value)).toEqual(value);
    });
});

describe("world region schema", () => {
    for (const [field, maximum] of regionLimits)
    {
        test(`${field} is a required bounded unsigned integer`, () => {
            for (const value of [0, maximum])
            {
                expect(mapRegion.parse({ ...createRegion(), [field]: value })[field]).toBe(value);
            }
            for (const value of [-1, maximum + 1, 0.5, NaN, Infinity, "1", null, undefined])
            {
                expect(mapRegion.safeParse({ ...createRegion(), [field]: value }).success).toBe(
                    false,
                );
            }
        });
    }

    for (const [field, maximum] of objectLimits)
    {
        test(`object ${field} retains its wire bounds`, () => {
            const object = createRegion().objects[0]!;
            for (const value of [0, maximum])
            {
                const region = createRegion({ objects: [{ ...object, [field]: value }] });
                expect(mapRegion.parse(region)).toEqual(region);
            }
            for (const value of [-1, maximum + 1, 0.5, "1", null, undefined])
            {
                const region = { ...createRegion(), objects: [{ ...object, [field]: value }] };
                expect(mapRegion.safeParse(region).success).toBe(false);
            }
        });
    }

    test("bounded names and arrays accept their exact schema limits", () => {
        const object = createRegion().objects[0]!;
        const value = createRegion({
            name: "a".repeat(64),
            objects: Array.from({ length: 256 }, () => ({ ...object })),
            blocked: Array.from({ length: 4096 }, () => ({ x: 0, y: 1200 })),
        });
        expect(mapRegion.parse(value)).toEqual(value);
        expect(mapRegion.safeParse({ ...value, name: "a".repeat(65) }).success).toBe(false);
        expect(mapRegion.safeParse({ ...value, objects: [...value.objects, object] }).success).toBe(
            false,
        );
        expect(
            mapRegion.safeParse({ ...value, blocked: [...value.blocked, { x: 0, y: 0 }] }).success,
        )
            .toBe(false);
        expect(mapRegion.parse(createRegion({ name: "", objects: [], blocked: [] }))).toEqual(
            createRegion({ name: "", objects: [], blocked: [] }),
        );
    });

    test("strictness applies to top-level, object and blocked cells", () => {
        const value = createRegion();
        const invalid = [
            { ...value, extra: 1 },
            { ...value, objects: [{ ...value.objects[0], extra: 1 }] },
            { ...value, blocked: [{ x: 0, y: 0, extra: 1 }] },
            { ...value, objects: [null] },
            { ...value, blocked: [{ x: 0 }] },
            { ...value, blocked: [{ y: 0 }] },
            { ...value, objects: null },
            { ...value, blocked: {} },
            { ...value, name: 1 },
        ];
        for (const region of invalid)
        {
            expect(mapRegion.safeParse(region).success).toBe(false);
        }
        for (const field of Object.keys(value))
        {
            const region: Record<string, unknown> = { ...value };
            delete region[field];
            expect(mapRegion.safeParse(region).success).toBe(false);
        }
    });

    test("blocked coordinates are required bounded unsigned integers", () => {
        for (const field of ["x", "y"])
        {
            for (const value of [-1, 1201, 0.5, NaN, Infinity, "1", null, undefined])
            {
                const region = { ...createRegion(), blocked: [{ x: 0, y: 0, [field]: value }] };
                expect(mapRegion.safeParse(region).success).toBe(false);
            }
        }
    });
});

test("the packet registry binds stable names and opcodes to the exported schemas", () => {
    expect(packets).toEqual([
        { name: "MapQuery", opcode: 16, schema: mapQuery },
        { name: "MapRegion", opcode: 17, schema: mapRegion },
    ]);
    expect(new Set(packets.map((packet) => packet.opcode)).size).toBe(packets.length);
});
