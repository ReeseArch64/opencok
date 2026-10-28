import { expect, test } from "bun:test";
import { createRealmCompactPoint } from "../src/composition/world";
import { Rules, type Rule } from "@opencok/rules/game";
import type { Row } from "@opencok/contracts/rows";

const compactPoint = (row: Row, cosmetics: readonly Row[] = [], rules?: Rules, now?: bigint) =>
    createRealmCompactPoint(rules)(row, cosmetics, now);

test("world rows use compact keys and seconds; unknown specialized points fail", () => {
    expect(
        JSON.parse(
            compactPoint({
                id: 7,
                pointType: 1,
                resLevel: 33,
                ownerName: "Synthetic",
                resInitValue: 90,
                resCostValue: 20,
                shieldTime: 123456n,
            }),
        ),
    ).toEqual({
        i: 7,
        t: 1,
        l: 30,
        sl: 3,
        o: "Synthetic",
        v: 70,
        pt: 123,
        pt_resource: 0,
        ft: 0,
        rt: 0,
        st: 0,
    });
    expect(() => compactPoint({ id: 1, pointType: 99 })).toThrow();
});
test("native fixed reservations and stored monster points remain visible without combat outcomes", () => {
    for (const type of [6, 7, 9, 10, 11, 12, 13, 15, 17, 44, 45, 48])
    {
        const result = JSON.parse(compactPoint({ id: 7, pointType: type, resLevel: 1 }));
        expect(result.t).toBe(type);
        expect(result.l).toBe(1);
        expect(result.mchp).toBeUndefined();
        expect(result.mc_state).toBe(type === 6 ? 0 : undefined);
    }
    expect(JSON.parse(compactPoint({ id: 7, pointType: 6, monsterCastleState: 3 })).mc_state).toBe(
        3,
    );
    expect(() => compactPoint({ id: 7, pointType: 9, pointItem: "missing" })).toThrow();
});

test("map monster health and NPC remaining counts derive from native catalogues without changing rows", () => {
    const rules = new Rules(new Map(), new Map(), new Map());
    rules.world.fieldMonsters = new Map<string, Rule>([
        ["npc", { NPC: "1", Gift: "123" }],
        ["monster", { army: "army" }],
        ["negative", { NPC: "1", Gift: "-4" }],
    ]);
    rules.world.armies = new Map([["army", { arm: "unit;3|other;4" }]]);
    for (const type of [9, 15])
    {
        for (const current of [-1, 0, 4])
        {
            const row = { id: 7, pointType: type, pointItem: "monster", monsterCurrHP: current };
            const result = JSON.parse(compactPoint(row, [], rules));
            expect(result.mchp).toBe(current > 0 ? current : 7);
            expect(result.mmhp).toBe(7);
            expect(result.mrn).toBeUndefined();
            expect(row.monsterCurrHP).toBe(current);
        }
    }
    for (
        const [raw, expected] of [
            ["  12\n", 111],
            ["", 123],
            ["  ", 123],
            ["999", 0],
            ["-2147483648", 0],
        ] as const
    )
    {
        const result = JSON.parse(
            compactPoint(
                { id: 7, pointType: 9, pointItem: "npc", monsterInfo: Buffer.from(raw) },
                [],
                rules,
            ),
        );
        expect(result.mrn).toBe(expected);
    }
    expect(
        JSON.parse(
            compactPoint(
                { id: 7, pointType: 9, pointItem: "npc", monsterInfo: Buffer.from([255]) },
                [],
                rules,
            ),
        ).mrn,
    ).toBe(123);
    expect(() =>
        compactPoint(
            { id: 7, pointType: 9, pointItem: "npc", monsterInfo: Buffer.from("oops") },
            [],
            rules,
        )
    ).toThrow();
    const negative = JSON.parse(
        compactPoint({ id: 7, pointType: 15, pointItem: "negative" }, [], rules),
    );
    expect(negative.mchp).toBe(0);
    expect(negative.mmhp).toBe(-4);
    expect(negative.mrn).toBe(0);
});

test("compact map seconds retain native Java signed integer conversion", () => {
    const result = JSON.parse(
        compactPoint({ id: 1, pointType: 0, flushTime: 2147483648000n, startTime: -1999n }),
    );
    expect(result.rt).toBe(-2147483648);
    expect(result.st).toBe(-1);
});
