import { describe, expect, it } from "vitest";
import { mapQuery, mapRegion, packets } from "../../src/world";
import { wireSchema } from "../../src/binary";
import {
    createQuery,
    createRegion,
    queryFields,
    queryLimits,
    regionLimits,
    objectLimits,
} from "../support/world-fixtures";

describe("stable world wire contract", () => {
    it("keeps the packet registry and schema identities", () => {
        expect(packets.map(({ name, opcode }) => ({ name, opcode }))).toEqual([
            { name: "MapQuery", opcode: 16 },
            { name: "MapRegion", opcode: 17 },
        ]);
        expect(packets[0].schema).toBe(mapQuery);
        expect(packets[1].schema).toBe(mapRegion);
    });

    it("keeps field order, widths and nested array limits", () => {
        const query = wireSchema(mapQuery);
        const region = wireSchema(mapRegion);
        expect(query.type).toBe("object");
        expect(Object.keys(query.properties!)).toEqual(queryFields);
        expect(Object.keys(region.properties!)).toEqual([
            "requestId",
            "status",
            "kingdomId",
            "name",
            "columns",
            "rows",
            "objects",
            "blocked",
        ]);
        for (const [field, maximum] of queryLimits)
        {
            expect(query.properties![field]).toMatchObject({
                type: "integer",
                minimum: 0,
                maximum,
            });
        }
        for (const [field, maximum] of regionLimits)
        {
            expect(region.properties![field]).toMatchObject({
                type: "integer",
                minimum: 0,
                maximum,
            });
        }
        expect(region.properties!.name).toMatchObject({ type: "string", maxLength: 64 });
        const objects = region.properties!.objects!;
        const blocked = region.properties!.blocked!;
        expect(objects).toMatchObject({ type: "array", maxItems: 256 });
        expect(blocked).toMatchObject({ type: "array", maxItems: 4096 });
        expect(Object.keys(objects.items!.properties!)).toEqual([
            "id",
            "kind",
            "x",
            "y",
            "width",
            "height",
            "level",
        ]);
        expect(Object.keys(blocked.items!.properties!)).toEqual(["x", "y"]);
        for (const [field, maximum] of objectLimits)
        {
            expect(objects.items!.properties![field]).toMatchObject({
                type: "integer",
                minimum: 0,
                maximum,
            });
        }
        for (const field of ["x", "y"])
        {
            expect(blocked.items!.properties![field]).toMatchObject({
                type: "integer",
                minimum: 0,
                maximum: 1200,
            });
        }
    });

    it.each(queryLimits)("enforces query %s bounds without coercion", (field, maximum) => {
        for (const value of [0, maximum])
        {
            expect(mapQuery.parse({ ...createQuery(), [field]: value })[field]).toBe(value);
        }
        for (const value of [-1, maximum + 1, 0.5, NaN, Infinity, "1", null, undefined])
        {
            expect(mapQuery.safeParse({ ...createQuery(), [field]: value }).success).toBe(false);
        }
    });

    it.each(regionLimits)("enforces region %s bounds without coercion", (field, maximum) => {
        for (const value of [0, maximum])
        {
            expect(mapRegion.parse({ ...createRegion(), [field]: value })[field]).toBe(value);
        }
        for (const value of [-1, maximum + 1, 0.5, NaN, Infinity, "1", null, undefined])
        {
            expect(mapRegion.safeParse({ ...createRegion(), [field]: value }).success).toBe(false);
        }
    });

    it.each(objectLimits)("enforces object %s bounds without coercion", (field, maximum) => {
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

    it("keeps every field required and rejects unknown fields at every depth", () => {
        for (
            const [schema, value] of [
                [mapQuery, createQuery()],
                [mapRegion, createRegion()],
            ] as const
        )
        {
            expect(schema.safeParse({ ...value, extra: 1 }).success).toBe(false);
            expect(schema.safeParse(null).success).toBe(false);
            expect(schema.safeParse([]).success).toBe(false);
            for (const field of Object.keys(value))
            {
                const partial: Record<string, unknown> = { ...value };
                delete partial[field];
                expect(schema.safeParse(partial).success).toBe(false);
            }
        }
        const object = createRegion().objects[0]!;
        expect(
            mapRegion.safeParse({ ...createRegion(), objects: [{ ...object, extra: 1 }] }).success,
        )
            .toBe(false);
        expect(
            mapRegion.safeParse({ ...createRegion(), blocked: [{ x: 0, y: 0, extra: 1 }] }).success,
        )
            .toBe(false);
        for (const field of Object.keys(object))
        {
            const partial: Record<string, unknown> = { ...object };
            delete partial[field];
            expect(mapRegion.safeParse({ ...createRegion(), objects: [partial] }).success).toBe(
                false,
            );
        }
        for (const field of ["x", "y"])
        {
            for (const value of [-1, 1201, 0.5, "1", null, undefined])
            {
                const region = { ...createRegion(), blocked: [{ x: 0, y: 0, [field]: value }] };
                expect(mapRegion.safeParse(region).success).toBe(false);
            }
        }
    });

    it("preserves bounds rather than inventing additional game rules", () => {
        expect(mapQuery.parse(createQuery({ minX: 1200, maxX: 0, kingdomId: 0 }))).toEqual(
            createQuery({ minX: 1200, maxX: 0, kingdomId: 0 }),
        );
        for (const status of [0, 1, 2])
        {
            expect(mapRegion.parse(createRegion({ status })).status).toBe(status);
        }
        for (const kind of [0, 1, 2, 3, 4])
        {
            const value = createRegion({ objects: [{ ...createRegion().objects[0]!, kind }] });
            expect(mapRegion.parse(value)).toEqual(value);
        }
    });
});
