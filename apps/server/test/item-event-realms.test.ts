import { expect, test } from "bun:test";
import {
    switchRealmEnabled,
    eventRealmEnabled,
    worldActivityRealmEnabled,
} from "@opencok/rules/availability";
import vectors from "./fixtures/item-event-realm-vectors.json";

const families = [switchRealmEnabled, eventRealmEnabled, worldActivityRealmEnabled];

test("item, event and world-activity selectors match 3690 independent Java 8 queries", () => {
    expect(vectors).toHaveLength(1230);
    for (
        const [selector, realm, ...outcomes] of vectors as [
            string,
            number,
            boolean | "error",
            boolean | "error",
            boolean | "error",
        ][]
    )
    {
        for (const [index, select] of families.entries())
        {
            const expected = outcomes[index]!;
            if (expected === "error")
            {
                expect(() => select(selector, realm)).toThrow();
            }
            else
            {
                expect(select(selector, realm), JSON.stringify([index, selector, realm])).toBe(
                    expected,
                );
            }
        }
    }
});

test("realm selector families preserve different zero, negative, repeated-hyphen and eager-bound behavior", () => {
    expect(switchRealmEnabled("0", 0)).toBe(false);
    expect(eventRealmEnabled("0", 0)).toBe(true);
    expect(worldActivityRealmEnabled("0", 0)).toBe(false);
    for (const select of families)
    {
        expect(select("+0", 0)).toBe(true);
        expect(select("00", 0)).toBe(true);
        expect(select("0;2", 0)).toBe(true);
        expect(select("2;bad", 2)).toBe(true);
    }
    expect(switchRealmEnabled("-2", -2)).toBe(true);
    expect(eventRealmEnabled("-2", -2)).toBe(true);
    expect(worldActivityRealmEnabled("-2", 2)).toBe(true);
    expect(() => switchRealmEnabled("--١--٢--", 2)).toThrow();
    expect(eventRealmEnabled("--١--٢--", 2)).toBe(true);
    expect(worldActivityRealmEnabled("--١--٢--", 2)).toBe(true);
    expect(switchRealmEnabled("3-2147483648", 2)).toBe(false);
    expect(eventRealmEnabled("3-2147483648", 2)).toBe(false);
    expect(() => worldActivityRealmEnabled("3-2147483648", 2)).toThrow();
    expect(() => eventRealmEnabled("2-bad-third", 2)).toThrow();
    expect(worldActivityRealmEnabled("2-bad-third", 2)).toBe(true);
    expect(() => worldActivityRealmEnabled("close", 2)).toThrow();
});

test("all realm selector families reject unavailable or oversized inputs and non-Int realm identities", () => {
    for (const select of families)
    {
        for (const selector of [undefined, "2".repeat(65536), Array(4097).fill("1").join(";")])
        {
            expect(() => select(selector, 2)).toThrow();
        }
        for (const realm of [NaN, Infinity, 1.5, 2147483648, -2147483649])
        {
            expect(() => select("all", realm)).toThrow();
        }
        expect(select(";".repeat(65535), 2)).toBe(false);
        expect(select(Array(4096).fill("1").join(";"), 2)).toBe(false);
    }
});
