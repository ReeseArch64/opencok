import { expect, test } from "bun:test";
import { decodeStoredJson } from "@opencok/messages/stored-json";
import { encode, sfs } from "@opencok/messages/sfs";
import { titleContractExpiries, powerContext } from "@opencok/services/power";
import { Rules } from "@opencok/rules/game";
import { powerFeatureContext } from "@opencok/rules/power-context";
import type { RuleContext } from "@opencok/rules/availability";
import type { Row } from "@opencok/contracts/rows";

const now = Date.UTC(2026, 9, 23, 12);
const context: RuleContext = { now, kingdomId: 2, version: "12.06.0" };
function rules()
{
    const catalog = new Rules(new Map(), new Map(), new Map());
    for (const id of ["dragon_new", "dragon_levelup", "dragon_science"])
    {
        catalog.features.set(id, { id, version: "99.0.0", online: "2", test: "9" });
    }
    return catalog;
}

test("stored JSON decodes UTF-8 with exact integer tokens instead of rounded Numbers", () => {
    const value = decodeStoredJson(
        Buffer.from(
            "{\"small\":1,\"large\":9007199254740993,\"min\":-9223372036854775808,\"nested\":[1.25,true,null,\"城\"],\"quoted\":\"9007199254740993\"}",
        ),
    );
    expect(value).toEqual({
        small: 1n,
        large: 9007199254740993n,
        min: -9223372036854775808n,
        nested: [1.25, true, null, "城"],
        quoted: "9007199254740993",
    });
    expect(decodeStoredJson(Buffer.from(" \t{\"id\":2}\n\0\0"))).toEqual({ id: 2n });
    expect(decodeStoredJson(Buffer.from("{\"id\":1,\"id\":9007199254740993}"))).toEqual({
        id: 9007199254740993n,
    });
});

test("stored JSON rejects malformed, oversized and binary SFS input with sanitized errors", () => {
    for (
        const bytes of [
            Buffer.from([0xff]),
            Buffer.from("{\"id\":"),
            Buffer.alloc(65536, 32),
            Buffer.from("{\"value\":1e999}"),
            encode({ id: sfs.long(123) }),
            Buffer.from("\"synthetic-private-value"),
        ]
    )
    {
        try
        {
            decodeStoredJson(bytes);
            throw new Error("Expected stored data rejection");
        }
        catch (error)
        {
            expect((error as Error).message).toBe("Invalid or unsupported SFS packet");
        }
    }
});

test("title contract JSON retains signed deadlines, absent defaults and duplicate-key replacement", () => {
    const missing: (Row | undefined)[] = [
        undefined,
        {},
        { contract_unlock_title: null },
        { contract_unlock_title: Buffer.alloc(0) },
    ];
    for (const knight of missing)
    {
        expect(titleContractExpiries(knight)).toEqual(new Map());
    }
    const bytes = Buffer.from(
        "{\"8001\":9007199254740993,\"8002\":-9223372036854775808,\"8003\":9223372036854775807}",
    );
    const before = Buffer.from(bytes);
    expect(titleContractExpiries({ contract_unlock_title: bytes })).toEqual(
        new Map([
            ["8001", 9007199254740993n],
            ["8002", -9223372036854775808n],
            ["8003", 9223372036854775807n],
        ]),
    );
    expect(bytes).toEqual(before);
});

test("title contracts reject invalid shapes and types instead of silently expiring titles", () => {
    for (
        const json of [
            "null",
            "[]",
            "123",
            "{\"id\":123}",
            "{\"-1\":123}",
            "{\"2147483648\":123}",
            "{\"8001\":\"123\"}",
            "{\"8001\":1.25}",
            "{\"8001\":1e3}",
            "{\"8001\":null}",
            "{\"8001\":9223372036854775808}",
            "{\"8001\":-9223372036854775809}",
            "{\"__proto__\":123}",
        ]
    )
    {
        expect(() => titleContractExpiries({ contract_unlock_title: Buffer.from(json) })).toThrow(
            "102192",
        );
    }
    expect(() => titleContractExpiries({ contract_unlock_title: "{}" })).toThrow("102192");
});

test("server dragon gates require the base feature and do not compare client versions", () => {
    const catalog = rules();
    expect(powerFeatureContext(catalog, context)).toEqual({
        dragonLevelUp: true,
        dragonScience: true,
    });
    catalog.features.delete("dragon_levelup");
    expect(powerFeatureContext(catalog, context)).toEqual({
        dragonLevelUp: false,
        dragonScience: true,
    });
    catalog.features.delete("dragon_new");
    expect(powerFeatureContext(catalog, context)).toEqual({
        dragonLevelUp: false,
        dragonScience: false,
    });
});

test("server dragon gates honor realm selectors, time boundaries, test realms and required metadata", () => {
    const catalog = rules();
    const feature = catalog.features.get("dragon_new")!;
    feature.start = "2026-10-23-12-00";
    feature.end = "2026-10-23-12-01";
    expect(powerFeatureContext(catalog, { ...context, now: now - 1 }).dragonLevelUp).toBe(false);
    expect(powerFeatureContext(catalog, context).dragonLevelUp).toBe(true);
    expect(powerFeatureContext(catalog, { ...context, now: now + 60000 }).dragonLevelUp).toBe(true);
    expect(powerFeatureContext(catalog, { ...context, now: now + 60001 }).dragonLevelUp).toBe(
        false,
    );
    expect(
        powerFeatureContext(catalog, { ...context, kingdomId: 9, testServer: true }).dragonLevelUp,
    ).toBe(true);
    expect(powerFeatureContext(catalog, { ...context, kingdomId: 9 }).dragonLevelUp).toBe(false);
    feature.version = " ";
    expect(powerFeatureContext(catalog, context).dragonLevelUp).toBe(false);
    feature.version = "99.0.0";
    feature.end = "2026-02-30-12-00";
    expect(powerFeatureContext(catalog, context).dragonLevelUp).toBe(false);
});

test("power context combines persisted title contracts and server gates without inventing an effect", () => {
    const catalog = rules();
    const knight = { contract_unlock_title: Buffer.from("{\"8001\":9007199254740993}") };
    const result = powerContext(catalog, knight, context);
    expect(result).toEqual({
        now,
        dragonLevelUp: true,
        dragonScience: true,
        contractTitleExpiries: new Map([["8001", 9007199254740993n]]),
        dragonAttackPercent: undefined,
    });
    expect(powerContext(catalog, knight, context, 12.5).dragonAttackPercent).toBe(12.5);
});
