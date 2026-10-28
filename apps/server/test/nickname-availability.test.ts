import { expect, test } from "bun:test";
import { drizzle, type NodePgClient } from "drizzle-orm/node-postgres";
import * as schema from "@opencok/drizzle/schema/global";
import { Database } from "@opencok/repositories/game";
import { nicknameOccupied } from "@opencok/repositories/nickname";
import { mysqlUtf8UnicodeCandidates, mysqlUtf8UnicodeKey } from "@opencok/rules/mysql-unicode";

type Mapping = { uid: string; type: string; value: string | null; active?: number | null; };
type Account = { uid: string; active: number | null; name?: string; server?: string; };

function fixture(mappings: Mapping[] = [], accounts: Account[] = [])
{
    const queries: { text: string; params: unknown[]; }[] = [];
    let failure: { stage: "mapping" | "account"; error: unknown; } | undefined;
    const client = {
        async query(query: { text: string; }, params: unknown[] = [])
        {
            const text = query.text;
            queries.push({ text, params });
            if (text.includes("from \"opencok_global\".\"usermapping\""))
            {
                expect(text).toBe(
                    "select \"gameUid\", \"mappingType\", \"mappingValue\" from \"opencok_global\".\"usermapping\" where (\"opencok_global\".\"usermapping\".\"mappingType\" collate \"C\" ~ $1 and \"opencok_global\".\"usermapping\".\"mappingValue\" collate \"C\" ~ $2)",
                );
                expect(params).toHaveLength(2);
                if (failure?.stage === "mapping")
                {
                    throw failure.error;
                }
                const type = new RegExp(params[0] as string, "u");
                const value = new RegExp(params[1] as string, "u");
                return {
                    rows: mappings
                        .filter((row) =>
                            type.test(row.type) && row.value !== null && value.test(row.value)
                        )
                        .map((row) => [row.uid, row.type, row.value]),
                };
            }
            if (text.includes("from \"opencok_global\".\"account_new\""))
            {
                expect(text).toBe(
                    "select \"gameUid\" from \"opencok_global\".\"account_new\" where (\"opencok_global\".\"account_new\".\"gameUid\" collate \"C\" ~ $1 and \"opencok_global\".\"account_new\".\"active\" <> $2)",
                );
                expect(params).toHaveLength(2);
                expect(params[1]).toBe(-1);
                if (failure?.stage === "account")
                {
                    throw failure.error;
                }
                const uid = new RegExp(params[0] as string, "u");
                return {
                    rows: accounts
                        .filter((row) =>
                            row.active !== null && row.active !== -1 && uid.test(row.uid)
                        )
                        .map((row) => [row.uid]),
                };
            }
            throw new Error("Unexpected nickname SQL");
        },
    };
    const db = drizzle(client as unknown as NodePgClient, { schema });
    const repository = { databases: { global: { db } } } as Database;
    return {
        db,
        queries,
        occupied: (name: string) => Database.prototype.nicknameOccupied.call(repository, name),
        fail: (stage: "mapping" | "account", error: unknown) => {
            failure = { stage, error };
        },
    };
}

test("nickname SQL candidate patterns contain every BMP character that can participate in equivalence", () => {
    const names = [
        "Name",
        "Straße",
        "㍿",
        "\u4db5",
        "\u4db6",
        "\u9fa5",
        "\u9fa6",
        "a.b[0]-^\\$",
        "",
    ];
    const patterns = names.map((name) => new RegExp(mysqlUtf8UnicodeCandidates([name]), "u"));
    const keys = names.map(mysqlUtf8UnicodeKey);
    for (let code = 1; code <= 65535; code++)
    {
        if (code >= 0xd800 && code <= 0xdfff)
        {
            continue;
        }
        const character = String.fromCharCode(code);
        const key = mysqlUtf8UnicodeKey(character);
        for (let index = 0; index < names.length; index++)
        {
            let offset = keys[index]!.indexOf(key);
            while (offset >= 0 && offset % 4 !== 0)
            {
                offset = keys[index]!.indexOf(key, offset + 1);
            }
            if (!key || offset >= 0)
            {
                expect(patterns[index]!.test(character)).toBe(true);
            }
        }
    }
    for (let index = 0; index < names.length; index++)
    {
        expect(patterns[index]!.test(names[index]!)).toBe(true);
    }
    expect(patterns[0]!.test("😀")).toBe(false);
    expect(patterns[0]!.test("\0")).toBe(false);
    expect(patterns[0]!.test("eman")).toBe(true);
    expect(mysqlUtf8UnicodeKey("eman")).not.toBe(mysqlUtf8UnicodeKey("name"));
});

test("global nickname lookup preserves mapping and account comparison without local or realm filtering", async () => {
    const mappings: Mapping[] = [
        { uid: " \tSÉLF\r\n", type: "Náme ", value: "Straße  ", active: -1 },
    ];
    const accounts: Account[] = [{ uid: "self\u00a0", active: 0, name: "Renamed", server: "99" }];
    const before = structuredClone({ mappings, accounts });
    const instance = fixture(mappings, accounts);
    expect(await instance.occupied("STRASSE")).toBe(true);
    expect(instance.queries).toHaveLength(2);
    expect({ mappings, accounts }).toEqual(before);
});

test("global nickname lookup ignores null names wrong types and candidate false positives before account reads", async () => {
    for (
        const row of [
            { uid: "self", type: "name", value: null },
            { uid: "self", type: "eman", value: "alpha" },
            { uid: "self", type: "name", value: "ahpla" },
            { uid: "self", type: "email", value: "alpha" },
        ]
    )
    {
        const instance = fixture([row], [{ uid: "self", active: 0 }]);
        expect(await instance.occupied("alpha")).toBe(false);
        expect(instance.queries).toHaveLength(1);
    }
});

test("global nickname lookup requires an existing non-deleted non-null active account", async () => {
    const mappings = [{ uid: "self", type: "name", value: "alpha" }];
    for (const accounts of [[], [{ uid: "self", active: -1 }], [{ uid: "self", active: null }]])
    {
        const instance = fixture(mappings, accounts);
        expect(await instance.occupied("alpha")).toBe(false);
        expect(instance.queries).toHaveLength(2);
    }
    for (const active of [0, 1, -2, 2147483647])
    {
        expect(await fixture(mappings, [{ uid: "self", active }]).occupied("alpha")).toBe(true);
    }
});

test("global nickname lookup checks all mapped IDs and applies exact comparison after account prefiltering", async () => {
    const mappings = [
        { uid: "first", type: "name", value: "alpha" },
        { uid: "second", type: "name", value: "ALPHA" },
    ];
    expect(
        await fixture(mappings, [
            { uid: "first", active: -1 },
            { uid: "SECOND", active: 1 },
        ]).occupied("alpha"),
    ).toBe(true);
    expect(await fixture(mappings, [{ uid: "dnoces", active: 0 }]).occupied("alpha")).toBe(false);
    expect(
        await fixture(
            [{ uid: "\t\r ", type: "name", value: "alpha" }],
            [{ uid: "", active: 0 }],
        ).occupied("alpha"),
    ).toBe(true);
});

test("nickname availability preserves reached SQL-error empty-result behavior at either query", async () => {
    for (const stage of ["mapping", "account"] as const)
    {
        for (const code of ["42P01", "57014", "08006", "XX000"])
        {
            const instance = fixture([{ uid: "self", type: "name", value: "alpha" }]);
            instance.fail(stage, Object.assign(new Error("Synthetic SQL failure"), { code }));
            expect(await instance.occupied("alpha")).toBe(false);
            expect(instance.queries).toHaveLength(stage === "mapping" ? 1 : 2);
        }
    }
});

test("nickname availability does not turn network malformed-data or programming failures into free names", async () => {
    for (const stage of ["mapping", "account"] as const)
    {
        for (
            const error of [
                new Error("Synthetic failure"),
                Object.assign(new Error("Synthetic transport failure"), { code: "ECONNRESET" }),
                { code: "42p01" },
                { code: 42001 },
            ]
        )
        {
            const instance = fixture([{ uid: "self", type: "name", value: "alpha" }]);
            instance.fail(stage, error);
            await expect(instance.occupied("alpha")).rejects.toThrow("nickname availability");
        }
    }
    const instance = fixture([{ uid: "\ud800", type: "name", value: "alpha" }]);
    await expect(instance.occupied("alpha")).rejects.toThrow("nickname availability");
    expect(instance.queries).toHaveLength(1);
    await expect(nicknameOccupied(instance.db, "😀")).rejects.toThrow("nickname availability");
    expect(instance.queries).toHaveLength(1);
});

test("nickname availability binds generated patterns and confirms literal punctuation without SQL interpolation", async () => {
    const name = "a.' OR 1=1 --";
    const instance = fixture(
        [{ uid: "self'", type: "name", value: name }],
        [{ uid: "SELF'", active: 0 }],
    );
    expect(await instance.occupied(name)).toBe(true);
    expect(
        instance.queries.every((query) =>
            !query.text.includes(name) && !query.text.includes("self'")
        ),
    ).toBe(true);
    expect(
        instance.queries.every((query) =>
            query.params.every((param) => typeof param !== "string" || !param.includes("\0"))
        ),
    ).toBe(true);
});
