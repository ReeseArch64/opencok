import { expect, test } from "bun:test";
import { createRealmWorldService } from "../src/composition/world";
import { Rules } from "@opencok/rules/game";
import { sfs, type Value } from "@opencok/messages/sfs";

test("viewport composition projects in viewport order with a clock per point before subscription and marches", async () => {
    const calls: unknown[] = [];
    let now = 1000;
    const service = createRealmWorldService(
        {
            getWorldByPointIds: async (uid, ids) => {
                calls.push(["read", uid, ids.slice(0, 3)]);
                return {
                    world: { worldId: 0, lastMoveCityTime: 9007199254740993n },
                    points: [{ id: 21, pointType: 0 }, { id: 1, pointType: 0 }],
                    hasMarches: true,
                };
            },
        },
        20,
        1,
        {
            rules: new Rules(new Map(), new Map(), new Map()),
            now: () => {
                calls.push(["clock", now]);
                return now++;
            },
            subscribe: async (owner, x, y) => {
                calls.push(["subscribe", owner, x, y]);
            },
            marches: async (ids) => {
                calls.push(["marches", ids.slice(0, 3)]);
                return [];
            },
        },
    );

    const result = await service.get("self", {
        x: sfs.int(0),
        y: sfs.int(0),
        timeStamp: sfs.int(7),
    });

    expect(calls).toEqual([
        ["read", "self", [1, 21, 41]],
        ["clock", 1000],
        ["clock", 1001],
        ["subscribe", "self", 0, 0],
        ["marches", [1, 21, 41]],
    ]);
    const sections = result.points!.value as Value[];
    expect(JSON.parse(String(sections[0]!.value)).map((row: { i: number; }) => row.i)).toEqual([
        1,
        21,
    ]);
    expect(result.timeStamp).toEqual(sfs.int(7));
    expect(result.moveCityTime).toEqual(sfs.long(9007199254740993n));
    expect(result.m).toEqual(sfs.array([]));
});

test("failed viewport subscription prevents live march reads", async () => {
    let reads = 0;
    const service = createRealmWorldService(
        {
            getWorldByPointIds: async () => ({
                world: { worldId: 0 },
                points: [],
                hasMarches: true,
            }),
        },
        20,
        1,
        {
            rules: new Rules(new Map(), new Map(), new Map()),
            subscribe: async () => {
                throw new Error("Synthetic subscription failure");
            },
            marches: async () => {
                reads++;
                return [];
            },
        },
    );

    await expect(service.get("self", { x: sfs.int(0), y: sfs.int(0) })).rejects.toThrow(
        "Synthetic subscription failure",
    );
    expect(reads).toBe(0);
});

test("unsupported realm view rejects before persistence and live callbacks", async () => {
    const calls: string[] = [];
    const service = createRealmWorldService(
        {
            getWorldByPointIds: async () => {
                calls.push("read");
                return { world: { worldId: 0 }, points: [], hasMarches: false };
            },
        },
        20,
        1,
        {
            rules: new Rules(new Map(), new Map(), new Map()),
            subscribe: async () => {
                calls.push("subscribe");
            },
            marches: async () => {
                calls.push("marches");
                return [];
            },
        },
    );

    await expect(service.get("self", { x: sfs.int(0), y: sfs.int(0), serverId: sfs.int(2) }))
        .rejects.toThrow();
    expect(calls).toEqual([]);
});
