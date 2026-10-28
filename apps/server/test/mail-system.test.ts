import { expect, test } from "bun:test";
import type { GameServices, GameStore } from "@opencok/contracts/game";
import type { MailSystemQuery, MailSystemInspector, MailSender } from "@opencok/contracts/mail";
import type { Row } from "@opencok/contracts/rows";
import { GameService as Game } from "@opencok/services/game";
import { systemMailProjection } from "@opencok/services/mail-system";
import { fields, sfs, str, Type, type Fields, type Value } from "@opencok/messages/sfs";
import { Rules } from "@opencok/rules/game";
import { Cache } from "@opencok/storage/session";
import { mailListEntry } from "./fixtures/mail-category.ts";

const messages = (body: Fields) => (body.msg!.value as Value[]).map(fields);
const ids = (body: Fields) => messages(body).map((message) => str(message, "uid"));

function fixture()
{
    let profile: Row | undefined = { uid: "self", serverId: 1, banFlag: 0, banTime: 0n };
    const entries = [mailListEntry({ uid: "a", createTime: 1001n })];
    const queries: MailSystemQuery[] = [];
    const senderIds: string[][] = [];
    const senders = new Map<string, MailSender>();
    let cursors = 0;
    const services: GameServices = {
        lastSystemMail: async () => {
            cursors++;
            return "cached";
        },
    };
    const readers = {
        senders: async (uids: readonly string[]) => {
            senderIds.push([...uids]);
            return senders;
        },
        translations: async (): Promise<never> => {
            throw new Error("System mail must not request private translations");
        },
    };
    const store = {
        async getProfileById()
        {
            return profile;
        },
        async getSystemMailByPlayerId(
            uid: string,
            query: MailSystemQuery,
            inspect: MailSystemInspector,
        )
        {
            expect(uid).toBe("self");
            queries.push(query);
            await inspect(entries, readers);
            return { profile };
        },
    };
    const game = new Game(
        store as unknown as GameStore,
        new Rules(new Map(), new Map(), new Map()),
        { kingdomId: 1 },
        () => 1000,
        services,
    );
    return {
        game,
        entries,
        queries,
        senderIds,
        senders,
        services,
        readers,
        cursors: () => cursors,
        profile: (value: Row | undefined) => {
            profile = value;
        },
        run: (params: Fields = {}) =>
            game.execute("self", "chat.get.system.mails.v2", {
                clientseq: sfs.string("anchor"),
                count: sfs.int(20),
                ...params,
            }),
    };
}

test("V2 system mail preserves raw fields, correlation and the all-fit cursor quirk", async () => {
    const f = fixture();
    f.entries[0] = mailListEntry({
        uid: "raw",
        createTime: 9007199254740993n,
        contents: Buffer.from("line\\nnext"),
        rewardId: "gift\0value",
        reply: 15,
        saveFlag: 2,
    });
    const result = await f.run({ _cok_: sfs.string("request"), cmdBaseTime: sfs.long(99) });
    expect(result.body.lastUid).toEqual(sfs.string("0"));
    expect(result.body.more).toEqual(sfs.bool(false));
    expect(result.body.type).toEqual(sfs.int(4));
    expect(result.body.firstSeqId).toEqual(sfs.string("-1"));
    expect(result.body._cok_).toEqual(sfs.string("request"));
    expect(result.body.cmdBaseTime).toEqual(sfs.long(99));
    const message = messages(result.body)[0]!;
    expect(message.createTime).toEqual(sfs.long(9007199254740993n));
    expect(message.rewardId).toEqual(sfs.string("gift\0value"));
    expect(message.reply).toEqual(sfs.int(15));
    expect(message.save).toEqual(sfs.string("2"));
    expect(message.saveFlag).toEqual(sfs.int(2));
    expect(message.contents).toEqual(sfs.string(""));
    expect(message.contentsArr).toEqual(sfs.array([sfs.string("line\nnext")]));
    expect(result.pushes).toEqual([]);
    expect(f.queries).toEqual([{ anchor: "anchor", time: 0n, now: 1000 }]);
    expect(f.cursors()).toBe(0);
});

test("V2 pagination includes the timestamp bucket and first following message even for nonpositive counts", async () => {
    const f = fixture();
    f.entries.splice(
        0,
        1,
        ...[1001n, 1999n, 2000n, 3000n].map((createTime, i) =>
            mailListEntry({ uid: String(i), createTime })
        ),
    );
    for (const count of [0, -1, 1, 2])
    {
        const { body } = await f.run({ count: sfs.int(count), time: sfs.string("1000") });
        expect(ids(body)).toEqual(["0", "1", "2"]);
        expect(body.lastUid).toEqual(sfs.string("2"));
        expect(body.more).toEqual(sfs.bool(true));
    }
    expect(ids((await f.run({ count: sfs.int(0) })).body)).toEqual(["0"]);
    expect(
        ids((await f.run({ count: sfs.int(3), time: sfs.string("-9223372036854775808") })).body),
    ).toEqual(["0", "1", "2"]);
});

test("V2 cursor fallback accepts null, blank and zero and fails closed on cache failure", async () => {
    const f = fixture();
    for (const clientseq of [{ type: Type.Null, value: null }, sfs.string(" \t"), sfs.string("0")])
    {
        await f.run({ clientseq });
    }
    expect(f.cursors()).toBe(3);
    expect(f.queries.every((query) => query.anchor === "cached")).toBe(true);
    f.services.lastSystemMail = async () => {
        throw new Error("Synthetic cache outage");
    };
    await expect(f.run({ clientseq: sfs.string("0") })).rejects.toThrow();
    expect(f.queries.length).toBe(3);
});

test("V2 rejects malformed input and unauthorized owners before mailbox access", async () => {
    const f = fixture();
    const invalid: Fields[] = [
        { clientseq: sfs.int(0) },
        { clientseq: sfs.string("a".repeat(41)) },
        { count: sfs.short(1) },
        { time: sfs.long(1) },
        { time: sfs.string("9223372036854775808") },
        { time: sfs.string("1 ") },
    ];
    for (const params of invalid)
    {
        await expect(f.run(params)).rejects.toThrow();
    }
    const profiles: (Row | undefined)[] = [
        undefined,
        { uid: "foreign", serverId: 1 },
        { uid: "self", serverId: 2 },
        { uid: "self", serverId: 1, banFlag: 1 },
        { uid: "self", serverId: 1, banTime: 1001n },
    ];
    for (const profile of profiles)
    {
        f.profile(profile);
        await expect(f.run()).rejects.toThrow();
    }
    expect(f.queries).toEqual([]);
});

test("V2 projects persisted extra contents in 5000-unit chunks and excludes private mail", async () => {
    const f = fixture();
    f.entries.splice(
        0,
        1,
        mailListEntry({ uid: "private", type: 20 }),
        mailListEntry({
            uid: "extra",
            contents: Buffer.from("EXTRA"),
            extra: Buffer.from("a".repeat(4999) + "🏰"),
        }),
    );
    const { body } = await f.run();
    expect(ids(body)).toEqual(["extra"]);
    expect(messages(body)[0]!.contentsArr).toEqual(
        sfs.array([sfs.string("a".repeat(4999) + "?"), sfs.string("?")]),
    );
    f.entries[1]!.extra = null;
    await expect(f.run()).rejects.toThrow();
});

test("V2 enriches trade and invitation sender identities without private translation", async () => {
    const f = fixture();
    f.entries.splice(
        0,
        1,
        mailListEntry({ uid: "trade", type: 10, fromName: "" }),
        mailListEntry({
            uid: "invite",
            type: 26,
            fromUser: "ignored",
            fromName: "Historical",
            contents: Buffer.from("{\"inviterUid\":\"sender\"}"),
        }),
        mailListEntry({ uid: "ordinary", type: 2, fromName: "System" }),
    );
    f.senders.set("sender", {
        name: "Current",
        pic: "portrait",
        picVer: "12",
        lang: "en",
        abbr: "A",
    });
    const { body } = await f.run();
    expect(f.senderIds).toEqual([["sender"]]);
    expect(messages(body).map((message) => message.picVer)).toEqual([
        sfs.string("12"),
        sfs.string("12"),
        undefined,
    ]);
    expect(messages(body).map((message) => message.fromName)).toEqual([
        sfs.string("Current"),
        sfs.string("Historical"),
        sfs.string("System"),
    ]);
    expect(messages(body)[1]!.fromUser).toEqual(sfs.string("sender"));
    await expect(systemMailProjection("other", f.entries, f.readers, 20, 0n, {})).rejects.toThrow();
});

test("system-mail cache cursors are realm scoped, validated and read only", async () => {
    const cache = new Cache({ redisUrl: "unused", timeoutMs: 1, kingdomId: 2 });
    const commands: unknown[][] = [];
    let response: unknown = "cursor";
    cache.command = async (...args) => {
        commands.push(args);
        return response;
    };
    expect(await cache.lastSystemMail("self")).toBe("cursor");
    expect(commands).toEqual([
        ["HGET", "opencok:kingdom:2:chat-user-info:self", "chat_last_mail_id"],
    ]);
    response = null;
    expect(await cache.lastSystemMail("self")).toBeNull();
    for (const value of [1, "a".repeat(41), "a\0b", "\ud800"])
    {
        response = value;
        await expect(cache.lastSystemMail("self")).rejects.toThrow();
    }
    const before = commands.length;
    await expect(cache.lastSystemMail("invalid\0owner")).rejects.toThrow();
    expect(commands.length).toBe(before);
    cache.command = async () => {
        throw new Error("Synthetic Redis outage");
    };
    await expect(cache.lastSystemMail("self")).rejects.toThrow();
});

test("V1 system sync pre-encodes selected pages and exposes no V2 cursor", async () => {
    const f = fixture();
    f.entries.push(mailListEntry({ uid: "b", createTime: 2000n }));
    let committed = 0;
    f.services.systemMailPage = async (uid, ids, count, time, inspect) => {
        expect([uid, ids, count, time]).toEqual(["self", ["a", "b"], 1, 9007199254740993n]);
        inspect([1], true);
        committed++;
    };
    const params = {
        clientseq: sfs.string("anchor"),
        count: sfs.int(1),
        time: sfs.string("9007199254740993"),
        _cok_: sfs.string("request"),
    };
    const result = await f.game.execute("self", "chat.get.system.mails", params);
    expect(ids(result.body)).toEqual(["b"]);
    expect(result.body.more).toEqual(sfs.bool(true));
    expect(result.body.lastUid).toBeUndefined();
    expect(result.body._cok_).toEqual(sfs.string("request"));
    expect(committed).toBe(1);
    await expect(
        f.game.execute("self", "chat.get.system.mails", {
            ...params,
            _cok_: sfs.string("x".repeat(32768)),
        }),
    ).rejects.toThrow();
    expect(committed).toBe(1);
    f.profile({ uid: "foreign", serverId: 1 });
    await expect(f.game.execute("self", "chat.get.system.mails", params)).rejects.toThrow();
    expect(committed).toBe(1);
});

test("V1 cache detects contention, invalid metadata and poisoned selections without unchecked writes", async () => {
    const cache = new Cache({ redisUrl: "redis://unused", timeoutMs: 100, kingdomId: 1 });
    let writes = 0;
    cache.command = async (name) => {
        if (name === "HMGET")
        {
            return [null, null];
        }
        writes++;
        return 0;
    };
    await expect(cache.systemMailPage("self", ["a"], 1, 1n, () => {})).rejects.toThrow(
        "contention",
    );
    expect(writes).toBe(5);
    for (const value of [["a:b"], ["a", "a"], ["\0"], ["a".repeat(41)]])
    {
        await expect(cache.systemMailPage("self", value, 1, 1n, () => {})).rejects.toThrow();
    }
    expect(writes).toBe(5);
    cache.command = async () => [7, null];
    await expect(cache.systemMailPage("self", ["a"], 1, 1n, () => {})).rejects.toThrow();
});

test("native mixed polling composes social rooms with realm mail without losing wire types", async () => {
    const f = fixture();
    f.services.social = async (_owner, command, params): Promise<Fields> => {
        if (command === "chat.shield.list")
        {
            return { list: sfs.array([]) };
        }
        const room = JSON.parse(str(params, "params"))[0];
        return {
            rooms: sfs.array([
                sfs.object({
                    id: sfs.string(room.id),
                    type: sfs.int(room.type),
                    msg: sfs.array([]),
                    firstSeqId: sfs.string("-1"),
                    lastSeqId: sfs.string("-1"),
                }),
            ]),
        };
    };
    const result = await f.game.execute("self", "chat.get.new", {
        params: sfs.string(
            JSON.stringify([
                { id: "0", type: 4, seqid: "-1" },
                { id: "0", type: 2, seqid: "-1" },
                { id: "0", type: 0, seqid: "0" },
            ]),
        ),
    });
    const rooms = (result.body.rooms!.value as Value[]).map(fields);
    expect(rooms.map((room) => room.type?.value)).toEqual([4, 2, 0]);
    expect(ids(rooms[0]!)).toEqual(["a"]);
    expect(ids(rooms[1]!)).toEqual([]);
    expect(rooms[0]!.firstSeqId).toEqual(sfs.string("-1"));
    expect(f.queries.every((query) => query.anchor === null)).toBe(true);
});
