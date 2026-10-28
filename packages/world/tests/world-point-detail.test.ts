import { expect, test } from "bun:test";
import { worldPointDetailQuery } from "@opencok/world/rules/world-point-detail";

const now = 1792756800123;

test("point queries preserve signed point IDs and normalize the local realm sentinel", () => {
    for (const server of [undefined, -1, 1])
    {
        expect(worldPointDetailQuery(-1, server, 1, now)).toEqual({ point: -1, kingdomId: 1, now });
    }
    expect(worldPointDetailQuery(2147483647, 2, 1, now).kingdomId).toBe(2);
    for (const server of [0, -2, NaN, Infinity, 1.5, 2147483648])
    {
        expect(() => worldPointDetailQuery(1, server, 1, now)).toThrow();
    }
    for (const point of [NaN, 1.5, -2147483649, 2147483648])
    {
        expect(() => worldPointDetailQuery(point, 1, 1, now)).toThrow();
    }
    expect(() => worldPointDetailQuery(1, 1, 0, now)).toThrow();
    expect(() => worldPointDetailQuery(1, 1, 1, -1)).toThrow();
    expect(() => worldPointDetailQuery(1, 1, 1, 9007199254740992)).toThrow();
});
