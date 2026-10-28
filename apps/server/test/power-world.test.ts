import { expect, test } from "bun:test";
import { Cache } from "@opencok/storage/session";
import { decodeWorldPowerEffects } from "@opencok/services/power";
import { worldPowerEffects } from "@opencok/rules/power-world";
import { Rules } from "@opencok/rules/game";

const context = { now: 1792756800000, kingdomId: 2, version: "12.06.0" };
class WorldCache extends Cache
{
    calls: string[][] = [];
    response: unknown = [];
    fail = false;
    constructor(kingdomId = 2)
    {
        super({ kingdomId, redisUrl: "redis://unused.invalid", timeoutMs: 1000 });
    }
    override async command(command: string, ...args: string[])
    {
        this.calls.push([command, ...args]);
        if (this.fail)
        {
            throw new Error("Synthetic Redis failure");
        }
        return this.response;
    }
}

test("world effects read one realm hash and retain stored JSON without issuing writes", async () => {
    const cache = new WorldCache();
    expect(await cache.worldEffects()).toEqual(new Map());
    const json = "{\"value\":\"0.1\",\"endTime\":9007199254740993}";
    cache.response = ["487", json, "218", "{\"value\":\"20\"}"];
    const records = await cache.worldEffects();
    expect(records).toEqual(
        new Map([
            ["487", json],
            ["218", "{\"value\":\"20\"}"],
        ]),
    );
    expect(cache.calls).toEqual(Array(2).fill(["HGETALL", "opencok:kingdom:2:world-effects"]));
    const other = new WorldCache(1);
    await other.worldEffects();
    expect(other.calls).toEqual([["HGETALL", "opencok:kingdom:1:world-effects"]]);
    const effects = decodeWorldPowerEffects(records);
    expect(effects).toEqual([
        { id: 487, value: "0.1", endTime: 9007199254740993n },
        { id: 218, value: "20", endTime: undefined },
    ]);
    expect(worldPowerEffects(effects, new Rules(new Map(), new Map(), new Map()), context)).toEqual(
        new Map([
            [487, Math.fround(0.1)],
            [218, 20],
        ]),
    );
});

test("explicit destination realm routes world effects without changing the cache's local realm", async () => {
    const cache = new WorldCache(1);
    await cache.worldEffects(2);
    await cache.worldEffects();
    expect(cache.calls).toEqual([
        ["HGETALL", "opencok:kingdom:2:world-effects"],
        ["HGETALL", "opencok:kingdom:1:world-effects"],
    ]);
    for (const kingdomId of [0, -1, NaN, 1.5])
    {
        await expect(cache.worldEffects(kingdomId)).rejects.toThrow();
    }
    expect(cache.calls).toHaveLength(2);
});

test("world hash validation rejects malformed responses, duplicate fields and oversized payloads", async () => {
    const cache = new WorldCache();
    for (
        const response of [
            null,
            {},
            ["487"],
            [487, "{}"],
            ["487", null],
            ["487", "{}", "487", "{}"],
            ["0487", "{}"],
            ["2147483648", "{}"],
            ["487", "x".repeat(65536)],
            Array(8194).fill("x"),
        ]
    )
    {
        cache.response = response;
        await expect(cache.worldEffects()).rejects.toThrow();
    }
    cache.response = Array.from({ length: 17 }, (_, index) => [
        String(index),
        "x".repeat(65535),
    ]).flat();
    await expect(cache.worldEffects()).rejects.toThrow();
    for (const kingdom of [0, -1, 1.5, NaN])
    {
        const invalid = new WorldCache(kingdom);
        await expect(invalid.worldEffects()).rejects.toThrow();
        expect(invalid.calls).toEqual([]);
    }
    cache.fail = true;
    await expect(cache.worldEffects()).rejects.toThrow("Synthetic Redis failure");
});

test("world JSON skips records without values and rejects inexact deadline shapes with sanitized errors", () => {
    expect(decodeWorldPowerEffects(new Map([["487", "{\"endTime\":\"ignored\"}"]]))).toEqual([]);
    for (
        const json of [
            "null",
            "[]",
            "private-invalid",
            "{\"value\":20}",
            "{\"value\":\"1\",\"endTime\":null}",
            "{\"value\":\"1\",\"endTime\":\"123\"}",
            "{\"value\":\"1\",\"endTime\":1.5}",
            "{\"value\":\"1\",\"endTime\":1e3}",
            "{\"value\":\"1\",\"endTime\":9223372036854775808}",
        ]
    )
    {
        expect(() => decodeWorldPowerEffects(new Map([["487", json]]))).toThrow("102192");
    }
    for (const id of ["-1", "0487", "2147483648", "private-invalid"])
    {
        expect(() => decodeWorldPowerEffects(new Map([[id, "{\"value\":\"1\"}"]]))).toThrow(
            "102192",
        );
    }
    expect(() =>
        decodeWorldPowerEffects(
            new Map(Array.from({ length: 4097 }, (_, id) => [String(id), "{}"])),
        )
    ).toThrow("102192");
});

test("world effect expiry is exclusive and old malformed values do not survive reconstruction", () => {
    const rules = new Rules(new Map(), new Map(), new Map());
    const records = [
        { id: 487, value: "invalid", endTime: BigInt(context.now) },
        { id: 218, value: "25", endTime: BigInt(context.now + 1) },
        { id: 207, value: "2.5", endTime: undefined },
    ];
    const before = structuredClone(records);
    expect(worldPowerEffects(records, rules, context)).toEqual(
        new Map([
            [218, 25],
            [207, 2.5],
        ]),
    );
    expect(records).toEqual(before);
    for (const value of ["NaN", "Infinity", "1e100", "", "0x10"])
    {
        expect(() => worldPowerEffects([{ id: 487, value, endTime: undefined }], rules, context))
            .toThrow("102192");
    }
});

test("special world effects honor the server gate while ordinary power modifiers remain available", () => {
    const rules = new Rules(new Map(), new Map(), new Map());
    const gated = [
        307,
        308,
        309,
        310,
        400,
        ...Array.from({ length: 17 }, (_, index) => 2143 + index),
    ];
    const ordinary = [56, 57, 144, 487, 218, 2142, 2160];
    const records = [...gated, ...ordinary].map((id) => ({ id, value: "5", endTime: undefined }));
    expect([...worldPowerEffects(records, rules, context).keys()]).toEqual(ordinary);
    rules.features.set("server_buff", { id: "server_buff", version: "99.0.0", online: "2" });
    expect(worldPowerEffects(records, rules, context).size).toBe(records.length);
    rules.features.get("server_buff")!.online = "1";
    expect([...worldPowerEffects(records, rules, context).keys()]).toEqual(ordinary);
    expect(worldPowerEffects(records, rules, context, true).size).toBe(records.length);
});
