import { expect, test } from "bun:test";
import { PublicProfileService } from "../src/services/public-profile.ts";
import type { PublicProfileState } from "../src/contracts/public-profile.ts";
import type { PublicProfileRuntime } from "../src/contracts/public-profile-service.ts";
import { Rules } from "@opencok/rules/game";
import { sfs } from "@opencok/messages/sfs";

function fixture()
{
    const state: PublicProfileState = {
        profile: { uid: "2001", level: 1, serverId: 2 },
        statistics: undefined,
        lord: {},
        vip: undefined,
        mixed: undefined,
        military: undefined,
        office: undefined,
        flowers: undefined,
        alliance: undefined,
        taverns: [],
        generals: [],
        skills: [],
        equipment: [],
        honors: [],
        completedAchievements: 0,
    };
    const rules = new Rules(new Map(), new Map([["100101", { player_exp: "300" }]]), new Map());
    const calls: string[] = [];
    const observer = { uid: "1001", allianceId: "viewer-alliance" };
    const runtime: PublicProfileRuntime = {
        checkProfile: (profile, now) => {
            expect(profile).toBe(observer);
            expect(now).toBe(123);
            calls.push("eligibility");
            return observer;
        },
        generals: (snapshot, catalog, now) => {
            expect(snapshot).toBe(state);
            expect(catalog).toBe(rules);
            expect(now).toBe(123);
            calls.push("generals");
            return { extension: sfs.string("generals") };
        },
        alliance: (snapshot, catalog, remote) => {
            expect(snapshot).toBe(state);
            expect(catalog).toBe(rules);
            expect(remote).toBe(true);
            calls.push("alliance");
            return { extension: sfs.string("alliance"), lastUpdateTime: sfs.string("stale") };
        },
        playerUpdateTimes: async (realm, uids) => {
            expect(realm).toBe(2);
            expect(uids).toEqual(["2001"]);
            calls.push("markers");
            return new Map([["2001", "9007199254740993"]]);
        },
    };
    const service = new PublicProfileService(
        {
            getProfileById: async (uid) => {
                expect(uid).toBe("1001");
                calls.push("observer");
                return observer;
            },
            publicProfile: async (uid, allianceId) => {
                expect(uid).toBe("2001");
                expect(allianceId).toBe("viewer-alliance");
                calls.push("target");
                return { state, kingdomId: 2 };
            },
        },
        rules,
        { kingdomId: 1 },
        runtime,
        () => {
            calls.push("clock");
            return 123;
        },
    );
    return { state, calls, runtime, service };
}

test("public profile ports retain provider order, routed markers and last-writer response precedence", async () => {
    const h = fixture();
    const before = structuredClone(h.state);
    const result = await h.service.get("1001", { uid: sfs.string("2001"), serverId: sfs.int(99) });
    expect(h.calls).toEqual([
        "clock",
        "observer",
        "eligibility",
        "target",
        "generals",
        "alliance",
        "markers",
    ]);
    expect(result.serverId).toEqual(sfs.int(2));
    expect(result.extension).toEqual(sfs.string("alliance"));
    expect(result.lastUpdateTime).toEqual(sfs.string("9007199254740993"));
    expect(h.state).toEqual(before);
});

test("failed public providers stop later projections and missing markers preserve the empty default", async () => {
    const failed = fixture();
    failed.runtime.generals = () => {
        throw new Error("Unavailable generals");
    };
    await expect(failed.service.get("1001", { uid: sfs.string("2001") })).rejects.toThrow(
        "Unavailable generals",
    );
    expect(failed.calls).toEqual(["clock", "observer", "eligibility", "target"]);
    const missing = fixture();
    delete missing.runtime.playerUpdateTimes;
    expect((await missing.service.get("1001", { uid: sfs.string("2001") })).lastUpdateTime).toEqual(
        sfs.string(""),
    );
    expect(missing.calls).not.toContain("markers");
});
