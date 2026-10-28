import { expect, test } from "bun:test";
import type { Row } from "@opencok/ranking/contracts/rows";
import type { PlayerRankingSnapshot } from "@opencok/ranking/contracts/ranking";
import { playerRankingQuery, selectPlayerRanking } from "@opencok/ranking/rules/ranking";
import { playerRanking } from "@opencok/ranking/mappings/ranking";
import { decode, encode, sfs } from "@opencok/messages/sfs";

const now = 1792756800000;
function query()
{
    return playerRankingQuery(
        "building",
        { items: new Map([["ranking", { k2: "2" }]]), configuration: {} },
        now,
    );
}
function castle(uid: string, uuid = uid, changes: Row = {}): Row
{
    return {
        uid,
        uuid,
        level: 30,
        star: 1,
        updateTime: 123n,
        banTime: 0n,
        name: uid,
        pic: "",
        picVer: 1,
        picfraId: 2,
        allianceId: "missing",
        alliancename: null,
        abbr: null,
        icon: null,
        buildingPower: 9007199254740993n,
        ...changes,
    };
}
function snapshot(candidates: Row[], fallbackRank = 9n): PlayerRankingSnapshot
{
    return { profile: { uid: "self" }, candidates, fallbackRank };
}

test("castle windows remove only permanent bans and keep temporary bans and missing alliances", () => {
    const state = snapshot([
        castle("permanent", "p", { banTime: 9223372036854775807n }),
        castle("temporary", "t", { banTime: BigInt(now + 1) }),
        castle("self"),
        castle("other"),
    ]);
    const result = selectPlayerRanking("self", query(), state);
    expect(result.rows).toEqual(state.candidates.slice(1, 3));
    expect(result.selfRanking).toBe(2);
    expect(selectPlayerRanking("absent", query(), state).selfRanking).toBe(9);
    expect(selectPlayerRanking("self", query(), snapshot([], 2147483648n)).selfRanking).toBe(
        -2147483648,
    );
});

test("repeated castles retain entries and the final self ordinal across the full candidate window", () => {
    const state = snapshot([castle("self", "first"), castle("other"), castle("self", "second")]);
    const result = selectPlayerRanking("self", query(), state);
    expect(result.selfRanking).toBe(3);
    expect(result.rows).toEqual(state.candidates.slice(0, 2));
    for (
        const candidates of [
            [castle("self"), castle("self")],
            [castle("self", "")],
            [castle("self", "s", { banTime: null })],
            [castle("self", "s", { banTime: "9223372036854775808" })],
        ]
    )
    {
        expect(() => selectPlayerRanking("self", query(), snapshot(candidates))).toThrow("102192");
    }
});

test("castle wire preserves cached columns and types without exposing internal building identity", () => {
    const entry = castle("self", "private-building-id", { gold: 999n, email: "private" });
    expect(decode(encode(playerRanking("building", { rows: [entry], selfRanking: 1 })))).toEqual({
        selfRanking: sfs.int(1),
        serverRanking: sfs.array([
            sfs.object({
                uid: sfs.string("self"),
                name: sfs.string("self"),
                pic: sfs.string(""),
                picVer: sfs.int(1),
                picfraId: sfs.int(2),
                allianceId: sfs.string("missing"),
                level: sfs.int(30),
                star: sfs.int(1),
                updateTime: sfs.int(123),
                banTime: sfs.int(0),
                buildingPower: sfs.long(9007199254740993n),
            }),
        ]),
    });
    const withAlliance = castle("self", "s", {
        allianceId: "a",
        alliancename: " A ",
        abbr: "",
        icon: "",
        updateTime: 2147483648n,
        star: null,
    });
    expect(playerRanking("building", { rows: [withAlliance], selfRanking: 2 }).serverRanking)
        .toEqual(
            sfs.array([
                sfs.object({
                    uid: sfs.string("self"),
                    name: sfs.string("self"),
                    pic: sfs.string(""),
                    picVer: sfs.int(1),
                    picfraId: sfs.int(2),
                    allianceId: sfs.string("a"),
                    alliancename: sfs.string(" A "),
                    abbr: sfs.string(""),
                    icon: sfs.string(""),
                    level: sfs.int(30),
                    updateTime: sfs.long(2147483648n),
                    banTime: sfs.int(0),
                    buildingPower: sfs.long(9007199254740993n),
                }),
            ]),
        );
});
