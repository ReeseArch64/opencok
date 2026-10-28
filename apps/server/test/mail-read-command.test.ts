import { expect, test } from "bun:test";
import type { GameStore } from "@opencok/contracts/game";
import type { MailReadQuery, MailReadSnapshot } from "@opencok/contracts/mail";
import type { Row } from "@opencok/contracts/rows";
import { createRealmGameService } from "../src/composition/game";
import { Rules } from "@opencok/rules/game";
import { mailReadQuery } from "@opencok/rules/mail";
import { decode, encode, sfs, type Fields } from "@opencok/messages/sfs";

const now = 1792756800000;
const unused = async (): Promise<never> => {
    throw new Error("Unexpected dependency");
};
function fixture()
{
    const calls: { uid: string; query: MailReadQuery; }[] = [];
    let clocks = 0;
    const state: MailReadSnapshot = {
        profile: { uid: "self", serverId: 1, banTime: 0n, banFlag: 0 },
    };
    const db: GameStore = {
        getProfileById: unused,
        getAccountsByPlayerId: unused,
        getCityByPlayerId: unused,
        getPowerByPlayerId: unused,
        getPlayerSummariesByIds: unused,

        playerRanking: unused,
        allianceRanking: unused,
        mailStatus: unused,
        mailSave: unused,
        mailGroups: unused,
        mailBatch: unused,
        mailCategory: unused,
        mailContents: unused,
        mailConversationSave: unused,
        mailDelete: unused,
        mailRead: async (uid, query) => {
            calls.push({ uid, query });
            return state;
        },
    };
    const game = createRealmGameService(db, new Rules(new Map(), new Map(), new Map()), {
        kingdomId: 1,
    }, () => {
        clocks++;
        return now;
    });
    return { game, db, state, calls, clocks: () => clocks };
}

test("single and legacy-spelled batch read status bind the owner and return correlated acknowledgments", async () => {
    const cases: { command: string; params: Fields; query: MailReadQuery; }[] = [
        {
            command: "mail.read.status",
            params: { uid: sfs.string("mail"), type: sfs.int(99) },
            query: { batch: false, ids: ["mail"], now },
        },
        {
            command: "mail.read.status.betch",
            params: { uids: sfs.string("a,,b,a"), type: sfs.string("ignored") },
            query: { batch: true, ids: ["a", "b"], now },
        },
        {
            command: "mail.read.status.betch",
            params: { uids: sfs.string(" \t") },
            query: { batch: true, ids: [], now },
        },
    ];
    for (const entry of cases)
    {
        const { game, calls, clocks } = fixture();
        const result = await game.execute("self", entry.command, {
            ...entry.params,
            toUser: sfs.string("forged"),
            serverId: sfs.int(2),
            _cok_: sfs.string("request"),
            cmdBaseTime: sfs.long(123),
        });
        expect(calls).toEqual([{ uid: "self", query: entry.query }]);
        expect(clocks()).toBe(1);
        expect(result.pushes).toEqual([]);
        expect(decode(encode(result.body))).toEqual({
            success: sfs.bool(true),
            _cok_: sfs.string("request"),
            cmdBaseTime: sfs.long(123),
        });
    }
});

test("read status rejects invalid wire fields, unexpected command spelling and excessive IDs before persistence", async () => {
    const cases: { command: string; params: Fields; }[] = [
        { command: "mail.read.status.batch", params: { uids: sfs.string("a") } },
        { command: "mail.read.status", params: {} },
        { command: "mail.read.status", params: { uid: sfs.int(1), type: sfs.int(1) } },
        { command: "mail.read.status", params: { uid: sfs.string("a"), type: sfs.long(1) } },
        { command: "mail.read.status", params: { uid: sfs.string("a"), type: sfs.int(1.5) } },
        {
            command: "mail.read.status",
            params: { uid: sfs.string("a"), type: sfs.int(2147483648) },
        },
        { command: "mail.read.status.betch", params: { uids: sfs.array() } },
        { command: "mail.read.status.betch", params: { uids: sfs.string("a,".repeat(1001)) } },
    ];
    for (const { command, params } of cases)
    {
        const { game, calls } = fixture();
        await expect(game.execute("self", command, params)).rejects.toThrow();
        expect(calls).toEqual([]);
    }
});

test("read query rules retain single IDs and bounded batch semantics and reject invalid Unicode/time", () => {
    expect(mailReadQuery(false, "a,b", now)).toEqual({ batch: false, ids: ["a,b"], now });
    expect(mailReadQuery(true, ",a,, a ,a,", now).ids).toEqual(["a", " a "]);
    for (const ids of ["\0", "\ud800", "x".repeat(41), ",".repeat(65536)])
    {
        expect(() => mailReadQuery(true, ids, now)).toThrow();
    }
    for (const time of [NaN, -1, 1.5, Number.MAX_SAFE_INTEGER + 1])
    {
        expect(() => mailReadQuery(false, "a", time)).toThrow();
    }
    expect(() => mailReadQuery(1 as never, "a", now)).toThrow();
});

test("read status rejects missing/banned/wrong-realm snapshots and propagates transaction failures", async () => {
    const profiles: (Row | undefined)[] = [
        undefined,
        { uid: "other", serverId: 1 },
        { uid: "self", serverId: 2 },
        { uid: "self", serverId: 1, banFlag: 1 },
        { uid: "self", serverId: 1, banTime: BigInt(now + 1) },
    ];
    for (const profile of profiles)
    {
        const { state, game } = fixture();
        state.profile = profile;
        await expect(
            game.execute("self", "mail.read.status", { uid: sfs.string("a"), type: sfs.int(1) }),
        ).rejects.toThrow();
    }
    const { game, db } = fixture();
    db.mailRead = async () => {
        throw new Error("Synthetic read transaction failure");
    };
    await expect(
        game.execute("self", "mail.read.status.betch", { uids: sfs.string("a") }),
    ).rejects.toThrow("Synthetic read transaction failure");
});
