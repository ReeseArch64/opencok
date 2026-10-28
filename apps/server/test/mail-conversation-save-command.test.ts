import { expect, test } from "bun:test";
import type { GameStore } from "@opencok/contracts/game";
import type {
    MailConversationSaveQuery,
    MailConversationSaveSnapshot,
} from "@opencok/contracts/mail";
import type { Row } from "@opencok/contracts/rows";
import { createRealmGameService } from "../src/composition/game";
import { Rules } from "@opencok/rules/game";
import { mailConversationSaveQuery } from "@opencok/rules/mail";
import { decode, encode, sfs, type Fields } from "@opencok/messages/sfs";

const now = 1792756800000;
const unused = async (): Promise<never> => {
    throw new Error("Unexpected dependency");
};
function fixture()
{
    const calls: { uid: string; query: MailConversationSaveQuery; }[] = [];
    const state: MailConversationSaveSnapshot = {
        profile: { uid: "self", serverId: 1, banTime: 0n, banFlag: 0 },
    };
    let clocks = 0;
    const db: GameStore = {
        getProfileById: unused,
        getAccountsByPlayerId: unused,
        getCityByPlayerId: unused,
        getWorldByPointIds: unused,
        getPowerByPlayerId: unused,
        getPlayerSummariesByIds: unused,

        playerRanking: unused,
        allianceRanking: unused,
        mailStatus: unused,
        mailSave: unused,
        mailRead: unused,
        mailDelete: unused,
        mailGroups: unused,
        mailBatch: unused,
        mailCategory: unused,
        mailContents: unused,
        mailConversationSave: async (uid, query) => {
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
    return { game, state, db, calls, clocks: () => clocks };
}

test("conversation saving preserves every client type mapping and raw flag extreme", () => {
    for (
        const [input, type] of [
            [0, 21],
            [1, 22],
            [4, 7],
            [10, 14],
            [14, 12],
            [21, 10],
            [2, 2],
            [23, 23],
            [39, 39],
            [-1, -1],
            [2147483647, 2147483647],
        ] as const
    )
    {
        expect(mailConversationSaveQuery({ mod: 0, type: input, flag: -2147483648 }, now)).toEqual({
            scope: "type",
            type,
            flag: -2147483648,
            now,
        });
    }
    for (const flag of [-2147483648, -1, 0, 1, 2, 2147483647])
    {
        for (const mod of [-1, 0, 1, 2])
        {
            expect(mailConversationSaveQuery({ fromUser: "sender", mod, flag, type: NaN }, now))
                .toEqual({
                    scope: "sender",
                    fromUser: "sender",
                    moderation: mod === 1,
                    flag,
                    now,
                });
        }
    }
    expect(mailConversationSaveQuery({ mod: 0, flag: NaN }, now)).toEqual({ scope: "none", now });
    for (
        const input of [
            { mod: NaN },
            { mod: 0, type: 1 },
            { mod: 0, type: 1.5, flag: 0 },
            { mod: 0, type: 1, flag: 2147483648 },
            { mod: 0, fromUser: "\0", flag: 1 },
            { mod: 0, fromUser: "\ud800", flag: 1 },
            { mod: 0, fromUser: "x".repeat(41), flag: 1 },
        ]
    )
    {
        expect(() => mailConversationSaveQuery(input, now)).toThrow();
    }
    for (const time of [-1, NaN, 1.5, Number.MAX_SAFE_INTEGER + 1])
    {
        expect(() => mailConversationSaveQuery({ mod: 0 }, time)).toThrow();
    }
});

test("chatMail.save honors selector precedence, consumed wire fields and correlated empty-result acknowledgment", async () => {
    const cases: { params: Fields; query: MailConversationSaveQuery; }[] = [
        {
            params: {
                fromUser: sfs.string("sender"),
                type: sfs.string("ignored"),
                flag: sfs.int(2),
            },
            query: { scope: "sender", fromUser: "sender", moderation: false, flag: 2, now },
        },
        {
            params: {
                fromUser: sfs.string(""),
                mod: sfs.int(1),
                flag: sfs.int(-1),
                type: sfs.null(),
            },
            query: { scope: "sender", fromUser: "", moderation: true, flag: -1, now },
        },
        {
            params: { type: sfs.int(14), flag: sfs.int(0), mod: sfs.int(2) },
            query: { scope: "type", type: 12, flag: 0, now },
        },
        { params: { flag: sfs.string("unused"), mod: sfs.int(1) }, query: { scope: "none", now } },
        { params: {}, query: { scope: "none", now } },
    ];
    for (const { params, query } of cases)
    {
        const { game, calls, clocks } = fixture();
        const result = await game.execute("self", "chatMail.save", {
            ...params,
            uid: sfs.string("forged"),
            toUser: sfs.string("other"),
            serverId: sfs.int(2),
            _cok_: sfs.string("request"),
            cmdBaseTime: sfs.long(123),
        });
        expect(calls).toEqual([{ uid: "self", query }]);
        expect(clocks()).toBe(1);
        expect(result.pushes).toEqual([]);
        expect(decode(encode(result.body))).toEqual({
            success: sfs.bool(true),
            _cok_: sfs.string("request"),
            cmdBaseTime: sfs.long(123),
        });
    }
});

test("chatMail.save rejects consumed malformed fields before calling persistence", async () => {
    const cases: Fields[] = [
        { mod: sfs.long(1) },
        { mod: sfs.int(1.5) },
        { fromUser: sfs.int(1), flag: sfs.int(1) },
        { fromUser: sfs.null(), flag: sfs.int(1) },
        { fromUser: sfs.string(undefined as never), flag: sfs.int(1) },
        { type: sfs.int(undefined as never), flag: sfs.int(1) },
        { fromUser: sfs.string("sender") },
        { type: sfs.int(1), flag: sfs.bool(true) },
        { type: sfs.string("1"), flag: sfs.int(1) },
        { type: sfs.int(2147483648), flag: sfs.int(1) },
        { fromUser: sfs.string("sender"), flag: sfs.int(-2147483649) },
    ];
    for (const params of cases)
    {
        const { game, calls } = fixture();
        await expect(game.execute("self", "chatMail.save", params)).rejects.toThrow();
        expect(calls).toEqual([]);
    }
});

test("chatMail.save rejects unauthorized snapshots and transaction failures", async () => {
    const profiles: (Row | undefined)[] = [
        undefined,
        { uid: "other", serverId: 1 },
        { uid: "self", serverId: 2 },
        { uid: "self", serverId: 1, banFlag: 1 },
        { uid: "self", serverId: 1, banTime: BigInt(now + 1) },
    ];
    for (const profile of profiles)
    {
        const { game, state } = fixture();
        state.profile = profile;
        await expect(
            game.execute("self", "chatMail.save", {
                fromUser: sfs.string("sender"),
                flag: sfs.int(1),
            }),
        ).rejects.toThrow();
    }
    const { game, db } = fixture();
    db.mailConversationSave = async () => {
        throw new Error("Synthetic conversation failure");
    };
    await expect(
        game.execute("self", "chatMail.save", { type: sfs.int(1), flag: sfs.int(1) }),
    ).rejects.toThrow("Synthetic conversation failure");
});

test("conversation reads requiring chat effects reject before persistence", async () => {
    const f = fixture();
    let reads = 0;
    f.db.mailConversationRead = async () => {
        reads++;
        throw new Error("Chat effects must not reach mailbox persistence");
    };
    await expect(
        f.game.execute("self", "chatMail.read", {
            fromUser: sfs.string("sender"),
            mod: sfs.int(1),
            types: sfs.string("0,1,20"),
        }),
    ).rejects.toMatchObject({ code: "102192" });
    expect(f.calls).toEqual([]);
    expect(f.clocks()).toBe(1);
    expect(reads).toBe(0);
});
