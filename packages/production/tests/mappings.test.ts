import { expect, test } from "bun:test";
import {
    encodeProductionRates,
    decodeProductionRates,
    productionBoost,
} from "../src/mappings/production.ts";
import { encode, decode, sfs } from "@opencok/messages/sfs";

test("saved production rates preserve exact decimal checkpoints and reject malformed boundary data", () => {
    const rates = [
        { at: 0n, perHour: 9007199254740993n, capacity: 9223372036854775807n },
        { at: 9007199254740995n, perHour: 0n, capacity: 0n },
    ];
    const encoded = encodeProductionRates(rates);
    expect(encoded).toBe(
        "[[\"0\",\"9007199254740993\",\"9223372036854775807\"],[\"9007199254740995\",\"0\",\"0\"]]",
    );
    expect(decodeProductionRates(encoded)).toEqual(rates);
    for (
        const raw of [
            "null",
            "{}",
            "[]",
            "[[0,\"1\",\"2\"]]",
            "[[\"-1\",\"1\",\"2\"]]",
            "[[\"0\",\"1.5\",\"2\"]]",
            "[[\"0\",\"1\",\"2\", \"3\"]]",
            "[[\"0\",\"1e2\",\"2\"]]",
            "[[\"9223372036854775807\",\"1\",\"2\"]]",
            "[[\"0\",\"9223372036854775808\",\"2\"]]",
            "[[\"0\",\"1\",\"9223372036854775808\"]]",
            "[[\"0\",\"1\",\"123456789012345678901\"]]",
            JSON.stringify(Array.from({ length: 257 }, () => ["0", "0", "0"])),
        ]
    )
    {
        expect(() => decodeProductionRates(raw)).toThrow();
    }
    expect(() => encodeProductionRates([])).toThrow();
    expect(() => encodeProductionRates([{ at: -1n, perHour: 0n, capacity: 0n }])).toThrow();
});

test("production boost replies retain item and paid variants with exact Long values and field order", () => {
    const goods = { uuid: sfs.string("owned-booster"), count: sfs.int(0) };
    const paid = productionBoost(9007199254740993n, 9007199254740995n, 9007199254740997n);
    const item = productionBoost(9007199254740993n, 9007199254740995n, 0n, goods);
    expect(Object.keys(paid)).toEqual(["gold", "effectTime", "refreshTime"]);
    expect(Object.keys(item)).toEqual(["goods", "effectTime", "refreshTime"]);
    expect(decode(encode(paid))).toEqual({
        gold: sfs.long(9007199254740997n),
        effectTime: sfs.long(9007199254740993n),
        refreshTime: sfs.long(9007199254740995n),
    });
    expect(decode(encode(item))).toEqual({
        goods: sfs.object(goods),
        effectTime: sfs.long(9007199254740993n),
        refreshTime: sfs.long(9007199254740995n),
    });
    expect(item).not.toHaveProperty("gold");
    expect(paid).not.toHaveProperty("goods");
});
