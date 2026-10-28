import { expect, test } from "bun:test";
import type { GameStore } from "@opencok/contracts/game";
import type { Row } from "@opencok/contracts/rows";
import { GameService as Game } from "@opencok/services/game";
import { decode, encode, sfs, type Fields } from "@opencok/messages/sfs";
import { Rules } from "@opencok/rules/game";

function fixture()
{
    let profile: Row | undefined = { uid: "reporter", serverId: 1, banFlag: 0, banTime: 0n };
    const reports: unknown[][] = [];
    const store = {
        async getProfileById()
        {
            return profile;
        },
        async updateAvatarReport(...args: unknown[])
        {
            reports.push(args);
        },
    };
    const game = new Game(
        store as unknown as GameStore,
        new Rules(new Map(), new Map(), new Map()),
        { kingdomId: 1 },
        () => 1000,
    );
    return {
        reports,
        run: (params: Fields) => game.execute("reporter", "report.picVer", params),
        profile: (value: Row | undefined) => {
            profile = value;
        },
    };
}

test("avatar reports preserve exact targets, repeated submissions and request correlation", async () => {
    const f = fixture();
    const params = { uid: sfs.string(" Targeté "), _cok_: sfs.string("request-1") };
    const result = await f.run(params);
    expect(decode(encode(result.body))).toEqual({
        success: sfs.bool(true),
        _cok_: params._cok_,
    });
    expect(result.pushes).toEqual([]);
    await f.run(params);
    expect(f.reports).toEqual([
        ["reporter", " Targeté ", 1000],
        ["reporter", " Targeté ", 1000],
    ]);
});

test("avatar reports reject malformed targets before persistence", async () => {
    const f = fixture();
    const invalid: Fields[] = [
        {},
        { uid: sfs.int(1) },
        ...["", " \t\n", "a\0b", "a".repeat(256), "🏰", "\ud800"].map((uid) => ({
            uid: sfs.string(uid),
        })),
    ];
    for (const params of invalid)
    {
        await expect(f.run(params)).rejects.toThrow();
    }
    expect(f.reports).toEqual([]);
});

test("avatar reports reject missing, foreign and banned reporters before persistence", async () => {
    const f = fixture();
    const profiles: (Row | undefined)[] = [
        undefined,
        { uid: "other", serverId: 1 },
        { uid: "reporter", serverId: 2 },
        { uid: "reporter", serverId: 1, banFlag: 1 },
        { uid: "reporter", serverId: 1, banTime: 1001n },
    ];
    for (const profile of profiles)
    {
        f.profile(profile);
        await expect(f.run({ uid: sfs.string("target") })).rejects.toThrow();
    }
    expect(f.reports).toEqual([]);
});
