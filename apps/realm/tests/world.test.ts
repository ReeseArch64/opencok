import { expect, test } from "bun:test";
import { World } from "../src/modules/world/world";
import { handler } from "../src/handler";
import { decodePacket, encodePacket } from "@opencok/contracts/binary";

const query = {
    requestId: 42,
    kingdomId: 1,
    minX: 568,
    minY: 568,
    maxX: 575,
    maxY: 575,
};
test("regions clip objects by footprint and do not leak outside their region", () => {
    const world = new World();
    expect(world.query(query).objects.map((o) => o.id)).toEqual([1, 3]);
    expect(
        world
            .query({ ...query, minX: 571, maxX: 571, minY: 571, maxY: 571 })
            .objects.map((o) => o.id),
    ).toEqual([1]);
    expect(
        world.query({ ...query, minX: 1, minY: 1, maxX: 1, maxY: 1 }).objects,
    ).toEqual([]);
    const snapshot = world.query(query);
    const firstObject = snapshot.objects[0];
    if (!firstObject)
    {
        throw new Error("Expected an object in the queried region");
    }
    firstObject.x = 1;
    expect(world.query(query).objects[0]?.x).toBe(570);
});
test("coordinates, realm and region budgets are checked before reading", () => {
    const world = new World();
    for (
        const invalid of [
            { minX: 0 },
            { maxX: 1201 },
            { maxX: 567 },
            { minX: 1, maxX: 65 },
            { minY: 1, maxY: 65 },
            { kingdomId: 2 },
        ]
    )
    {
        const result = world.query({ ...query, ...invalid });
        expect(result.status).toBe(1);
        expect(result.objects).toEqual([]);
        expect(result.blocked).toEqual([]);
    }
    expect(
        world.query({ ...query, minX: 1137, minY: 1137, maxX: 1200, maxY: 1200 })
            .status,
    ).toBe(0);
});
test("central reserve and repeated terrain agree with the Flutter layout", async () => {
    const world = new World();
    const layout = await Bun.file(
        new URL(
            "../../../app/assets/world_map/kingdom_layout.json",
            import.meta.url,
        ),
    ).json();
    for (const layer of layout.layers)
    {
        for (const [col, row, image] of layer.tiles)
        {
            if (
                (image >= 5 && image <= 23)
                || (image >= 44 && image <= 61)
                || (image >= 100 && image < 1000)
            )
            {
                expect(
                    world.blocked(600 - 28 + col + 57 * 2, 600 - 28 + row + 57 * 2),
                ).toBe(true);
            }
        }
    }
    expect(world.blocked(570, 570)).toBe(false);
    expect(world.blocked(596, 596)).toBe(true);
    expect(world.blocked(605, 605)).toBe(true);
    expect(world.blocked(606, 606)).toBe(false);
    expect(
        world.query({ ...query, minX: 596, minY: 596, maxX: 605, maxY: 605 })
            .blocked.length,
    ).toBe(100);
});
test("HTTP boundary validates malformed, oversized and unsupported packets", async () => {
    const fetch = handler();
    const good = await fetch(
        new Request("http://realm/map/query", {
            method: "POST",
            body: encodePacket(16, query).slice().buffer,
        }),
    );
    expect(good.status).toBe(200);
    expect(
        decodePacket(new Uint8Array(await good.arrayBuffer())).value,
    ).toMatchObject({ requestId: 42, status: 0 });
    for (const size of [0, 1, 25, 27, 100])
    {
        const response = await fetch(
            new Request("http://realm/map/query", {
                method: "POST",
                body: new Uint8Array(size),
            }),
        );
        expect(response.status).toBe(size > 26 ? 413 : 400);
    }
    expect((await fetch(new Request("http://realm/map/query"))).status).toBe(404);
});
