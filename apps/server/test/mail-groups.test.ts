import { expect, test } from "bun:test";
import type {
    MailCategoryPresentation,
    MailGroupEntry,
    MailGroupPage,
    MailGroupPreview,
    MailListEntry,
} from "@opencok/contracts/mail";
import { mailGroupProjection } from "@opencok/services/mail-groups";
import { decodeLegacyJsonObject } from "@opencok/messages/legacy-json";
import {
    encode,
    extension,
    fields,
    ProtocolError,
    sfs,
    type Fields,
    type Value,
} from "@opencok/messages/sfs";
import {
    mailGroupContains,
    mailGroupQuery,
    mailGroupRule,
    mailGroupSenders,
    mailGroupWindow,
} from "@opencok/rules/mail-groups";
import { mailCategoryNow, mailListEntry } from "./fixtures/mail-category.ts";

const query = (type = 1000, begin = 0, limit = 1000) =>
    mailGroupQuery(type, begin, limit, mailCategoryNow);
const group = (
    groupType: number,
    groupIndex = "mail",
    overrides: Partial<MailGroupEntry> = {},
): MailGroupEntry => ({
    uid: "self",
    groupType,
    groupIndex,
    updateTime: 2000n,
    ...overrides,
});
const preview = (
    entries: readonly MailListEntry[] = [],
    total = BigInt(entries.length),
    unread = BigInt(entries.filter((entry) => (entry.status ?? 0) === 0).length),
): MailGroupPreview => ({ entries, total, unread });
const presentation = (resolved = false): MailCategoryPresentation => ({
    senders: new Map(
        resolved
            ? [["sender", { name: "Current Name", pic: "portrait", lang: "en", abbr: "TAG" }]]
            : [],
    ),
    recipientUpdateTime: "owner-marker",
    translationEnabled: true,
    translations: new Map(),
});
const messages = (body: Fields) => (body.result!.value as Value[]).map(fields);
const nested = (message: Fields, key: string) => (message[key]!.value as Value[]).map(fields);
const project = (
    page: MailGroupPage,
    context = presentation(),
    type = 1000,
    envelope: Fields = {},
) => mailGroupProjection("self", query(type), page, context, envelope);
function recent(type: number, count = 7): MailListEntry[]
{
    return Array.from({ length: count }, (_, index) =>
        mailListEntry({
            uid: `m${index}`,
            type,
            createTime: BigInt(100 - index),
            contents: Buffer.from([5, 10, 18].includes(type) ? `{n:${index}}` : `text ${index}`),
            status: index % 2,
        }));
}

test("group requests preserve nonnegative pagination without the message-list negative-start clamp", () => {
    expect(query(10, 3, 7)).toEqual({ moderation: true, begin: 3, limit: 7, now: mailCategoryNow });
    expect(query(1000, 2147483647, 2147483647)).toEqual({
        moderation: false,
        begin: 2147483647,
        limit: 2147483647,
        now: mailCategoryNow,
    });
    expect(query(1000, 0, 0).limit).toBe(0);
    for (const type of [-1, 0, 4, 9, 11, 100, 500, 1001, NaN])
    {
        expect(() => query(type)).toThrow();
    }
    for (const value of [-1, 0.5, 2147483648, Infinity, NaN])
    {
        expect(() => query(1000, value, 1)).toThrow();
        expect(() => query(10, 0, value)).toThrow();
    }
    for (const now of [-1, 1.5, Number.MAX_SAFE_INTEGER + 1, NaN])
    {
        expect(() => mailGroupQuery(1000, 0, 1, now)).toThrow();
    }
});

test("group families preserve effective query types and single-message cross-type membership", () => {
    const singles = [2, 11, 12, 17, 25, 26, 27, 28, 29, 33, 34];
    const expected = new Map<number, number[]>([
        ...singles.map((type) => [type, singles] as [number, number[]]),
        [100, [20, 21, 22]],
        [200, [5]],
        [300, [18]],
        [400, [10]],
        [500, [23, 24]],
    ]);
    for (let type = -1; type <= 501; type++)
    {
        expect(mailGroupRule(type)?.types).toEqual(expected.get(type));
        for (let stored = 0; stored < 50; stored++)
        {
            expect(mailGroupContains(group(type), { uid: "mail", fromUser: "mail", type: stored }))
                .toBe(
                    expected.get(type)?.includes(stored) ?? false,
                );
        }
    }
    expect(mailGroupContains(group(2), { uid: "mail", fromUser: null, type: 28 })).toBe(true);
    expect(mailGroupContains(group(2), { uid: "other", fromUser: "mail", type: 28 })).toBe(false);
    expect(
        mailGroupContains(group(100, " sender "), { uid: "mail", fromUser: "sender", type: 22 }),
    ).toBe(false);
    expect(mailGroupContains(group(200, "ignored"), { uid: "other", fromUser: null, type: 5 }))
        .toBe(
            true,
        );
});

test("group windows validate full ownership, mode, capacity and ordering before selecting seven", () => {
    const groups = Array.from(
        { length: 9 },
        (_, index) => group(2, `g${index}`, { updateTime: BigInt(100 - index) }),
    );
    expect(mailGroupWindow("self", query(1000, 100, 9), groups)).toEqual(groups.slice(0, 7));
    expect(mailGroupWindow("self", query(1000, 0, 0), [])).toEqual([]);
    expect(mailGroupWindow("self", query(), [group(-1, "")])).toHaveLength(1);
    expect(mailGroupWindow("self", query(10), [group(500)])).toHaveLength(1);
    for (
        const invalid of [
            [...groups.slice(0, 8), group(2, "foreign", { uid: "other" })],
            [group(500)],
            [group(501)],
            [group(2), group(2)],
            [group(2), group(11, "mail", { updateTime: 2001n })],
            [group(2, "x".repeat(41))],
            [group(2, "\0")],
            [group(2, "\ud800")],
            [group(2, "mail", { updateTime: 9223372036854775808n })],
            Array.from({ length: 1001 }, (_, index) => group(2, `g${index}`)),
        ]
    )
    {
        expect(() => mailGroupWindow("self", query(), invalid)).toThrow();
    }
    expect(() => mailGroupWindow("self", query(1000, 0, 8), groups)).toThrow();
    expect(() => mailGroupWindow("self", query(10), [group(100)])).toThrow();
    for (const owner of ["", "\u180e", "x".repeat(41), "\ud800", "\0"])
    {
        expect(() => mailGroupWindow(owner, query(), [])).toThrow();
    }
});

test("sender resolution uses the entire group page and Java whitespace semantics", () => {
    const groups = [
        ...Array.from({ length: 7 }, (_, index) => group(2, `m${index}`)),
        group(100, "sender"),
        group(500, "sender"),
        group(100, "other"),
        group(100, "\u180e"),
        group(500, "\u00a0"),
        group(100, ""),
        group(200, "unused"),
    ];
    expect(mailGroupSenders(groups)).toEqual(["sender", "other", "\u00a0"]);
});

test("conversation summaries keep whole-group counts and reverse only the newest seven previews", () => {
    const entries = recent(22);
    const page = { groups: [group(100, "sender")], previews: [preview(entries, 10n, 6n)] };
    const before = structuredClone(page);
    const result = project(page, presentation(true));
    const [message] = messages(result.body);
    expect(message!.uid).toEqual(sfs.string("m0"));
    expect(message!.createTime).toEqual(sfs.long(100n));
    expect(message!.type).toEqual(sfs.int(1));
    expect(message!.totalNum).toEqual(sfs.int(10));
    expect(message!.unread).toEqual(sfs.int(6));
    expect(message!.fromName).toEqual(sfs.string("Current Name"));
    expect(message!.oldName).toEqual(sfs.string("Past Name"));
    expect(message!.pic).toEqual(sfs.string("portrait"));
    expect(message!.picVer).toEqual(sfs.string("0"));
    expect(message!.alliance).toEqual(sfs.string("TAG"));
    expect(message!.detail).toBeUndefined();
    const chats = nested(message!, "chats");
    expect(chats.map((row) => row.uid)).toEqual(
        [6, 5, 4, 3, 2, 1, 0].map((index) => sfs.string(`m${index}`)),
    );
    for (const chat of chats)
    {
        expect(chat.lastUpdateTime).toEqual(sfs.string("owner-marker"));
        for (const key of ["status", "fromUser", "fromName", "pic", "detail", "totalNum", "unread"])
        {
            expect(chat[key]).toBeUndefined();
        }
    }
    expect(result.cleanup).toEqual({ groups: [], mailIds: [] });
    expect(structuredClone(page)).toEqual(before);
});

test("moderator group reads exclude media while retaining text translations and mapped field widths", () => {
    const entries = [mailListEntry({ type: 24, translationId: "pt|stored" })];
    const page = { groups: [group(500, "sender")], previews: [preview(entries)] };
    const context = presentation(true);
    context.translations = new Map([
        ["mail", { originalLang: "pt", translationMsg: " translated " }],
    ]);
    const [chat] = nested(messages(project(page, context, 10).body)[0]!, "chats");
    expect(chat).toEqual({
        contents: sfs.string("hello"),
        uid: sfs.string("mail"),
        type: sfs.int(24),
        createTime: sfs.long(9007199254740993n),
        lastUpdateTime: sfs.string("owner-marker"),
        translationId: sfs.string("pt|stored"),
        originalLang: sfs.string("pt"),
        translationMsg: sfs.string(" translated "),
    });
    for (
        const disabled of [
            { ...context, translationEnabled: false },
            {
                ...context,
                senders: new Map([["sender", { name: "name", pic: "pic", lang: null }]]),
            },
        ]
    )
    {
        expect(
            nested(messages(project(page, disabled, 10).body)[0]!, "chats")[0]!.translationId,
        ).toBeUndefined();
    }
    const missing = nested(messages(project(page, presentation(true), 10).body)[0]!, "chats")[0]!;
    expect(missing.translationId).toEqual(sfs.string("pt|stored"));
    expect(missing.translationMsg).toBeUndefined();
    for (const type of [23, 24])
    {
        expect(() =>
            project(
                { ...page, previews: [preview([mailListEntry({ type })])] },
                presentation(true),
                10,
            )
        ).not.toThrow();
    }
    for (const type of [22, 39, 40])
    {
        expect(() =>
            project(
                { ...page, previews: [preview([mailListEntry({ type })])] },
                presentation(true),
                10,
            )
        ).toThrow();
    }
});

test("resource, trade and monster summaries keep newest-first previews and full totals", () => {
    for (
        const [groupType, type, field] of [
            [200, 5, "collect"],
            [400, 10, "collect"],
            [300, 18, "monster"],
        ] as const
    )
    {
        const entries = recent(type);
        const [message] = messages(
            project({
                groups: [group(groupType, "arbitrary-index")],
                previews: [preview(entries, 100n, 50n)],
            }).body,
        );
        expect(message!.uid).toEqual(sfs.string("m0"));
        expect(message!.fromName).toEqual(sfs.string("Past Name"));
        expect(message!.pic).toBeUndefined();
        expect(message!.totalNum).toEqual(sfs.int(100));
        expect(message!.unread).toEqual(sfs.int(50));
        const items = nested(message!, field);
        expect(items.map((item) => item.uid)).toEqual(
            entries.map((entry) => sfs.string(entry.uid)),
        );
        for (const [index, item] of items.entries())
        {
            expect(item.n).toEqual(sfs.int(index));
            expect(item.lastUpdateTime).toEqual(sfs.string("owner-marker"));
            expect(item.fromName).toEqual(type === 10 ? sfs.string("Past Name") : undefined);
        }
    }
});

test("single-message groups retain ordinary details and zero counters regardless of unread status", () => {
    const entry = mailListEntry({
        type: 12,
        contents: Buffer.from("{n:9223372036854775807,uid:\"stored\"}"),
        reply: 15,
        rewardId: " \titem\n ",
        rewardStatus: 0,
    });
    const [message] = messages(project({ groups: [group(2)], previews: [preview([entry])] }).body);
    expect(message!.type).toEqual(sfs.int(14));
    expect(message!.detail).toEqual(
        sfs.object({ n: sfs.long(9223372036854775807n), uid: sfs.string("stored") }),
    );
    expect(message!.uid).toEqual(sfs.string("mail"));
    expect(message!.totalNum).toEqual(sfs.int(0));
    expect(message!.unread).toEqual(sfs.int(0));
    expect(message!.status).toEqual(sfs.int(0));
    expect(message!.save).toEqual(sfs.int(1));
    expect(message!.rewardStatus).toEqual(sfs.int(0));
    expect(message!.rewardId).toEqual(sfs.string("item"));
    for (const key of ["reply", "share", "like", "donate"])
    {
        expect(message![key]).toEqual(sfs.int(1));
    }
    expect(message!.mbLevel).toEqual(sfs.int(0));
    expect(message!.lastUpdateTime).toBeUndefined();
});

test("only the first seven groups are processed without refilling holes and later senders can enrich earlier previews", () => {
    const unknowns = Array.from({ length: 6 }, (_, index) => group(-1, `unknown${index}`));
    const page = {
        groups: [...unknowns, group(400), group(100, "sender"), group(12, "later-stale")],
        previews: [...unknowns.map(() => preview()), preview(recent(10, 1))],
    };
    const result = project(page, presentation(true));
    expect(result.cleanup).toEqual({
        groups: unknowns.map(({ groupType, groupIndex }) => ({ groupType, groupIndex })),
        mailIds: [],
    });
    expect(messages(result.body)).toHaveLength(1);
    const [message] = messages(result.body);
    expect(message!.fromName).toEqual(sfs.string("Current Name"));
    expect(nested(message!, "collect")[0]!.pic).toEqual(sfs.string("portrait"));
    expect(() => project({ ...page, previews: [...page.previews, preview()] }, presentation(true)))
        .toThrow();
});

test("empty recognized groups are removed while missing sender profiles preserve the reference failure", () => {
    const groups = [
        group(2, "missing"),
        group(200),
        group(100, "missing-sender"),
        group(100, "sender"),
    ];
    const page = { groups, previews: groups.map(() => preview()) };
    expect(() => project(page)).toThrow(ProtocolError);
    expect(project(page, presentation(true)).cleanup).toEqual({
        groups: groups.map(({ groupType, groupIndex }) => ({ groupType, groupIndex })),
        mailIds: [],
    });
    expect(() => project({ groups: [group(100, " ")], previews: [preview()] })).toThrow(
        ProtocolError,
    );
    expect(() => project({ groups: [], previews: [] }, presentation(true))).toThrow(ProtocolError);
    expect(project({ groups: [], previews: [] }).body).toEqual({ result: sfs.array() });
    expect(() =>
        project(
            {
                ...page,
                previews: [
                    preview(),
                    preview(),
                    preview([mailListEntry({ type: 22, fromUser: "missing-sender" })]),
                    preview(),
                ],
            },
            presentation(true),
        )
    ).toThrow(ProtocolError);
});

test("invalid single detail keeps its root envelope and plans primary-row removal only once", () => {
    const entry = mailListEntry({
        type: 12,
        contents: Buffer.from("broken"),
        saveFlag: 1,
        rewardStatus: 0,
    });
    const page = { groups: [group(12), group(2)], previews: [preview([entry]), preview([entry])] };
    const before = structuredClone(page);
    const result = project(page);
    expect(result.cleanup).toEqual({ groups: [], mailIds: ["mail"] });
    expect(messages(result.body)).toHaveLength(2);
    for (const message of messages(result.body))
    {
        expect(message.detail).toBeUndefined();
        expect(message.uid).toEqual(sfs.string("mail"));
        expect(message.totalNum).toEqual(sfs.int(0));
        expect(message.unread).toEqual(sfs.int(0));
    }
    expect(structuredClone(page)).toEqual(before);
});

test("malformed conversations, missing extra bodies and unsupported structures reject without a cleanup plan", () => {
    for (
        const [groupType, type] of [
            [200, 5],
            [300, 18],
            [400, 10],
        ]
    )
    {
        for (const contents of ["broken", "extra", "{[]:1}"])
        {
            const page = {
                groups: [group(12, "bad"), group(groupType!)],
                previews: [
                    preview([
                        mailListEntry({ uid: "bad", type: 12, contents: Buffer.from("broken") }),
                    ]),
                    preview([mailListEntry({ type, contents: Buffer.from(contents) })]),
                ],
            };
            const before = structuredClone(page);
            expect(() => project(page)).toThrow();
            expect(structuredClone(page)).toEqual(before);
        }
    }
    const page = {
        groups: [group(12)],
        previews: [
            preview([
                mailListEntry({
                    type: 12,
                    contents: Buffer.from("ExTrA"),
                    extra: Buffer.from("{n:1}"),
                }),
            ]),
        ],
    };
    expect(messages(project(page).body)[0]!.detail).toEqual(sfs.object({ n: sfs.int(1) }));
    expect(() =>
        project({
            ...page,
            previews: [preview([mailListEntry({ type: 12, contents: Buffer.from("extra") })])],
        })
    ).toThrow("Missing persisted mail contents");
});

test("projection rejects inconsistent ownership, membership, ordering, counts and duplicate rows", () => {
    const entries = recent(5);
    const page = { groups: [group(200)], previews: [preview(entries)] };
    const invalid: MailGroupPreview[] = [
        preview(entries, -1n),
        preview(entries, 6n),
        preview(entries, 8n, -1n),
        preview(entries, 8n, 9n),
        preview(entries, 2147483648n),
        preview(entries, 8n, 8n),
        preview(entries, 8n, 0n),
        preview([...entries, entries[0]!], 8n),
        preview([...entries].reverse()),
        preview(
            entries.map((entry, index) => (index === 0 ? { ...entry, toUser: "other" } : entry)),
        ),
        preview(entries.map((entry, index) => (index === 0 ? { ...entry, type: 18 } : entry))),
        preview(entries.map((entry, index) => (index === 1 ? { ...entry, uid: "m0" } : entry))),
    ];
    for (const entry of invalid)
    {
        expect(() => project({ ...page, previews: [entry] })).toThrow(ProtocolError);
    }
    expect(() => project({ ...page, previews: [] })).toThrow(ProtocolError);
    expect(() => project({ groups: [group(-1)], previews: [preview([mailListEntry()])] })).toThrow(
        ProtocolError,
    );
    expect(() =>
        project({ groups: [group(2)], previews: [preview([mailListEntry({ uid: "other" })])] })
    ).toThrow(ProtocolError);
    expect(() => project({ groups: [group(2)], previews: [preview([mailListEntry()], 2n)] }))
        .toThrow(
            ProtocolError,
        );
    const large = messages(
        project({ ...page, previews: [preview(entries, 2147483647n, 123n)] }).body,
    )[0]!;
    expect(large.totalNum).toEqual(sfs.int(2147483647));
    expect(large.unread).toEqual(sfs.int(123));
    const nullStatus = mailListEntry({ type: 5, status: null, contents: Buffer.from("{}") });
    expect(messages(project({ ...page, previews: [preview([nullStatus])] }).body)[0]!.unread)
        .toEqual(
            sfs.int(1),
        );
});

test("aggregate raw size and complete transport encoding must succeed before cleanup is returned", () => {
    const huge = Buffer.from("broken".padEnd(2 * 1024 * 1024 + 1, " "));
    const page = {
        groups: [group(12, "a"), group(12, "b")],
        previews: ["a", "b"].map((uid) =>
            preview([mailListEntry({ uid, type: 12, contents: huge })])
        ),
    };
    expect(() => project(page)).toThrow(ProtocolError);
    const raw = "{a:".repeat(29) + "{}" + "}".repeat(29);
    expect(() =>
        encode({
            result: sfs.array([sfs.object({ detail: sfs.object(decodeLegacyJsonObject(raw)) })]),
        })
    ).not.toThrow();
    const invalid = mailListEntry({ uid: "bad", type: 12, contents: Buffer.from("broken") });
    const deep = {
        groups: [group(12, "bad"), group(12, "deep")],
        previews: [
            preview([invalid]),
            preview([mailListEntry({ uid: "deep", type: 12, contents: Buffer.from(raw) })]),
        ],
    };
    expect(() => project(deep)).toThrow(ProtocolError);
    expect(() =>
        project(
            { groups: [group(12, "bad")], previews: [preview([invalid])] },
            presentation(),
            1000,
            {
                _cok_: sfs.string("x".repeat(32768)),
            },
        )
    ).toThrow(ProtocolError);
    const badPortrait = presentation(true);
    badPortrait.senders = new Map([["sender", { name: "name", pic: null, lang: "en" }]]);
    expect(() =>
        project({ groups: [group(100, "sender")], previews: [preview(recent(22, 1))] }, badPortrait)
    ).toThrow(ProtocolError);
});

test("group cleanup validates the actual chat command envelope rather than the longer batch command", () => {
    const page = {
        groups: [group(12)],
        previews: [preview([mailListEntry({ type: 12, contents: Buffer.from("broken") })])],
    };
    const body = project(page).body;
    const values = Array.from({ length: 127 }, () => sfs.string("x".repeat(32767)));
    values.push(sfs.string(""));
    const envelope = { _cok_: sfs.array(values) };
    const baseline = encode(extension("mread.chat", { ...body, ...envelope })).length;
    const padding = 4 * 1024 * 1024 - baseline;
    expect(padding).toBeGreaterThan(0);
    expect(padding).toBeLessThanOrEqual(32767);
    values[127] = sfs.string("x".repeat(padding));
    const result = mailGroupProjection(
        "self",
        query(),
        page,
        presentation(),
        envelope,
        "mread.chat",
    );
    expect(result.cleanup).toEqual({ groups: [], mailIds: ["mail"] });
    expect(encode(extension("mread.chat", { ...result.body, ...envelope }))).toHaveLength(
        4 * 1024 * 1024,
    );
    expect(() => project(page, presentation(), 1000, envelope)).toThrow(ProtocolError);
});
