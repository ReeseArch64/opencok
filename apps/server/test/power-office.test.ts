import { expect, test } from "bun:test";
import type { Row } from "@opencok/contracts/rows";
import { Rules, type Rule } from "@opencok/rules/game";
import { kingdomFightActive, officeEffects } from "@opencok/rules/power-office";

const context = { now: 1792756800000, kingdomId: 1, version: "12.06.0" };
const office = { positionId: "216002", serverId: 1 };
const fight = {
    type: 0,
    openTime: BigInt(context.now - 1000),
    startTime: BigInt(context.now),
    endTime: BigInt(context.now + 10000),
};

function fixture()
{
    const rules = new Rules(
        new Map(),
        new Map(),
        new Map(),
        new Map(),
        new Map(),
        new Map(),
        new Map(),
        new Map(),
        1,
        new Map(),
        {},
        { offices: new Map() },
    );
    rules.features.set("officials", { id: "officials", version: "99.0.0", online: "1" });
    rules.power.offices!.set("216002", {
        id: "216002",
        para1: "487;218;487;999",
        para2: "12;-5;99;2147483647",
    });
    rules.power.offices!.set("216000", { id: "216000", para1: "487", para2: "25" });
    return rules;
}

test("office effects normalize the persisted position and preserve first duplicate integer values", () => {
    const rules = fixture();
    const world = new Map([
        [306, 0],
        [487, 500],
    ]);
    const before = structuredClone(office);
    const expected = new Map([
        [487, 12],
        [218, -5],
        [999, 2147483647],
    ]);
    expect(officeEffects(office, [], world, rules, context)).toEqual(expected);
    expect(
        officeEffects({ ...office, positionId: "100002", serverId: 2 }, [], world, rules, context),
    ).toEqual(expected);
    expect(office).toEqual(before);
    expect(world).toEqual(
        new Map([
            [306, 0],
            [487, 500],
        ]),
    );
});

test("unassigned, unknown and local ready-king positions do not receive office bonuses", () => {
    const rules = fixture();
    for (
        const row of [
            undefined,
            { ...office, positionId: "216017" },
            { ...office, positionId: "-1" },
            { ...office, positionId: "216000000" },
        ]
    )
    {
        expect(officeEffects(row, [], new Map(), rules, context).size).toBe(0);
    }
    expect(
        officeEffects({ positionId: "216000000", serverId: 2 }, [], new Map(), rules, context),
    ).toEqual(new Map([[487, 25]]));
});

test("office suppression uses the server gate and the fight window with a five-second cutoff", () => {
    const rules = fixture();
    expect(officeEffects(office, [fight], new Map(), rules, context).size).toBe(0);
    expect(
        officeEffects(office, [fight], new Map(), rules, { ...context, now: context.now + 4999 })
            .size,
    ).toBe(0);
    for (const now of [context.now - 1, context.now + 5000, context.now + 10000])
    {
        expect(officeEffects(office, [fight], new Map(), rules, { ...context, now }).get(487)).toBe(
            12,
        );
    }
    rules.features.get("officials")!.online = "2";
    expect(officeEffects(office, [fight], new Map(), rules, context).get(487)).toBe(12);
    expect(officeEffects(office, [fight], new Map(), rules, { ...context, kingdomId: 2 }).size)
        .toBe(
            0,
        );
    rules.features.clear();
    expect(officeEffects(office, [fight], new Map(), rules, context).get(487)).toBe(12);
});

test("positive world officer prohibition suppresses bonuses independently of the battle gate", () => {
    const rules = fixture();
    rules.features.clear();
    rules.power.offices!.clear();
    expect(officeEffects(office, [], new Map([[306, 0.001]]), rules, context).size).toBe(0);
    for (const value of [0, -1])
    {
        expect(() => officeEffects(office, [], new Map([[306, value]]), rules, context)).toThrow();
    }
});

test("fight reconstruction honors positive clocks, exact long deadlines and unrelated activity types", () => {
    expect(kingdomFightActive([], context.now)).toBe(false);
    const inactive: Row[] = [
        { ...fight, type: 1 },
        { ...fight, openTime: 0n },
        { ...fight, openTime: BigInt(context.now + 1) },
        { ...fight, startTime: 0n },
        { ...fight, startTime: BigInt(context.now + 1) },
        { ...fight, endTime: 0n },
        { ...fight, endTime: BigInt(context.now + 5000) },
    ];
    for (const row of inactive)
    {
        expect(kingdomFightActive([row], context.now)).toBe(false);
    }
    expect(kingdomFightActive([fight, { ...fight, type: 1 }], context.now)).toBe(true);
    expect(kingdomFightActive([{ ...fight, endTime: 9007199254740993n }], context.now)).toBe(true);
    expect(kingdomFightActive([{ ...fight, openTime: BigInt(context.now) }], context.now)).toBe(
        true,
    );
});

test("ambiguous fight schedules and malformed active inputs fail without fabricating a modifier", () => {
    expect(() => kingdomFightActive([fight, fight], context.now)).toThrow();
    expect(() => kingdomFightActive([{ ...fight, endTime: "9223372036854775808" }], context.now))
        .toThrow();
    expect(() => kingdomFightActive([fight], Number.NaN)).toThrow();
    const rules = fixture();
    expect(() => officeEffects({ ...office, positionId: "invalid" }, [], new Map(), rules, context))
        .toThrow();
    rules.power.offices!.clear();
    expect(() => officeEffects(office, [], new Map(), rules, context)).toThrow();
    expect(officeEffects(undefined, [fight, fight], new Map(), rules, context).size).toBe(0);
});

test("office parameter shape follows paired lists and validates signed integer values", () => {
    const rules = fixture();
    const incomplete: Rule[] = [
        { id: "216002" },
        { id: "216002", para1: "487" },
        { id: "216002", para1: "487;218", para2: "1" },
    ];
    for (const rule of incomplete)
    {
        rules.power.offices!.set("216002", rule);
        expect(officeEffects(office, [], new Map(), rules, context).size).toBe(0);
    }
    rules.power.offices!.set("216002", { id: "216002", para1: ";487;;218;", para2: ";-3;;7;" });
    expect(officeEffects(office, [], new Map(), rules, context)).toEqual(
        new Map([
            [487, -3],
            [218, 7],
        ]),
    );
    for (const value of ["1.5", "2147483648", "invalid"])
    {
        rules.power.offices!.set("216002", { id: "216002", para1: "487", para2: value });
        expect(() => officeEffects(office, [], new Map(), rules, context)).toThrow();
    }
});
