import { NicknameService } from "@opencok/player/services/nickname";
import { checkGameProfile } from "@opencok/services/game-profile";
import { expect, test } from "bun:test";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import type { GameServices, GameStore } from "@opencok/contracts/game";
import type { Row } from "@opencok/contracts/rows";
import { createRealmGameService } from "../src/composition/game";
import { Rules } from "@opencok/rules/game";
import { decode, encode, sfs, type Fields } from "@opencok/messages/sfs";
import { loadNicknameServices } from "../src/nickname.ts";

function fixture(services?: GameServices)
{
    let profile: Row | undefined = { uid: "self", serverId: 2, banFlag: 0, banTime: 0n };
    const calls: string[] = [];
    let occupied = false,
        blocked = false;
    let failure = "";
    const store = {
        async getProfileById(uid: string)
        {
            expect(uid).toBe("self");
            calls.push("profile");
            return profile;
        },
        async nicknameOccupied(name: string)
        {
            calls.push(`occupied:${name}`);
            if (failure === "occupied")
            {
                throw new Error("Synthetic availability failure");
            }
            return occupied;
        },
    };
    const providers = services ?? {
        nicknameBadWords: (name: string) => {
            calls.push(`filter:${name}`);
            if (failure === "filter")
            {
                throw new Error("Synthetic filter failure");
            }
            return blocked;
        },
    };
    const game = createRealmGameService(
        store as unknown as GameStore,
        new Rules(new Map(), new Map(), new Map()),
        { kingdomId: 2 },
        () => 1000,
        {
            ...providers,
            nickname: new NicknameService(store, 2, {
                ...providers,
                checkProfile: checkGameProfile,
            }, () => 1000),
        },
    );
    return {
        game,
        store,
        calls,
        run: (params: Fields) => game.execute("self", "user.check.nickName", params),
        profile: (value: Row | undefined) => {
            profile = value;
        },
        occupied: (value: boolean) => {
            occupied = value;
        },
        blocked: (value: boolean) => {
            blocked = value;
        },
        fail: (value: string) => {
            failure = value;
        },
    };
}

test("authenticated nickname checks emit four exact Int fields with request correlation and no pushes", async () => {
    const instance = fixture();
    const params = {
        nickName: sfs.string(" alpha "),
        uid: sfs.string("other"),
        server: sfs.int(99),
        _cok_: sfs.string("request"),
        cmdBaseTime: sfs.long(42),
    };
    const before = structuredClone(params);
    const result = await instance.run(decode(encode(params)));
    expect(decode(encode(result.body))).toEqual({
        occupied: sfs.int(0),
        exist: sfs.int(0),
        length: sfs.int(7),
        remainLength: sfs.int(9),
        _cok_: params._cok_,
        cmdBaseTime: params.cmdBaseTime,
    });
    expect(result.pushes).toEqual([]);
    expect(instance.calls).toEqual(["profile", "filter:alpha", "occupied:alpha"]);
    expect(params).toEqual(before);
    instance.occupied(true);
    expect((await instance.run({ nickName: sfs.string("alpha") })).body).toEqual({
        occupied: sfs.int(1),
        exist: sfs.int(-1),
        length: sfs.int(5),
        remainLength: sfs.int(11),
    });
});

test("signed nickname check types skip only occupancy while zero and absent type check it", async () => {
    for (const type of [-2147483648, -1, 0, 1, 2, 2147483647])
    {
        const instance = fixture();
        instance.occupied(true);
        const result = await instance.run({ nickName: sfs.string("alpha"), type: sfs.int(type) });
        expect(result.body.occupied).toEqual(sfs.int(type === 0 ? 1 : 0));
        expect(result.body.exist).toEqual(sfs.int(type === 0 ? -1 : 0));
        expect(instance.calls).toEqual(
            type === 0
                ? ["profile", "filter:alpha", "occupied:alpha"]
                : ["profile", "filter:alpha"],
        );
    }
});

test("nickname length character and bad-word gates preserve lazy evaluation and parenthesis handling", async () => {
    for (const name of ["", "ab", "a".repeat(17), "ab/c", "a{b", "abc😀"])
    {
        const instance = fixture();
        expect((await instance.run({ nickName: sfs.string(name) })).body.exist).toEqual(
            sfs.int(-1),
        );
        expect(instance.calls).toEqual(["profile"]);
    }
    const blocked = fixture();
    blocked.blocked(true);
    expect((await blocked.run({ nickName: sfs.string("alpha") })).body).toEqual({
        occupied: sfs.int(0),
        exist: sfs.int(-1),
        length: sfs.int(5),
        remainLength: sfs.int(11),
    });
    expect(blocked.calls).toEqual(["profile", "filter:alpha"]);
    const parenthesis = fixture();
    expect((await parenthesis.run({ nickName: sfs.string("(alpha") })).body.exist).toEqual(
        sfs.int(-1),
    );
    expect(parenthesis.calls).toEqual(["profile", "filter:(alpha", "occupied:(alpha"]);
    const spaces = fixture();
    const result = await spaces.run({ nickName: sfs.string("a b c d e f g h ") });
    expect(result.body.length).toEqual(sfs.int(23));
    expect(result.body.remainLength).toEqual(sfs.int(-7));
    expect(result.body.exist).toEqual(sfs.int(0));
});

test("nickname checks reject missing banned mismatched and foreign-realm principals before providers", async () => {
    const profiles: (Row | undefined)[] = [
        undefined,
        { uid: "self", serverId: 2, banFlag: 1 },
        { uid: "self", serverId: 2, banTime: 1001n },
        { uid: "other", serverId: 2 },
        { uid: "self", serverId: 99 },
    ];
    for (const profile of profiles)
    {
        const instance = fixture();
        instance.profile(profile);
        await expect(instance.run({ nickName: sfs.string("alpha") })).rejects.toThrow();
        expect(instance.calls).toEqual(["profile"]);
    }
    const instance = fixture();
    instance.profile({ uid: "self", serverId: 2, banTime: 1000n });
    expect((await instance.run({ nickName: sfs.string("alpha") })).body.exist).toEqual(sfs.int(0));
});

test("nickname checks require String and signed Int wire types without coerced defaults", async () => {
    const invalid: Fields[] = [
        {},
        { nickName: sfs.null() },
        { nickName: sfs.int(5) },
        { nickName: sfs.string("alpha"), type: sfs.null() },
        { nickName: sfs.string("alpha"), type: sfs.long(0) },
        { nickName: sfs.string("alpha"), type: sfs.short(0) },
        { nickName: sfs.string("alpha"), type: sfs.string("0") },
        ...[1.1, NaN, Infinity, 2147483648, -2147483649].map((value) => ({
            nickName: sfs.string("alpha"),
            type: sfs.int(value),
        })),
        { nickName: sfs.string("a".repeat(65536)) },
    ];
    for (const params of invalid)
    {
        const instance = fixture();
        await expect(instance.run(params)).rejects.toThrow();
        expect(instance.calls).toEqual(["profile"]);
    }
});

test("nickname checks propagate reached provider failures without returning availability", async () => {
    for (const failure of ["filter", "occupied"])
    {
        const instance = fixture();
        instance.fail(failure);
        await expect(instance.run({ nickName: sfs.string("alpha") })).rejects.toThrow();
        expect(instance.calls).toEqual(
            failure === "filter"
                ? ["profile", "filter:alpha"]
                : ["profile", "filter:alpha", "occupied:alpha"],
        );
    }
    const missing = fixture({});
    await expect(missing.run({ nickName: sfs.string("alpha") })).rejects.toThrow();
    const absentStore = fixture();
    Object.defineProperty(absentStore.store, "nicknameOccupied", { value: undefined });
    await expect(absentStore.run({ nickName: sfs.string("alpha") })).rejects.toThrow();
    expect(
        (await absentStore.run({ nickName: sfs.string("alpha"), type: sfs.int(1) })).body.exist,
    ).toEqual(sfs.int(0));
});

test("realm nickname services compose the real JSON file filter with the authenticated command", async () => {
    const root = await mkdtemp(join(tmpdir(), "opencok-nickname-runtime-"));
    try
    {
        const wordsFile = join(root, "badwords.json");
        await writeFile(wordsFile, JSON.stringify(["blocked", "中文"]));
        const services = await loadNicknameServices(undefined, wordsFile);
        for (const name of ["BLOCKED", "中 文"])
        {
            const instance = fixture(services);
            const result = await instance.run({ nickName: sfs.string(name) });
            expect(result.body.exist).toEqual(sfs.int(-1));
            expect(result.body.occupied).toEqual(sfs.int(0));
            expect(result.pushes).toEqual([]);
            expect(instance.calls).toEqual(["profile"]);
        }
        const instance = fixture(services);
        expect((await instance.run({ nickName: sfs.string("clear") })).body.exist).toEqual(
            sfs.int(0),
        );
        expect(instance.calls).toEqual(["profile", "occupied:clear"]);
        await rm(wordsFile);
        const absent = fixture(await loadNicknameServices(undefined, wordsFile));
        expect((await absent.run({ nickName: sfs.string("blocked") })).body.exist).toEqual(
            sfs.int(0),
        );
        expect(absent.calls).toEqual(["profile", "occupied:blocked"]);
    }
    finally
    {
        await rm(root, { recursive: true, force: true });
    }
});
