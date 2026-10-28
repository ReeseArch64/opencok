import { expect, test } from "bun:test";
import type { GameServices, GameStore, PlayerSummary } from "@opencok/contracts/game";
import type { Row } from "@opencok/contracts/rows";
import { createRealmGameService } from "../src/composition/game";
import type { GameService as Game } from "@opencok/services/game";
import { playerSummary } from "@opencok/mappings/players";
import { decode, encode, fields, sfs, type Fields, type Value } from "@opencok/messages/sfs";
import { Rules } from "@opencok/rules/game";

const now = 1792756800123;
const unused = async (): Promise<never> => {
    throw new Error("Unexpected dependency call");
};
function summary(data: Row = {}, kingdomId = 1, remote = false): PlayerSummary
{
    return { data: { uid: "1001", name: "Synthetic", country: "BR", ...data }, kingdomId, remote };
}
function game(
    summaries: PlayerSummary[] = [],
    services: GameServices = {},
    profile: Row | undefined = { uid: "observer" },
)
{
    const calls: { uids: string[]; allServers: boolean; }[] = [];
    const db: GameStore = {
        getProfileById: async (uid) => {
            expect(uid).toBe("observer");
            return profile;
        },
        mailGroups: unused,
        mailBatch: unused,
        mailCategory: unused,
        mailContents: unused,
        mailConversationSave: unused,
        mailDelete: unused,
        mailRead: unused,
        mailSave: unused,
        mailStatus: unused,
        allianceRanking: unused,
        playerRanking: unused,
        getPlayerSummariesByIds: async (uids, allServers) => {
            calls.push({ uids, allServers });
            return summaries;
        },
        getAccountsByPlayerId: unused,
        getPowerByPlayerId: unused,
        getCityByPlayerId: unused,
        getWorldByPointIds: unused,
    };
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
    );
    return {
        calls,
        controller: createRealmGameService(db, rules, { kingdomId: 1 }, () => now, services),
    };
}
async function query(controller: Game, params: Fields = {})
{
    const result = await controller.execute(
        "observer",
        "get.user.info.multi",
        decode(encode(params)),
    );
    expect(result.pushes).toEqual([]);
    const body = decode(encode(result.body));
    return { body, players: (body.uids!.value as Value[]).map(fields) };
}

test("batch profiles preserve public wire types and omit all private fields", () => {
    const data: Row = {
        uid: "1001",
        name: "Synthetic",
        allianceId: "alliance-a",
        abbr: "AAA",
        rank: 4,
        officer: 7,
        pic: "icon",
        picVer: 8,
        picfraId: 9,
        gmFlag: 2,
        crossFightSrcServerId: -1,
        vipLevel: -1,
        vipEndTime: 1792756800999n,
        sLevel: 3,
        stateId: 500103,
        endTime: 9007199254740993n,
        country: "BR",
        showBanner: 1n,
        registrationCountry: "US",
        gold: 999n,
        deviceId: "synthetic-private-device",
        passmd5: "synthetic-private-value",
        emailAccount: "private.invalid",
    };
    const wire = decode(encode(playerSummary(summary(data), "1234567890")));
    expect(wire).toEqual({
        uid: sfs.string("1001"),
        name: sfs.string("Synthetic"),
        allianceId: sfs.string("alliance-a"),
        abbr: sfs.string("AAA"),
        rank: sfs.int(4),
        officer: sfs.string("7"),
        pic: sfs.string("icon"),
        picVer: sfs.int(8),
        picfraId: sfs.int(9),
        gmFlag: sfs.int(2),
        crossFightSrcServerId: sfs.int(-1),
        vipLevel: sfs.int(-1),
        vipEndTime: sfs.int(1792756800),
        sLevel: sfs.int(3),
        svipLevel: sfs.int(3),
        stateId: sfs.int(500103),
        endTime: sfs.long(9007199254740993n),
        flagCountry: sfs.string("br"),
        showBanner: sfs.int(1),
        lastUpdateTime: sfs.string("1234567890"),
        serverId: sfs.int(1),
    });
    expect(data.country).toBe("BR");
    expect(data.vipEndTime).toBe(1792756800999n);
});

test("public defaults, remote fields and banner restrictions follow the persisted summary", () => {
    const local = playerSummary(summary({ showBanner: null, country: "001", vipLevel: -1 }), "0");
    expect(local.flagCountry).toEqual(sfs.string(""));
    expect(local).not.toHaveProperty("showBanner");
    expect(local.vipLevel).toEqual(sfs.int(-1));
    expect(local.vipEndTime).toEqual(sfs.int(0));
    expect(local.endTime).toEqual(sfs.long(0));
    for (const remote of [false, true])
    {
        const out = playerSummary(
            summary(
                { officer: 6, showBanner: 1n, registrationCountry: "TW", vipLevel: -1 },
                2,
                remote,
            ),
            "0",
        );
        expect(out.showBanner).toEqual(sfs.int(0));
        expect(out.officer).toEqual(sfs.string(remote ? "" : "6"));
        expect(out.vipLevel).toEqual(sfs.int(remote ? 0 : -1));
    }
    expect(() => playerSummary(summary({ showBanner: 2147483648n }), "0")).toThrow("102192");
    const after2038 = playerSummary(summary({ vipEndTime: 2147483648000n }), "0");
    expect(after2038.vipEndTime).toEqual(sfs.int(-2147483648));
});

test("missing, empty, blank and oversized batches return an empty array without repository calls", async () => {
    const { controller, calls } = game();
    const requests: Fields[] = [
        {},
        { uids: sfs.null() },
        { uids: sfs.array() },
        { uids: sfs.array([sfs.string(""), sfs.string(" \t ")]) },
        { uids: sfs.array(Array.from({ length: 51 }, (_, i) => sfs.string(String(i)))) },
    ];
    for (const params of requests)
    {
        expect((await query(controller, params)).players).toEqual([]);
    }
    expect(calls).toEqual([]);
});

test("batch parsing rejects malformed SFS types and IDs before querying persistence", async () => {
    const { controller, calls } = game();
    for (
        const uids of [
            sfs.string("1001"),
            sfs.array([sfs.int(1001)]),
            sfs.array([sfs.null()]),
            sfs.array([sfs.string("a".repeat(256))]),
        ]
    )
    {
        await expect(query(controller, { uids })).rejects.toThrow("E000000");
    }
    expect(calls).toEqual([]);
});

test("a 50-ID batch retains duplicates and allservers is activated by key presence", async () => {
    const { controller, calls } = game();
    const ids = Array.from({ length: 50 }, (_, index) => String(index % 5));
    await query(controller, {
        uids: sfs.array([sfs.string(" "), ...ids.map(sfs.string)]),
        allservers: sfs.bool(false),
    });
    expect(calls).toEqual([{ uids: ids, allServers: true }]);
});

test("guide identity is appended once with its distinct legacy field types and correlation", async () => {
    const { controller, calls } = game([summary()]);
    const { body, players } = await query(controller, {
        uids: sfs.array(["3000002", "1001", "3000002"].map(sfs.string)),
        _cok_: sfs.string("correlation"),
        cmdBaseTime: sfs.long(9007199254740993n),
    });
    expect(calls).toEqual([{ uids: ["1001"], allServers: false }]);
    expect(players.map((player) => player.uid?.value)).toEqual(["1001", "3000002"]);
    expect(players[1]).toEqual({
        serverId: sfs.int(0),
        sLevel: sfs.int(0),
        vipEndTime: sfs.long(0),
        uid: sfs.string("3000002"),
        gmFlag: sfs.int(1),
        pic: sfs.string("guide_player_icon"),
        allianceId: sfs.string(""),
        vipLevel: sfs.int(0),
        rank: sfs.int(0),
        crossFightSrcServerId: sfs.int(-1),
        picVer: sfs.int(0),
        lastUpdateTime: sfs.int(1474375485),
        svipLevel: sfs.int(10),
        name: sfs.string("Agatha"),
        abbr: sfs.string(""),
        style: sfs.string(""),
    });
    expect(body._cok_).toEqual(sfs.string("correlation"));
    expect(body.cmdBaseTime).toEqual(sfs.long(9007199254740993n));
});

test("update markers are fetched once per realm with a stable seconds fallback", async () => {
    const seen: { kingdomId: number; uids: string[]; }[] = [];
    const { controller } = game([summary(), summary(), summary({ uid: "2001" }, 2, true)], {
        playerUpdateTimes: async (kingdomId, uids) => {
            seen.push({ kingdomId, uids });
            return kingdomId === 1 ? new Map([["1001", "9007199254740993"]]) : new Map();
        },
    });
    const { players } = await query(controller, {
        uids: sfs.array(["1001", "1001", "2001"].map(sfs.string)),
    });
    expect(seen).toEqual([
        { kingdomId: 1, uids: ["1001"] },
        { kingdomId: 2, uids: ["2001"] },
    ]);
    expect(players.map((row) => row.lastUpdateTime?.value)).toEqual([
        "9007199254740993",
        "9007199254740993",
        "1792756800",
    ]);
});

test("missing or banned observers cannot query summaries and cache failures reject the response", async () => {
    const profiles: Row[] = [{ banFlag: 1 }, { banTime: BigInt(now + 1) }];
    for (const profile of profiles)
    {
        const { controller, calls } = game([], {}, profile);
        await expect(query(controller, { uids: sfs.array([sfs.string("1001")]) })).rejects.toThrow(
            "E000000",
        );
        expect(calls).toEqual([]);
    }
    const missing = game([], {}, undefined);
    missing.controller.db.getProfileById = async () => undefined;
    await expect(query(missing.controller)).rejects.toThrow("E100169");
    const { controller } = game([summary()], {
        playerUpdateTimes: async () => {
            throw new Error("Synthetic failure");
        },
    });
    await expect(query(controller, { uids: sfs.array([sfs.string("1001")]) })).rejects.toThrow(
        "Synthetic failure",
    );
});
