import { expect, test } from "bun:test";
import {
    legacyPlayerVersionAtLeast,
    ruleAvailable,
    versionAtLeast,
} from "@opencok/rules/availability";
import { accountVerificationEnabled, featureAnnouncementEnabled } from "@opencok/rules/features";
import { Rules } from "@opencok/rules/game";
import vectors from "./fixtures/feature-version-vectors.json";

const context = { kingdomId: 2, version: "12.6.0", now: 1000 };

test("feature versions match 2560 independent Java 8 comparison and blank-policy outcomes", () => {
    expect(vectors).toHaveLength(1280);
    for (
        const [actual, required, direct, player] of vectors as [
            string,
            string,
            boolean | "error",
            boolean | "error",
        ][]
    )
    {
        for (
            const [query, expected] of [
                [versionAtLeast, direct],
                [legacyPlayerVersionAtLeast, player],
            ] as const
        )
        {
            if (expected === "error")
            {
                expect(() => query(actual, required)).toThrow();
            }
            else
            {
                expect(query(actual, required), JSON.stringify([actual, required])).toBe(expected);
            }
        }
    }
});

test("version parsing consumes every nonempty component before short-circuit comparison", () => {
    expect(versionAtLeast("13", "12")).toBe(true);
    expect(versionAtLeast("11", "12")).toBe(false);
    expect(versionAtLeast("12.7", "12.6")).toBe(true);
    expect(versionAtLeast("12.5", "12.6")).toBe(false);
    expect(versionAtLeast(".１２..+6.-0.", "12.6.0.99")).toBe(true);
    for (
        const pair of [
            ["13.bad", "12"],
            ["13", "12.bad"],
            ["12.6.0.bad", "12.6.0"],
            ["12.6.0", "12.6.0.bad"],
            ["13", "13"],
            ["12.6", "12.6"],
        ] as const
    )
    {
        expect(() => versionAtLeast(pair[0], pair[1])).toThrow();
    }
});

test("bounded versions retain leading zeroes and skip empty segments without allowing oversized inputs", () => {
    expect(versionAtLeast("0".repeat(65530) + "1.0.0", "1.0.0")).toBe(true);
    expect(versionAtLeast(Array(4096).fill("1").join("."), "1.1.1")).toBe(true);
    expect(versionAtLeast(".".repeat(65530) + "1.0.0", "1.0.0")).toBe(true);
    for (const version of ["0".repeat(65531) + "1.0.0", Array(4097).fill("1").join(".")])
    {
        expect(() => versionAtLeast(version, "1.0.0")).toThrow();
        expect(() => versionAtLeast("1.0.0", version)).toThrow();
    }
});

test("function-on gates bypass comparison only for Java-blank players after required metadata checks", () => {
    const rule = { version: "not-numeric", online: "2", test: "3" };
    for (const version of ["", " ", "\t\n", "\u001c", "\u2000", "\u3000"])
    {
        expect(ruleAvailable(rule, { ...context, version })).toBe(true);
        expect(ruleAvailable(rule, { ...context, version, testServer: true })).toBe(false);
        expect(ruleAvailable({ ...rule, version: "\u2000" }, { ...context, version })).toBe(false);
        expect(() => ruleAvailable({ ...rule, online: "bad" }, { ...context, version })).toThrow();
    }
    for (const version of ["\u00a0", "\ufeff", "13.bad"])
    {
        expect(() => ruleAvailable(rule, { ...context, version })).toThrow();
    }
    expect(ruleAvailable({ ...rule, online: "\u2000" }, context)).toBe(false);
    expect(ruleAvailable({ ...rule, version: "13", online: "bad" }, context)).toBe(false);
    expect(legacyPlayerVersionAtLeast("bad", undefined)).toBe(false);
});

test("account switches compare empty players while announcements preserve version metadata without comparison", () => {
    const rules = new Rules(new Map(), new Map(), new Map());
    const rule = { id: "function_on7", k5: "12.6.0", k6: "2" };
    rules.items.set(rule.id, rule);
    for (const version of ["13", ".12..6.0.1", "１２.６.０"])
    {
        expect(accountVerificationEnabled(rules, { ...context, version })).toBe(true);
    }
    for (const version of ["", "\u2000", "12.6", "13.bad"])
    {
        expect(() => accountVerificationEnabled(rules, { ...context, version })).toThrow();
    }
    rule.k6 = "bad";
    expect(accountVerificationEnabled(rules, { ...context, version: "11" })).toBe(false);
    rule.k5 = "\u2000";
    expect(accountVerificationEnabled(rules, { ...context, version: "bad" })).toBe(false);
    const feature = { id: "synthetic", version: "not-numeric", online: "2" };
    expect(
        featureAnnouncementEnabled(feature, rules, { ...context, uid: "owner", platform: "test" }),
    ).toBe(true);
});
