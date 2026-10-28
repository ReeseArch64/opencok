import { expect, test } from "bun:test";
import { drizzle, type NodePgClient } from "drizzle-orm/node-postgres";
import { readCelebrityDescription } from "@opencok/repositories/celebrity";
import { GameService as Game } from "@opencok/services/game";
import { Rules } from "@opencok/rules/game";
import type { GameStore } from "@opencok/contracts/game";
import type { Row } from "@opencok/contracts/rows";
import { decode, encode, sfs, Type, type Fields } from "@opencok/messages/sfs";

function fixture()
{
    let owner: Row | undefined = { uid: "owner", serverId: 1, banFlag: 0, banTime: 0n };
    const queries: { realm: number; text: string; params: unknown[]; }[] = [];
    const profiles = new Map<number, { uid: string; flag: number | null; }[]>([
        [1, [{ uid: "target", flag: 11 }]],
        [2, [{ uid: "target", flag: 11 }]],
    ]);
    const descriptions = new Map<number, { uid: string; description: unknown; }[]>([
        [1, [{ uid: "target", description: Buffer.from("local") }]],
        [2, [{ uid: "target", description: Buffer.from("remote") }]],
    ]);
    let failure = "";
    const kingdoms = new Map(
        [1, 2].map((realm) => [
            realm,
            {
                db: drizzle({
                    async query(query: { text: string; }, params: unknown[])
                    {
                        queries.push({ realm, text: query.text, params });
                        const pattern = new RegExp(params[0] as string, "u");
                        if (query.text.includes("\"userprofile\""))
                        {
                            if (failure === "profile")
                            {
                                throw new Error("Synthetic profile query failure");
                            }
                            expect(query.text).toBe(
                                "select \"uid\", \"gmFlag\" from \"opencok_kingdom\".\"userprofile\" where \"opencok_kingdom\".\"userprofile\".\"uid\" collate \"C\" ~ $1",
                            );
                            return {
                                rows: profiles
                                    .get(realm)!
                                    .filter((row) => pattern.test(row.uid))
                                    .map((row) => [row.uid, row.flag]),
                            };
                        }
                        if (failure === "description")
                        {
                            throw new Error("Synthetic description query failure");
                        }
                        expect(query.text).toBe(
                            "select \"uid\", \"description\" from \"opencok_kingdom\".\"celebrity\" where \"opencok_kingdom\".\"celebrity\".\"uid\" collate \"C\" ~ $1",
                        );
                        return {
                            rows: descriptions
                                .get(realm)!
                                .filter((row) => pattern.test(row.uid))
                                .map((row) => [row.uid, row.description]),
                        };
                    },
                } as unknown as NodePgClient),
            },
        ]),
    );
    const databases = {
        kingdoms,
        getKingdom(realm: number)
        {
            return kingdoms.get(realm)!;
        },
    } as unknown as Parameters<typeof readCelebrityDescription>[0];
    const store = {
        async getProfileById(uid: string)
        {
            expect(uid).toBe("owner");
            return owner;
        },
        celebrityDescription(uid: string, realm: number)
        {
            return readCelebrityDescription(databases, uid, realm);
        },
    };
    const game = new Game(
        store as unknown as GameStore,
        new Rules(new Map(), new Map(), new Map()),
        { kingdomId: 1 },
        () => 1000,
    );
    return {
        queries,
        profiles,
        descriptions,
        store,
        run: (params: Fields) => game.execute("owner", "celebrity.desc.get", params),
        read: (uid: string, realm: number) => readCelebrityDescription(databases, uid, realm),
        owner: (value: Row | undefined) => {
            owner = value;
        },
        fail: (value: string) => {
            failure = value;
        },
    };
}

test("celebrity descriptions route to the requested configured realm with typed correlation and no pushes", async () => {
    for (const realm of [1, 2])
    {
        const instance = fixture();
        const params = {
            uid: sfs.string("target"),
            serverId: sfs.int(realm),
            _cok_: sfs.string("request"),
            cmdBaseTime: sfs.long(7),
        };
        const result = await instance.run(decode(encode(params)));
        expect(decode(encode(result.body))).toEqual({
            description: sfs.string(realm === 1 ? "local" : "remote"),
            _cok_: params._cok_,
            cmdBaseTime: params.cmdBaseTime,
        });
        expect(result.pushes).toEqual([]);
        expect(instance.queries.map((query) => query.realm)).toEqual([realm, realm]);
    }
});

test("blank target UIDs return empty before decoding serverId or requiring a description provider", async () => {
    for (const uid of ["", " \t\r\n", "\u2000", "\u3000", "\u001c"])
    {
        const instance = fixture();
        Object.defineProperty(instance.store, "celebrityDescription", { value: undefined });
        expect(
            (await instance.run({ uid: sfs.string(uid), serverId: sfs.string("invalid") })).body,
        ).toEqual({
            description: sfs.string(""),
        });
        expect(instance.queries).toEqual([]);
    }
});

test("celebrity reads require an authenticated local unbanned caller before parameters or target reads", async () => {
    for (
        const owner of [
            undefined,
            { uid: "wrong", serverId: 1 },
            { uid: "owner", serverId: 2 },
            { uid: "owner", serverId: 1, banFlag: 1 },
            { uid: "owner", serverId: 1, banTime: 1001n },
        ] as (Row | undefined)[]
    )
    {
        const instance = fixture();
        instance.owner(owner);
        await expect(instance.run({})).rejects.toMatchObject({
            code: owner ? "E000000" : "E100169",
        });
        expect(instance.queries).toEqual([]);
    }
});

test("nonblank requests preserve String and signed Int parameter types without coercion", async () => {
    for (
        const params of [
            {},
            { uid: sfs.int(1) },
            { uid: sfs.string("target") },
            { uid: sfs.string("target"), serverId: sfs.string("1") },
            { uid: sfs.string("target"), serverId: sfs.long(1) },
            { uid: sfs.string("target"), serverId: { type: Type.Int, value: 2147483648 } },
            { uid: sfs.string("target"), serverId: { type: Type.Int, value: 1.5 } },
        ] as Fields[]
    )
    {
        const instance = fixture();
        await expect(instance.run(params)).rejects.toThrow();
        expect(instance.queries).toEqual([]);
    }
});

test("unconfigured realms missing profiles and non-celebrities return empty without reading descriptions", async () => {
    for (const serverId of [-2147483648, -1, 0, 3, 2147483647])
    {
        const instance = fixture();
        expect(
            (await instance.run({ uid: sfs.string("target"), serverId: sfs.int(serverId) })).body,
        ).toEqual({
            description: sfs.string(""),
        });
        expect(instance.queries).toEqual([]);
    }
    for (const flag of [null, -1, 0, 1, 10, 12])
    {
        const instance = fixture();
        instance.profiles.set(1, [{ uid: "target", flag }]);
        expect(await instance.read("target", 1)).toBeNull();
        expect(instance.queries).toHaveLength(1);
    }
    const absent = fixture();
    absent.profiles.set(1, []);
    expect(await absent.read("target", 1)).toBeNull();
    expect(absent.queries).toHaveLength(1);
});

test("description decoding uses strict UTF-8 Java trim and Java blank semantics without dropping BOM", async () => {
    for (
        const [bytes, expected] of [
            [null, ""],
            [Buffer.alloc(0), ""],
            [Buffer.from(" \t\0synthetic\n\0 "), "synthetic"],
            [Buffer.from("\u2000\u3000"), ""],
            [Buffer.from("\u2000text\u3000"), "\u2000text\u3000"],
            [Buffer.from("\ufefftext"), "\ufefftext"],
            [Buffer.from("\u00a0"), "\u00a0"],
            [Buffer.from("中文 😀"), "中文 😀"],
            [Buffer.from([0x61, 0xc0, 0xaf, 0x62]), ""],
            [Buffer.from([0xed, 0xa0, 0x80]), ""],
            [Buffer.from([0xf0, 0x9f, 0x98]), ""],
            [Buffer.from([0xff]), ""],
        ] as const
    )
    {
        const instance = fixture();
        instance.descriptions.set(1, [{ uid: "target", description: bytes }]);
        expect((await instance.run({ uid: sfs.string("target"), serverId: sfs.int(1) })).body)
            .toEqual({
                description: sfs.string(expected),
            });
    }
});

test("description reads preserve legacy UID equality and reject regex false positives and ambiguous aliases", async () => {
    const instance = fixture();
    instance.profiles.set(1, [
        { uid: "SÉLF", flag: 11 },
        { uid: "fles", flag: 11 },
    ]);
    instance.descriptions.set(1, [
        { uid: "self ", description: Buffer.from("chosen") },
        { uid: "fles", description: Buffer.from("other") },
    ]);
    expect(await instance.read("self", 1)).toEqual(Buffer.from("chosen"));
    instance.profiles.get(1)!.push({ uid: "SELF", flag: 11 });
    await expect(instance.read("self", 1)).rejects.toThrow("celebrity description");
    instance.profiles.get(1)!.pop();
    instance.descriptions.get(1)!.push({ uid: "self", description: Buffer.from("ambiguous") });
    await expect(instance.read("self", 1)).rejects.toThrow("celebrity description");
});

test("missing description rows are empty while reached SQL and malformed blob failures reject", async () => {
    const missing = fixture();
    missing.descriptions.set(1, []);
    expect(await missing.read("target", 1)).toBeNull();
    for (const failure of ["profile", "description"])
    {
        const instance = fixture();
        instance.fail(failure);
        await expect(instance.run({ uid: sfs.string("target"), serverId: sfs.int(1) })).rejects
            .toThrow(
                "celebrity description",
            );
    }
    for (const description of [1, Buffer.alloc(65536)])
    {
        const instance = fixture();
        instance.descriptions.set(1, [{ uid: "target", description }]);
        await expect(instance.read("target", 1)).rejects.toThrow("celebrity description");
    }
});
