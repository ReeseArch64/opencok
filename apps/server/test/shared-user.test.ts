import { expect, test } from "bun:test";
import { sharedUserInfo } from "@opencok/mappings/shared-user";
import { decodeLegacyJsonObject } from "@opencok/messages/legacy-json";
import { sfs } from "@opencok/messages/sfs";
import { publishSharedUser, loadSharedUser, sharedUserScript } from "@opencok/storage/shared-user";
import { Cache } from "@opencok/storage/session";

const now = 1792756800123;
const rules = {
    power: {
        vip: new Map([
            ["1", { id: "401", point: "0" }],
            ["2", { id: "406", point: "7" }],
        ]),
    },
};
const row = {
    uid: "1001",
    name: "玩家 + & Ç",
    pic: "g044",
    picVer: 2000003,
    picfraId: 4,
    power: 9007199254740993n,
    abbr: "ALL",
    lang: "pt",
    mainBuildingLevel: 16,
    allianceId: "A",
    gmFlag: 1,
    crossFightSrcServerId: -1,
    vipScore: 7,
    vipEndTime: BigInt(now + 10000),
    svipLevel: 3,
    offLineTime: 1n,
    rank: 5,
    gold: 999n,
};

test("shared-user serialization preserves the complete public snapshot and exact unquoted Longs", () => {
    const update = sharedUserInfo(row, rules, 1, 9007199254740993n, now);
    expect(update).toMatchObject({
        owner: "1001",
        kingdomId: 1,
        version: 9007199254740993n,
        updatedAt: "1792756800",
    });
    expect(Object.keys(JSON.parse(update.body))).toEqual([
        "uid",
        "name",
        "pic",
        "picVer",
        "picfraId",
        "power",
        "abbr",
        "lang",
        "mainBuildingLevel",
        "allianceId",
        "gmFlag",
        "crossFightSrcServerId",
        "vipLevel",
        "svipLevel",
        "vipEndTime",
        "offLineTime",
        "rank",
    ]);
    expect(update.body).toContain("\"power\":9007199254740993");
    expect(decodeLegacyJsonObject(update.body)).toMatchObject({
        uid: sfs.string("1001"),
        name: sfs.string(row.name),
        power: sfs.long(9007199254740993n),
        vipLevel: sfs.int(7),
        rank: sfs.int(5),
    });
    for (const key of ["gold", "vipScore", "serverId", "level"])
    {
        expect(Object.hasOwn(JSON.parse(update.body), key)).toBe(false);
    }
});

test("sparse profiles retain source omission/default rules and only reach active VIP catalogs", () => {
    const update = sharedUserInfo(
        {
            uid: "1",
            name: "Sparse",
            power: -1n,
            allianceId: "",
            rank: 9,
            offLineTime: 0n,
            vipEndTime: 0n,
        },
        { power: {} },
        2,
        1n,
        now,
    );
    const data = JSON.parse(update.body);
    expect(data).toEqual({
        uid: "1",
        name: "Sparse",
        picVer: 0,
        picfraId: 0,
        abbr: "",
        allianceId: "",
        gmFlag: 0,
        crossFightSrcServerId: -1,
        vipLevel: 0,
        svipLevel: 0,
        rank: 0,
    });
    expect(() => sharedUserInfo({ ...row, name: "" }, rules, 1, 1n, now)).toThrow();
    expect(() => sharedUserInfo(row, { power: {} }, 1, 1n, now)).toThrow();
    expect(() => sharedUserInfo({ ...row, power: 9223372036854775808n }, rules, 1, 1n, now))
        .toThrow();
});

test("shared-user cache commands select the legacy layout, marker keys and exact publication fence", async () => {
    const calls: unknown[][] = [],
        update = sharedUserInfo(row, rules, 1, 9007199254740993n, now);
    const command = async (...args: string[]) => {
        calls.push(args);
        return 1;
    };
    await publishSharedUser(command, update);
    expect(calls[0]).toEqual([
        "EVAL",
        sharedUserScript,
        "4",
        "cross_user_info_global",
        "opencok:shared-user:publication-version",
        "USER_LAST_UPDATE_TIME_1001",
        "opencok:kingdom:1:player-update:1001",
        "1001",
        "9007199254740993",
        "1792756800",
        update.body,
        "hash",
    ]);
    await publishSharedUser(command, update, "keys");
    expect(calls[1]![3]).toBe("USER_INFO_1001");
    expect(calls[1]!.at(-1)).toBe("keys");
    const read = async (...args: string[]) => {
        calls.push(args);
        return update.body;
    };
    expect(await loadSharedUser(read, "1001")).toBe(update.body);
    expect(calls.at(-1)).toEqual(["HGET", "cross_user_info_global", "1001"]);
    expect(await loadSharedUser(read, "1001", "keys")).toBe(update.body);
    expect(calls.at(-1)).toEqual(["GET", "USER_INFO_1001"]);
});

test("invalid cache publications fail before I/O and stale or uncertain Redis results never acknowledge", async () => {
    const update = sharedUserInfo(row, rules, 1, 1n, now);
    let calls = 0;
    for (
        const value of [
            { ...update, owner: "" },
            { ...update, owner: "a\0b" },
            { ...update, version: 0n },
            { ...update, version: 9223372036854775808n },
            { ...update, updatedAt: "01" },
            { ...update, kingdomId: 0 },
            { ...update, body: "x".repeat(65536) },
        ]
    )
    {
        await expect(
            publishSharedUser(async () => {
                calls++;
                return 1;
            }, value),
        ).rejects.toThrow();
    }
    expect(calls).toBe(0);
    for (const result of [2, -1, null, "1", true])
    {
        await expect(publishSharedUser(async () => result, update)).rejects.toThrow();
    }
    await publishSharedUser(async () => 0, update);
    await expect(
        new Cache({ redisUrl: "unused", timeoutMs: 100, kingdomId: 2 }).publishSharedUserInfo(
            update,
        ),
    ).rejects.toThrow();
    expect(await loadSharedUser(async () => null, "1001")).toBeNull();
    await expect(loadSharedUser(async () => [], "1001")).rejects.toThrow();
});
