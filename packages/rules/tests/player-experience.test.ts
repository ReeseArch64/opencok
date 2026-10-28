import { expect, test } from "bun:test";
import { Rules } from "../src/game";
import { planPlayerExperience, type PlayerExperienceInput } from "../src/player-experience";

function fixture(thresholds = [10, 20, 30], maximum = thresholds.length)
{
    const rules = new Rules(new Map(), new Map(), new Map());
    rules.items.set("player_max", { k1: String(maximum) });
    for (const [index, player_exp] of thresholds.entries())
    {
        rules.roles.set(String(100101 + index), { player_exp: String(player_exp) });
    }
    return rules;
}

function plan(input: Partial<PlayerExperienceInput>, rules = fixture())
{
    return planPlayerExperience(rules, { level: 1, exp: 0, amount: 0, effect: 0, ...input });
}

test("player experience crosses exact thresholds in order and clamps the final level using its own threshold", () => {
    for (
        const [amount, level, exp] of [
            [0, 1, 0],
            [9, 1, 9],
            [10, 2, 0],
            [29, 2, 19],
            [30, 3, 0],
            [59, 3, 29],
            [60, 3, 30],
            [999, 3, 30],
        ]
    )
    {
        expect(plan({ amount })).toEqual({ level: level!, exp: exp! });
    }
    expect(plan({ exp: 9, amount: 1 })).toEqual({ level: 2, exp: 0 });
    expect(plan({ level: 2, exp: 19, amount: 11 })).toEqual({ level: 3, exp: 10 });
    expect(plan({ exp: 10, amount: 0 })).toEqual({ level: 2, exp: 0 });
});

test("already capped imports retain their saved experience and above-cap levels use the factual maximum role", () => {
    for (const exp of [30, 31, 2147483647])
    {
        expect(plan({ level: 3, exp, amount: 10 })).toEqual({ level: 3, exp });
    }
    expect(plan({ level: 3, exp: 29, amount: 0 })).toEqual({ level: 3, exp: 29 });
    expect(plan({ level: 3, exp: 29, amount: 1 })).toEqual({ level: 3, exp: 30 });
    expect(plan({ level: 4, exp: 5, amount: 999 }, fixture([10, 20, 30, 40], 3))).toEqual({
        level: 3,
        exp: 30,
    });
    expect(plan({ amount: 10 }, fixture([3], 1))).toEqual({ level: 1, exp: 3 });
});

test("experience uses a float32 effect followed by double arithmetic rather than float32 multiplication", () => {
    const rules = fixture([2147483647, 2147483647]);
    for (
        const [effect, amount, exp] of [
            [0.1, 10000000, 10010000],
            [1.00000006, 1000000000, 1010000001],
            [33.333333, 1000000000, 1333333320],
            [99.999999, 1000000000, 2000000000],
            [12.3456789, 1000000000, 1123456792],
        ]
    )
    {
        expect(plan({ effect, amount }, rules)).toEqual({ level: 1, exp: exp! });
    }
    expect(plan({ amount: 16777217 }, rules)).toEqual({ level: 1, exp: 16777217 });
});

test("negative modifiers clamp to zero and Java narrowing truncates the full old experience plus fractional award", () => {
    for (const effect of [-100, -200, -3.4028234663852886e38])
    {
        expect(plan({ exp: 3, amount: 20, effect })).toEqual({ level: 1, exp: 3 });
    }
    expect(plan({ amount: 3, effect: -50 })).toEqual({ level: 1, exp: 1 });
    expect(plan({ exp: 3, amount: 3, effect: 50 })).toEqual({ level: 1, exp: 7 });
    expect(plan({ exp: -3, amount: 1, effect: 50 })).toEqual({ level: 1, exp: -1 });
    expect(plan({ exp: -1, amount: 1, effect: -50 })).toEqual({ level: 1, exp: 0 });
    expect(plan({ exp: -2147483648, amount: 2147483647 })).toEqual({ level: 1, exp: -1 });
});

test("double-to-int overflow saturates before threshold subtraction and zero thresholds remain catalog-driven", () => {
    const rules = fixture([2147483647, 2147483647, 2147483647]);
    expect(plan({ amount: 2147483647, effect: 100 }, rules)).toEqual({ level: 2, exp: 0 });
    expect(plan({ exp: 1, amount: 2147483647, effect: 3.4028234663852886e38 }, rules)).toEqual({
        level: 2,
        exp: 0,
    });
    expect(plan({ amount: 0 }, fixture([0, 0, 5]))).toEqual({ level: 3, exp: 0 });
    expect(plan({ amount: 0 }, fixture([0]))).toEqual({ level: 1, exp: 0 });
});

test("experience never invents missing maximums or role thresholds and rejects invalid award inputs", () => {
    for (
        const input of [
            { amount: -1 },
            { amount: 0.5 },
            { amount: 2147483648 },
            { level: 0 },
            { exp: 0.5 },
            { exp: -2147483649 },
            { effect: NaN },
            { effect: Infinity },
            { effect: 1e40 },
        ]
    )
    {
        expect(() => plan(input)).toThrow();
    }
    const rules = fixture();
    rules.items.delete("player_max");
    expect(() => plan({}, rules)).toThrow();
    for (const k1 of ["0", "-1", "1.5", "2147483648"] as const)
    {
        rules.items.set("player_max", { k1 });
        expect(() => plan({}, rules)).toThrow();
    }
    rules.items.set("player_max", { k1: "3" });
    rules.roles.delete("100102");
    expect(() => plan({ amount: 10 }, rules)).toThrow();
    expect(() => plan({ level: 4 }, rules)).toThrow();
    rules.roles.set("100101", {});
    expect(() => plan({}, rules)).toThrow();
});
