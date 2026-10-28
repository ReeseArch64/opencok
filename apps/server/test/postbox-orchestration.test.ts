import { expect, test } from "bun:test";
import type { GameServices, GameStore } from "@opencok/contracts/game";
import type { Row } from "@opencok/contracts/rows";
import { GameController } from "@opencok/controllers/game";
import { encode, sfs, type Fields } from "@opencok/messages/sfs";
import { Rules } from "@opencok/rules/game";
import { createRealmGameService } from "../src/composition/game";

function fixture()
{
    const now = 1792756800123;
    const profile: Row = { uid: "self", serverId: 1, banTime: 0n, banFlag: 0 };
    const calls: unknown[][] = [];
    const saved = { uid: "mail", status: 0, saveFlag: 0, rewardStatus: 1, balance: 10n };
    const unused = async (): Promise<never> => {
        throw new Error("Unexpected dependency call");
    };
    const readers = {
        senders: async () => new Map(),
        translations: async () => [],
        preview: unused,
    };
    const db: GameStore = {
        getProfileById: async () => profile,
        getAccountsByPlayerId: unused,
        getCityByPlayerId: unused,
        getPowerByPlayerId: unused,
        getPlayerSummariesByIds: unused,
        playerRanking: unused,
        allianceRanking: unused,
        mailCategory: unused,
        mailContents: unused,
        mailConversationSave: unused,
        mailStatus: async (uid, query) => {
            calls.push(["status", uid, query]);
            return {
                profile,
                counts: [{ type: 2, status: saved.status, allianceNotice: false, count: 1n }],
            };
        },
        mailSave: async (uid, query) => {
            calls.push(["save", uid, query]);
            saved.saveFlag = query.flag;
            return { profile, result: query.flag === 1 ? "save" : "cancel" };
        },
        mailRead: async (uid, query) => {
            calls.push(["read", uid, query]);
            saved.status = 1;
            return { profile };
        },
        mailDelete: async (uid, query, plan) => {
            calls.push(["delete", uid, query, plan([])]);
            return { profile, deleted: 0 };
        },
        mailBatch: async (uid, query, inspect) => {
            calls.push(["batch", uid, query, await inspect([], readers)]);
            return { profile };
        },
        mailGroups: async (uid, query, inspect) => {
            calls.push(["groups", uid, query, await inspect([], readers)]);
            return { profile };
        },
        getSystemMailByPlayerId: async (uid, query, inspect) => {
            await inspect([], readers);
            calls.push(["system", uid, query]);
            return { profile };
        },
        mailUpdates: async (uid, query, inspect) => {
            await inspect([{
                uid: saved.uid,
                updateTime: BigInt(now),
                flags: {
                    status: saved.status,
                    saveFlag: saved.saveFlag,
                    rewardStatus: saved.rewardStatus,
                },
            }]);
            calls.push(["updates", uid, query]);
            return { profile };
        },
    };
    const services: GameServices = {
        lastSystemMail: async () => "0",
        systemMailPage: async (_uid, _ids, _count, _time, inspect) => inspect([], false),
    };
    const connect = () =>
        new GameController(createRealmGameService(
            db,
            new Rules(new Map(), new Map(), new Map()),
            { kingdomId: 1 },
            () => now,
            services,
        ));

    return { controller: connect(), connect, db, services, profile, calls, saved, now };
}

const systemBody = {
    id: sfs.string("0"),
    type: sfs.int(4),
    firstSeqId: sfs.string("-1"),
    lastSeqId: sfs.string("-1"),
};

const cases: [string, Fields, Fields, string][] = [
    [
        "mail.category.status",
        { category: sfs.int(1) },
        { total: sfs.long(1), unread: sfs.long(1) },
        "status",
    ],
    [
        "mail.save",
        { uid: sfs.string("mail"), type: sfs.int(2) },
        { save: sfs.string("success") },
        "save",
    ],
    ["mail.cancel.save", { uid: sfs.string("mail"), type: sfs.int(2) }, {
        cancel: sfs.string("success"),
    }, "save"],
    ["mail.save.batch", { uids: sfs.string("mail,,mail"), flag: sfs.int(1) }, {
        save: sfs.string("success"),
    }, "save"],
    [
        "mail.read.status",
        { uid: sfs.string("mail"), type: sfs.int(2) },
        { success: sfs.bool(true) },
        "read",
    ],
    [
        "mail.read.status.betch",
        { uids: sfs.string("mail,,mail") },
        { success: sfs.bool(true) },
        "read",
    ],
    ["mail.delete", { uids: sfs.string("mail") }, { delete: sfs.int(0) }, "delete"],
    ["mread.batch", { type: sfs.int(2), num: sfs.int(3), offset: sfs.int(7) }, {
        result: sfs.array(),
    }, "batch"],
    ["mread.chat", { fromUser: sfs.string("sender"), num: sfs.int(3), offset: sfs.int(7) }, {
        result: sfs.array(),
    }, "batch"],
    ["mread.batch", { type: sfs.int(10), num: sfs.int(0), offset: sfs.int(7) }, {
        result: sfs.array(),
    }, "groups"],
    ["mread.chat", { type: sfs.int(1000), num: sfs.int(0), offset: sfs.int(7) }, {
        result: sfs.array(),
    }, "groups"],
    ["chat.get.system.mails", { clientseq: sfs.null(), count: sfs.int(7) }, {
        ...systemBody,
        more: sfs.bool(false),
        msg: sfs.array(),
    }, "system"],
    ["chat.get.system.mails.v2", { clientseq: sfs.string("0"), count: sfs.int(7) }, {
        ...systemBody,
        lastUid: sfs.string("0"),
        more: sfs.bool(false),
        msg: sfs.array(),
    }, "system"],
    ["chat.get.update.mails", {}, { success: sfs.bool(true) }, "none"],
];

test.each(cases)(
    "%s_syntheticState_preservesExactSfsAndRetry %#",
    async (command, params, body, operation) => {
        const f = fixture();
        const expected = encode({
            ...body,
            _cok_: sfs.int(19),
            cmdBaseTime: sfs.string("synthetic-time"),
        });
        const input = {
            ...params,
            toUser: sfs.string("foreign"),
            serverId: sfs.int(2),
            _cok_: sfs.int(19),
            cmdBaseTime: sfs.string("synthetic-time"),
        };
        const first = await f.controller.execute("self", command, input);
        const retry = await f.connect().execute("self", command, input);

        expect(encode(first.body)).toEqual(expected);
        expect(encode(retry.body)).toEqual(expected);
        expect(first.pushes).toEqual([]);
        expect(retry.pushes).toEqual([]);
        expect(f.calls.map((call) => call.slice(0, 2))).toEqual(
            operation === "none" ? [] : [[operation, "self"], [operation, "self"]],
        );
        expect(f.saved.rewardStatus).toBe(1);
        expect(f.saved.balance).toBe(10n);
    },
);

test("mailUpdates_savedFlags_preservesReconnectBytesAndFundedState", async () => {
    const f = fixture();
    await f.controller.execute("self", "mail.save", { uid: sfs.string("mail"), type: sfs.int(2) });
    await f.controller.execute("self", "mail.read.status.betch", { uids: sfs.string("mail,mail") });
    const saved = structuredClone(f.saved);
    const result = await f.connect().execute("self", "chat.get.update.mails", {
        time: sfs.string("0"),
    });

    expect(encode(result.body)).toEqual(
        encode({
            data: sfs.string(
                "{\"update\":[{\"uid\":\"mail\",\"status\":1,\"rewardStatus\":1,\"saveFlag\":1,\"mailLastUpdateTime\":1792756800123}],\"delete\":[]}",
            ),
        }),
    );
    expect(f.saved).toEqual(saved);
    expect(f.saved).toEqual({ uid: "mail", status: 1, saveFlag: 1, rewardStatus: 1, balance: 10n });
    expect(f.calls).toEqual([
        ["save", "self", { mode: "save", ids: ["mail"], flag: 1, now: f.now }],
        ["read", "self", { batch: true, ids: ["mail"], now: f.now }],
        ["updates", "self", { after: 0n, now: f.now }],
    ]);
});

test("mailSystem_failedProvider_preservesStateAndAllowsIdenticalRetry", async () => {
    const f = fixture();
    const provider = f.db.getSystemMailByPlayerId!;
    const saved = structuredClone(f.saved);
    f.db.getSystemMailByPlayerId = async () => {
        throw new Error("Synthetic snapshot failure");
    };
    const params = { clientseq: sfs.string("anchor"), count: sfs.int(7), time: sfs.string("0") };

    await expect(f.controller.execute("self", "chat.get.system.mails.v2", params)).rejects.toThrow(
        "Synthetic snapshot failure",
    );
    expect(f.saved).toEqual(saved);
    expect(f.calls).toEqual([]);
    f.db.getSystemMailByPlayerId = provider;
    const retry = await f.connect().execute("self", "chat.get.system.mails.v2", params);

    expect(encode(retry.body)).toEqual(
        encode({
            ...systemBody,
            lastUid: sfs.string("0"),
            more: sfs.bool(false),
            msg: sfs.array(),
        }),
    );
    expect(f.calls).toEqual([["system", "self", { anchor: "anchor", time: 0n, now: f.now }]]);
    expect(f.saved).toEqual(saved);
});
