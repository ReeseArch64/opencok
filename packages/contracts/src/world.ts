import { z } from "zod";

const uint = (max: number) => z.number().int().min(0).max(max);
const coordinate = uint(1200);
export const mapQuery = z.strictObject({
    requestId: uint(0xffffffff),
    kingdomId: uint(0xffffffff),
    minX: coordinate,
    minY: coordinate,
    maxX: coordinate,
    maxY: coordinate,
});
export const mapRegion = z.strictObject({
    requestId: uint(0xffffffff),
    // 0 = success, 1 = invalid region/kingdom, 2 = unavailable.
    status: uint(2),
    kingdomId: uint(0xffffffff),
    name: z.string().max(64),
    columns: coordinate,
    rows: coordinate,
    objects: z
        .array(
            z.strictObject({
                id: uint(0xffffffff),
                // 1 = development castle, 2 = wood, 3 = food. Code 4 is reserved.
                kind: uint(4),
                x: coordinate,
                y: coordinate,
                width: uint(16),
                height: uint(16),
                level: uint(100),
            }),
        )
        .max(256),
    blocked: z.array(z.strictObject({ x: coordinate, y: coordinate })).max(4096),
});
export const packets = [
    { name: "MapQuery", opcode: 16, schema: mapQuery },
    { name: "MapRegion", opcode: 17, schema: mapRegion },
] as const;
export type MapQuery = z.infer<typeof mapQuery>;
export type MapRegion = z.infer<typeof mapRegion>;
