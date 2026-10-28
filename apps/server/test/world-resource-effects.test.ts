import { expect, test } from "bun:test";
import { Rules } from "@opencok/rules/game";
import { resourceExpeditionLoadEffect } from "@opencok/rules/world-resource-effects";

const context = { now: Date.UTC(2026, 9, 23, 12), kingdomId: 1, version: "0.0.0" };
function fixture()
{
    const rules = new Rules(new Map(), new Map(), new Map());
    for (const key of ["tech_newEffect", "17_wk"])
    {
        rules.features.set(key, {
            version: "99.0.0",
            online: "1",
            test: "2",
            start: "2026-10-23-12-00",
            end: "2026-10-23-13-00",
        });
    }
    const state = { mergeServer: false, stage: 3, homeKingdomId: 1 };
    let reads = 0;
    let effects = 0;
    let failRead = false;
    let failEffect = false;
    let value = 12.25;
    return {
        rules,
        state,
        reads: () => reads,
        effects: () => effects,
        failRead: () => {
            failRead = true;
        },
        failEffect: () => {
            failEffect = true;
        },
        setValue: (next: number) => {
            value = next;
        },
        resolve: (patch: Partial<typeof context> & { testServer?: boolean; } = {}) =>
            resourceExpeditionLoadEffect(
                rules,
                { ...context, ...patch },
                () => {
                    reads++;
                    if (failRead)
                    {
                        throw new Error("Unavailable synthetic stage");
                    }
                    return state;
                },
                (id) => {
                    expect(id).toBe(895);
                    effects++;
                    if (failEffect)
                    {
                        throw new Error("Unavailable synthetic effect");
                    }
                    return value;
                },
            ),
    };
}

test("expedition load uses server feature gates without a client-version requirement and inclusive times", () => {
    const f = fixture();
    expect(f.resolve()).toBe(12.25);
    expect(f.resolve({ now: context.now + 3600000 })).toBe(12.25);
    expect(f.resolve({ now: context.now - 1 })).toBe(0);
    expect(f.resolve({ now: context.now + 3600001 })).toBe(0);
    expect(f.resolve({ kingdomId: 2 })).toBe(0);
    expect(f.reads()).toBe(2);
    expect(f.effects()).toBe(2);
    f.state.homeKingdomId = 2;
    expect(f.resolve({ kingdomId: 2, testServer: true })).toBe(12.25);
});

test("disabled expedition features skip context and effect reads", () => {
    for (const key of ["tech_newEffect", "17_wk"])
    {
        const f = fixture();
        f.rules.features.delete(key);
        f.failRead();
        expect(f.resolve()).toBe(0);
        expect(f.reads()).toBe(0);
        expect(f.effects()).toBe(0);
    }
});

test("merge status, replacement feature, collection phase and home kingdom all gate the load effect", () => {
    for (
        const patch of [
            { mergeServer: true },
            ...[0, 1, 2, 4, 5, 6, 7, 8, 9, -1].map((stage) => ({ stage })),
            { homeKingdomId: 2 },
            { homeKingdomId: -2 },
        ]
    )
    {
        const f = fixture();
        Object.assign(f.state, patch);
        expect(f.resolve()).toBe(0);
        expect(f.effects()).toBe(0);
    }
    const f = fixture();
    f.rules.features.set("wk_switch_new", { version: "99.0.0", online: "all" });
    expect(f.resolve()).toBe(0);
    expect(f.effects()).toBe(0);
});

test("conditional load preserves the reference zero-on-exception boundary without hiding ordinary effect failures", () => {
    const stage = fixture();
    stage.failRead();
    expect(stage.resolve()).toBe(0);
    expect(stage.effects()).toBe(0);
    const effect = fixture();
    effect.failEffect();
    expect(effect.resolve()).toBe(0);
    expect(effect.effects()).toBe(1);
});

test("conditional load preserves Float return values including negative and nonfinite modifiers", () => {
    for (const value of [0, -0, -100, 0.1, 16777217, NaN, Infinity, -Infinity])
    {
        const f = fixture();
        f.setValue(value);
        expect(f.resolve()).toBe(Math.fround(value));
        expect(f.reads()).toBe(1);
        expect(f.effects()).toBe(1);
    }
});
