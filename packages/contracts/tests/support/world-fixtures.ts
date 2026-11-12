import type { MapQuery, MapRegion } from "../../src/world";

export function createQuery(overrides: Partial<MapQuery> = {}): MapQuery
{
    return {
        requestId: 42,
        kingdomId: 1,
        minX: 568,
        minY: 568,
        maxX: 575,
        maxY: 575,
        ...overrides,
    };
}

export function createRegion(overrides: Partial<MapRegion> = {}): MapRegion
{
    return {
        requestId: 42,
        status: 0,
        kingdomId: 1,
        name: "Reino",
        columns: 1200,
        rows: 1200,
        objects: [{ id: 1, kind: 1, x: 570, y: 570, width: 2, height: 2, level: 1 }],
        blocked: [{ x: 574, y: 574 }],
        ...overrides,
    };
}

export function replaceUint(bytes: Uint8Array, offset: number, value: number): Uint8Array
{
    const result = bytes.slice();
    new DataView(result.buffer).setUint32(offset, value);
    return result;
}

export const queryFields = ["requestId", "kingdomId", "minX", "minY", "maxX", "maxY"] as const;

export const queryLimits = [
    ["requestId", 0xffffffff],
    ["kingdomId", 0xffffffff],
    ["minX", 1200],
    ["minY", 1200],
    ["maxX", 1200],
    ["maxY", 1200],
] as const;

export const regionLimits = [
    ["requestId", 0xffffffff],
    ["status", 2],
    ["kingdomId", 0xffffffff],
    ["columns", 1200],
    ["rows", 1200],
] as const;

export const objectLimits = [
    ["id", 0xffffffff],
    ["kind", 4],
    ["x", 1200],
    ["y", 1200],
    ["width", 16],
    ["height", 16],
    ["level", 100],
] as const;
