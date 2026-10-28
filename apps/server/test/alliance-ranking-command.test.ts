import { expect, test } from "bun:test";
import type { GameStore } from "@opencok/contracts/game";
import type { Row } from "@opencok/contracts/rows";
import type {
    AllianceRankingQuery,
    AllianceRankingSnapshot,
} from "@opencok/ranking/contracts/alliance-ranking";
import { createRealmGameService } from "../src/composition/game";
import { Rules } from "@opencok/rules/game";
import { decode, encode, sfs } from "@opencok/messages/sfs";

const now = 1792756800000;
const unused = async (): Promise<never> => {
    throw new Error("Unexpected dependency call");
};
function fixture()
{
    const calls: { uid: string; query: AllianceRankingQuery; }[] = [];
    let clocks = 0;
    const state: AllianceRankingSnapshot = {
        profile: { uid: "owner", serverId: 1, banFlag: 0, banTime: 0n, allianceId: "a" },
        candidates: ["a", "b"].map((uid) => ({
            uid,
            leaderUid: `leader-${uid}`,
            leader: "Leader",
            alliancename: uid,
            abbr: "A",
            curMember: 3,
            maxMember: 10,
            nums: "2",
            fightpower: "10000000",
            armyKill: "9",
        })),
        sciences: [],
        videos: [],
        fallbackRank: 1n,
    };
    const db: GameStore = {
        getProfileById: unused,
        getAccountsByPlayerId: unused,

        getPowerByPlayerId: unused,
        getPlayerSummariesByIds: unused,
        getCityByPlayerId: unused,
        getWorldByPointIds: unused,
        playerRanking: unused,
        mailGroups: unused,
        mailBatch: unused,
        mailCategory: unused,
        mailContents: unused,
        mailConversationSave: unused,
        mailDelete: unused,
        mailRead: unused,
        mailSave: unused,
        mailStatus: unused,
        allianceRanking: async (uid, query) => {
            calls.push({ uid, query });
            return state;
        },
    };
    const rules = new Rules(
        new Map(),
        new Map(),
        new Map(),
        undefined,
        new Map([["ranking", { k1: "2" }]]),
    );
    const game = createRealmGameService(db, rules, { kingdomId: 1 }, () => {
        clocks++;
        return now;
    });
    return { state, db, rules, game, calls, clocks: () => clocks };
}

test("alliance commands bind the authenticated player, preserve correlation and ignore forged alliance/page selectors", async () => {
    for (
        const [command, kind, metric] of [
            ["alliance.rank", "power", { fightpower: sfs.double(10000000) }],
            ["kill.al.rank", "kills", { armyKill: sfs.int(9) }],
        ] as const
    )
    {
        const { game, calls, clocks } = fixture();
        const result = await game.execute("owner", command, {
            uid: sfs.string("forged"),
            allianceId: sfs.string("other"),
            limit: sfs.int(999),
            offset: sfs.int(999),
            _cok_: sfs.string("request"),
            cmdBaseTime: sfs.long(99),
        });
        expect(calls).toEqual([{ uid: "owner", query: { kind, limit: 2, now } }]);
        expect(clocks()).toBe(1);
        expect(result.pushes).toEqual([]);
        expect(decode(encode(result.body))).toEqual({
            selfRanking: sfs.int(1),
            allianceRanking: sfs.array(
                (kind === "power" ? ["a", "b"] : ["a"]).map((uid) =>
                    sfs.object({
                        uid: sfs.string(uid),
                        alliancename: sfs.string(uid),
                        abbr: sfs.string("A"),
                        curMember: sfs.int(3),
                        maxMember: sfs.int(10),
                        nums: sfs.int(2),
                        leader: sfs.string("Leader"),
                        ...metric,
                    })
                ),
            ),
            _cok_: sfs.string("request"),
            cmdBaseTime: sfs.long(99),
        });
    }
});

test("alliance commands reject invalid owners, wrong realms, configuration and dependency failures", async () => {
    const profiles: (Row | undefined)[] = [
        undefined,
        { uid: "owner", serverId: 1, banFlag: 1 },
        { uid: "owner", serverId: 1, banTime: BigInt(now + 1) },
        { uid: "other", serverId: 1 },
        { uid: "owner", serverId: 2 },
    ];
    for (const profile of profiles)
    {
        const { state, game } = fixture();
        state.profile = profile;
        await expect(game.execute("owner", "alliance.rank", {})).rejects.toThrow();
    }
    const malformed = fixture();
    malformed.rules.items.get("ranking")!.k1 = "0";
    await expect(malformed.game.execute("owner", "kill.al.rank", {})).rejects.toThrow("102192");
    expect(malformed.calls).toEqual([]);
    const wrongRealm = fixture();
    await expect(
        createRealmGameService(wrongRealm.db, wrongRealm.rules, { kingdomId: 2 }).execute(
            "owner",
            "alliance.rank",
            {},
        ),
    ).rejects.toThrow();
    expect(wrongRealm.calls).toEqual([]);
    const failure = fixture();
    failure.db.allianceRanking = async () => {
        throw new Error("Synthetic ranking failure");
    };
    await expect(failure.game.execute("owner", "kill.al.rank", {})).rejects.toThrow(
        "Synthetic ranking failure",
    );
    const noAlliance = fixture();
    noAlliance.state.profile!.allianceId = "";
    expect(
        (await noAlliance.game.execute("owner", "alliance.rank", {})).body.selfRanking,
    ).toBeUndefined();
});
