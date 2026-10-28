import { expect, test } from "bun:test";
import type { GameServices, GameStore } from "@opencok/contracts/game";
import type { Row } from "@opencok/contracts/rows";
import { createRealmGameService } from "../src/composition/game";
import { decode, encode, sfs, Type, type Fields } from "@opencok/messages/sfs";
import { Rules } from "@opencok/rules/game";
import { Cache } from "@opencok/storage/session";

function fixture()
{
    let profile: Row | undefined = { uid: "self", serverId: 2, banFlag: 0, banTime: 0n };
    let response: unknown = ["opaque", "", "opaque", "城\0value"];
    const commands: unknown[][] = [];
    const cache = new Cache({ redisUrl: "unused", timeoutMs: 1, kingdomId: 2 });
    cache.command = async (...args) => {
        commands.push(args);
        if (response instanceof Error)
        {
            throw response;
        }
        return response;
    };
    const store = {
        async getProfileById()
        {
            return profile;
        },
    };
    const services: GameServices = { scoreActivityRanking: () => cache.scoreActivityRanking() };
    const game = createRealmGameService(
        store as unknown as GameStore,
        new Rules(new Map(), new Map(), new Map()),
        { kingdomId: 2 },
        () => 1000,
        services,
    );
    return {
        commands,
        services,
        response: (value: unknown) => {
            response = value;
        },
        profile: (value: Row | undefined) => {
            profile = value;
        },
        run: (params: Fields = {}) => game.execute("self", "act.score.rank", params),
    };
}

test("score activity ranking preserves opaque ordered strings, duplicates and correlation", async () => {
    const f = fixture();
    const params = {
        _cok_: sfs.string("request"),
        cmdBaseTime: sfs.long(9007199254740993n),
        serverId: sfs.int(1),
        rankType: sfs.string("ignored"),
    };
    const result = await f.run(params);
    expect(decode(encode(result.body))).toEqual({
        rank: { type: Type.StringArray, value: ["opaque", "", "opaque", "城\0value"] },
        _cok_: params._cok_,
        cmdBaseTime: params.cmdBaseTime,
    });
    expect(result.pushes).toEqual([]);
    expect(f.commands).toEqual([["LRANGE", "SCORE_ACT_RANK_2", "0", "-1"]]);
});

test("score activity ranking distinguishes empty/reached-failed boards from a missing provider", async () => {
    const f = fixture();
    for (const response of [[], new Error("Synthetic Redis outage")])
    {
        f.response(response);
        expect((await f.run()).body.rank).toEqual({ type: Type.StringArray, value: [] });
    }
    delete f.services.scoreActivityRanking;
    await expect(f.run()).rejects.toMatchObject({ code: "102192" });
    expect(f.commands.length).toBe(2);
});

test("score activity ranking rejects missing, foreign and banned owners before cache access", async () => {
    const f = fixture();
    const profiles: (Row | undefined)[] = [
        undefined,
        { uid: "other", serverId: 2 },
        { uid: "self", serverId: 1 },
        { uid: "self", serverId: 2, banFlag: 1 },
        { uid: "self", serverId: 2, banTime: 1001n },
    ];
    for (const profile of profiles)
    {
        f.profile(profile);
        await expect(f.run()).rejects.toThrow();
    }
    expect(f.commands).toEqual([]);
});

test("score activity ranking rejects malformed and oversized complete boards without truncation", async () => {
    const f = fixture();
    for (
        const response of [
            null,
            "not a list",
            [1],
            ["\ud800"],
            ["é".repeat(16384)],
            Array(32768).fill(""),
            Array(129).fill("a".repeat(32767)),
        ]
    )
    {
        f.response(response);
        await expect(f.run()).rejects.toThrow();
    }
    f.response(Array(32767).fill(""));
    expect(((await f.run()).body.rank!.value as string[]).length).toBe(32767);
    f.response(["a".repeat(32767)]);
    expect(((await f.run()).body.rank!.value as string[])[0]!.length).toBe(32767);
    await expect(f.run({ _cok_: sfs.string("a".repeat(32768)) })).rejects.toThrow();
});
