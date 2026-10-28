import { expect, test } from "bun:test";
import type { Row } from "@opencok/contracts/rows";
import { Rules } from "@opencok/rules/game";
import { playerRankingQuery, selectPlayerRanking } from "@opencok/rules/ranking";
import { playerRanking } from "@opencok/mappings/ranking";
import { decode, encode, sfs } from "@opencok/messages/sfs";

const now = 1792756800000;
function rules(k4 = "3")
{
    return new Rules(
        new Map(),
        new Map(),
        new Map(),
        undefined,
        new Map([["ranking", { k2: "8", k4 }]]),
    );
}
function row(uid: string, changes: Row = {}): Row
{
    return {
        uid,
        profileUid: uid,
        contributeSum: 100,
        banTime: 0n,
        name: uid,
        pic: "portrait",
        picVer: 2,
        picfraId: 3,
        allianceId: "",
        ...changes,
    };
}

test("contribution uses k4, removes bans after the single window and keeps candidate ordinals before presentation skips", () => {
    const query = playerRankingQuery("contribution", rules(), now);
    expect(query.limit).toBe(3);
    const state = {
        profile: { uid: "self" },
        candidates: [
            row("banned", { banTime: BigInt(now + 1) }),
            row("orphan", { profileUid: null }),
            row("self"),
        ],
        fallbackRank: 9n,
    };
    const result = selectPlayerRanking("self", query, state);
    expect(result).toEqual({ rows: [state.candidates[2]!], selfRanking: 2 });
    expect(selectPlayerRanking("absent", query, state).selfRanking).toBe(9);
    expect(() =>
        selectPlayerRanking("self", query, {
            ...state,
            candidates: [...state.candidates, row("extra")],
        })
    ).toThrow("102192");
    for (const k4 of ["", "0", "-1", "1.5", " 2", "32768"])
    {
        expect(() => playerRankingQuery("contribution", rules(k4), now)).toThrow("102192");
    }
});

test("empty visible contribution lists use myRanking=-1 regardless of the stored self or fallback position", () => {
    const query = playerRankingQuery("contribution", rules(), now);
    for (
        const candidates of [
            [],
            [row("self", { allianceId: "missing", allianceUid: null })],
            [row("self", { banTime: BigInt(now + 1) })],
        ]
    )
    {
        const ranking = selectPlayerRanking("self", query, {
            profile: { uid: "self" },
            candidates,
            fallbackRank: 5n,
        });
        expect(decode(encode(playerRanking("contribution", ranking)))).toEqual({
            myRanking: sfs.int(-1),
            serverRanking: sfs.array([]),
        });
    }
});

test("contribution public wire omits portrait frames and internal fields while preserving the fallback's int narrowing", () => {
    const candidate = row("other", {
        contributeSum: 2147483647,
        allianceId: "a",
        allianceUid: "a",
        alliancename: "Alliance",
        abbr: "A",
        picfraId: "invalid-and-unused",
        gmFlag: 1,
        crossFightSrcServerId: 2,
        email: "private",
    });
    const result = selectPlayerRanking("self", playerRankingQuery("contribution", rules(), now), {
        profile: { uid: "self" },
        candidates: [candidate],
        fallbackRank: 2147483648n,
    });
    expect(decode(encode(playerRanking("contribution", result)))).toEqual({
        myRanking: sfs.int(-2147483648),
        serverRanking: sfs.array([
            sfs.object({
                uid: sfs.string("other"),
                name: sfs.string("other"),
                pic: sfs.string("portrait"),
                picVer: sfs.int(2),
                contributeSum: sfs.int(2147483647),
                allianceId: sfs.string("a"),
                alliancename: sfs.string("Alliance"),
                abbr: sfs.string("A"),
            }),
        ]),
    });
});
