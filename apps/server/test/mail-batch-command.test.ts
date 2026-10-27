import { expect, test } from "bun:test";
import type { Row } from "@opencok/contracts/rows";
import type { GameStore, GameServices } from "@opencok/contracts/game";
import type {
  MailBatchQuery,
  MailCategorySnapshot,
  MailListEntry,
  MailCategoryReaders,
  MailSender,
  MailTranslationLookup,
} from "@opencok/contracts/mail";
import { GameService as Game } from "@opencok/services/game";
import { Rules } from "@opencok/rules/game";
import { mailBatchQuery, mailBatchIsChat } from "@opencok/rules/mail";
import {
  decode,
  encode,
  extension,
  fields,
  sfs,
  type Fields,
  type Value,
} from "@opencok/messages/sfs";
import { mailListEntry, mailCategoryNow as now } from "./fixtures/mail-category.ts";
const unused = async (): Promise<never> => {
  throw new Error("Unexpected dependency");
};
const params = (type: number): Fields => ({
  type: sfs.int(type),
  num: sfs.int(0),
  offset: sfs.int(10),
});
const message = (body: Fields) => fields((body.result!.value as Value[])[0]);
function fixture() {
  const calls: { uid: string; query: MailBatchQuery }[] = [];
  const state: MailCategorySnapshot = {
    profile: { uid: "self", serverId: 1, banTime: 0n, banFlag: 0 },
  };
  const entries: MailListEntry[] = [];
  const requestedSenders: string[][] = [];
  const requestedTranslations: MailTranslationLookup[][] = [];
  const senders = new Map<string, MailSender>();
  const translations: (MailTranslationLookup & { contents: Buffer | null })[] = [];
  const plans: (readonly string[])[] = [];
  const readers: MailCategoryReaders = {
    senders: async (ids) => {
      requestedSenders.push([...ids]);
      return senders;
    },
    translations: async (lookups) => {
      requestedTranslations.push([...lookups]);
      return translations;
    },
  };
  let clocks = 0;
  const db: GameStore = {
    getProfileById: unused,
    getAccountsByPlayerId: unused,
    getCityByPlayerId: unused,
    getWorldByPointIds: unused,
    getConfigurationByPlayerId: unused,
    getPowerByPlayerId: unused,
    getPlayerSummariesByIds: unused,
    publicProfile: unused,
    playerRanking: unused,
    allianceRanking: unused,
    mailStatus: unused,
    mailSave: unused,
    mailRead: unused,
    mailDelete: unused,
    mailConversationSave: unused,
    mailContents: unused,
    mailCategory: unused,
    mailGroups: unused,
    mailBatch: async (uid, query, inspect) => {
      calls.push({ uid, query });
      plans.push(await inspect(entries, readers));
      return state;
    },
  };
  const config = { kingdomId: 1, mailTranslationEnabled: true };
  const services: GameServices = {};
  const game = new Game(
    db,
    new Rules(new Map(), new Map(), new Map()),
    config,
    () => {
      clocks++;
      return now;
    },
    services,
  );
  return {
    game,
    state,
    db,
    calls,
    entries,
    config,
    services,
    readers,
    senders,
    translations,
    plans,
    requestedSenders,
    requestedTranslations,
    clocks: () => clocks,
  };
}

test("batch rules distinguish notice/type filters, message pagination and separate group selectors", () => {
  const kinds = [
    "notices",
    "studio",
    "personal",
    "resources",
    "fight",
    "monsters",
    "trade",
    "moderation",
  ] as const;
  for (let type = 2; type <= 9; type++) {
    const expected = {
      kind: kinds[type - 2]!,
      begin: 0,
      limit: 2,
      fromUser: type === 4 || type === 9 ? " sender " : null,
      now,
    };
    expect(mailBatchQuery(type, -2147483648, 2, " sender ", now)).toEqual(expected);
    expect(mailBatchQuery(type, 2147483647, 2147483647, "sender", now).begin).toBe(2147483647);
    expect(mailBatchIsChat(mailBatchQuery(type, 0, 1, "sender", now))).toBe(
      [4, 5, 7, 8, 9].includes(type),
    );
  }
  expect(mailBatchQuery(11, 2, 0, null, now)).toEqual({
    kind: "boss",
    begin: 2,
    limit: 0,
    fromUser: null,
    now,
  });
  for (const type of [0, 1, 12, -2147483648, 2147483647])
    {expect(mailBatchQuery(type, -2147483648, -1, null, now)).toEqual({
      kind: "empty",
      begin: 0,
      limit: 0,
      fromUser: null,
      now,
    });}
  for (const type of [10, 1000]) {expect(() => mailBatchQuery(type, 0, 1, null, now)).toThrow();}
  for (const type of [4, 9])
    {for (const sender of [null, "", " \t\u2000", "x".repeat(41), "\0", "\ud800"])
      {expect(() => mailBatchQuery(type, 0, 1, sender, now)).toThrow();}}
  expect(mailBatchQuery(4, 0, 1, "\u00a0", now).fromUser).toBe("\u00a0");
  expect(mailBatchQuery(2, 0, 1, "\0", now).fromUser).toBeNull();
  for (const value of [NaN, Infinity, 0.5, 2147483648, -2147483649]) {
    expect(() => mailBatchQuery(value, 0, 1, null, now)).toThrow();
    expect(() => mailBatchQuery(2, value, 1, null, now)).toThrow();
    expect(() => mailBatchQuery(2, 0, value, null, now)).toThrow();
  }
  expect(() => mailBatchQuery(2, 0, -1, null, now)).toThrow();
  expect(() => mailBatchQuery(2, 0, 1, null, -1)).toThrow();
});

test("batch command binds the owner, preserves correlation and returns the ordinary envelope for notice/studio/fight/boss reads", async () => {
  for (const [selector, storedType] of [
    [2, 16],
    [3, 13],
    [6, 7],
    [11, 32],
  ]) {
    const f = fixture();
    f.entries.push(
      mailListEntry({
        type: storedType,
        contents: Buffer.from([7, 32].includes(storedType!) ? "{n:9007199254740993}" : "plain"),
      }),
    );
    const result = await f.game.execute("self", "mread.batch", {
      ...params(selector!),
      fromUser: sfs.null(),
      num: sfs.int(-3),
      _cok_: sfs.string("correlation"),
      cmdBaseTime: sfs.long(9),
      toUser: sfs.string("foreign"),
      serverId: sfs.int(2),
    });
    expect(f.calls[0]!.uid).toBe("self");
    expect(f.calls[0]!.query.begin).toBe(0);
    expect(f.calls[0]!.query.fromUser).toBeNull();
    expect(f.clocks()).toBe(1);
    expect(result.pushes).toEqual([]);
    expect(decode(encode(result.body))).toEqual(result.body);
    expect(result.body._cok_).toEqual(sfs.string("correlation"));
    expect(result.body.cmdBaseTime).toEqual(sfs.long(9));
    const first = message(result.body);
    expect(first.uid).toEqual(sfs.string("mail"));
    expect(first.status).toEqual(sfs.int(0));
    expect(first.fromName).toEqual(sfs.string("Past Name"));
    expect(first.save).toEqual(sfs.int(1));
    expect(first.detail).toBeDefined();
    expect(first.lastUpdateTime).toBeUndefined();
    expect(f.plans).toEqual([[]]);
  }
});

test("personal/moderator batch reads omit category-only metadata and use sender language with recipient updates", async () => {
  for (const [selector, type] of [
    [4, 22],
    [9, 24],
  ]) {
    const f = fixture();
    f.entries.push(
      mailListEntry({
        type,
        translationId: "pt|translation",
        contents: Buffer.from("original\\ntext"),
      }),
    );
    f.senders.set("sender", { name: "Current", pic: null, lang: "jp" });
    f.translations.push({
      id: "translation",
      language: "ja",
      contents: Buffer.from(" translated "),
    });
    f.services.playerUpdateTimes = async (realm, ids) => {
      expect([realm, ids]).toEqual([1, ["self"]]);
      return new Map([["self", "recipient-marker"]]);
    };
    const result = await f.game.execute("self", "mread.batch", {
      ...params(selector!),
      fromUser: sfs.string("sender"),
    });
    expect(f.calls[0]!.query.fromUser).toBe("sender");
    expect(f.requestedSenders).toEqual([["sender"]]);
    expect(f.requestedTranslations).toEqual([[{ id: "translation", language: "ja" }]]);
    expect(message(result.body)).toEqual({
      contents: sfs.string("original\ntext"),
      uid: sfs.string("mail"),
      type: sfs.int(type === 22 ? 1 : 24),
      createTime: sfs.long(9007199254740993n),
      lastUpdateTime: sfs.string("recipient-marker"),
      translationId: sfs.string("pt|translation"),
      originalLang: sfs.string("pt"),
      translationMsg: sfs.string(" translated "),
    });
  }
});

test("resource, monster and trade lists retain structured chat bodies and only trade adds sender portraits", async () => {
  for (const [selector, type] of [
    [5, 5],
    [7, 18],
    [8, 10],
  ]) {
    const f = fixture();
    f.entries.push(
      mailListEntry({
        type,
        contents: Buffer.from('{n:1,uid:"stored",createTime:1,type:99,status:9}'),
      }),
    );
    f.senders.set("sender", {
      name: "Current",
      pic: "portrait",
      picVer: "7",
      lang: "en",
      abbr: "TAG",
    });
    f.services.playerUpdateTimes = async () => new Map([["self", "marker"]]);
    const result = await f.game.execute("self", "mread.batch", params(selector!));
    const first = message(result.body);
    expect(first.n).toEqual(sfs.int(1));
    expect(first.uid).toEqual(sfs.string("mail"));
    expect(first.type).toEqual(sfs.int(type === 10 ? 21 : type!));
    expect(first.createTime).toEqual(sfs.long(9007199254740993n));
    expect(first.status).toEqual(sfs.int(9));
    expect(first.detail).toBeUndefined();
    expect(first.contentsArr).toBeUndefined();
    expect(first.fromUser).toBeUndefined();
    expect(first.fromName).toEqual(type === 10 ? sfs.string("Current") : undefined);
    expect(first.pic).toEqual(type === 10 ? sfs.string("portrait") : undefined);
    expect(f.requestedTranslations).toEqual([]);
  }
});

test("unknown/empty batch selectors return arrays while malformed requests never reach storage", async () => {
  const f = fixture();
  f.services.playerUpdateTimes = unused;
  f.readers.translations = unused;
  for (const selector of [0, 1, 12, -1, 2147483647])
    {expect(
      (await f.game.execute("self", "mread.batch", { ...params(selector), offset: sfs.int(-1) }))
        .body,
    ).toEqual({ result: sfs.array() });}
  for (const input of [
    {},
    { ...params(2), num: sfs.long(1) },
    { ...params(2), offset: sfs.int(-1) },
    { ...params(2), fromUser: sfs.int(1) },
    { ...params(2), fromUser: sfs.string(undefined as never) },
    params(4),
    { ...params(9), fromUser: sfs.null() },
    { ...params(4), fromUser: sfs.string("\u2000") },
  ]) {
    const g = fixture();
    await expect(g.game.execute("self", "mread.batch", input)).rejects.toThrow();
    expect(g.calls).toEqual([]);
  }
  await expect(f.game.execute("self", "mread.batch", params(4))).rejects.toMatchObject({
    code: "E000000",
  });
});

test("ordinary malformed detail allows removal but malformed structured chat rejects without cleanup as in the reference", async () => {
  for (const selector of [5, 7, 8]) {
    const f = fixture();
    const type = selector === 5 ? 5 : selector === 7 ? 18 : 10;
    f.entries.push(mailListEntry({ type, contents: Buffer.from("broken") }));
    await expect(f.game.execute("self", "mread.batch", params(selector))).rejects.toThrow();
    expect(f.plans).toEqual([]);
  }
  const f = fixture();
  f.entries.push(mailListEntry({ type: 32, contents: Buffer.from("broken") }));
  expect((await f.game.execute("self", "mread.batch", params(11))).body).toEqual({
    result: sfs.array(),
  });
  expect(f.plans).toEqual([["mail"]]);
  f.plans.length = 0;
  await expect(
    f.game.execute("self", "mread.batch", { ...params(11), _cok_: sfs.string("x".repeat(32768)) }),
  ).rejects.toThrow();
  expect(f.plans).toEqual([]);
});

test("batch dependency, snapshot and projection failures never return a successful partial list", async () => {
  for (const failure of [
    "sender",
    "translation",
    "marker",
    "foreign",
    "extra",
    "oversized-window",
  ] as const) {
    const f = fixture();
    f.entries.push(
      mailListEntry({
        type: 22,
        translationId: "pt|id",
        toUser: failure === "foreign" ? "other" : "self",
        contents: Buffer.from(failure === "extra" ? "extra" : "plain"),
      }),
    );
    if (failure === "sender") {f.readers.senders = unused;}
    if (failure === "translation") {f.readers.translations = unused;}
    if (failure === "marker") {f.services.playerUpdateTimes = unused;}
    await expect(
      f.game.execute("self", "mread.batch", {
        ...params(4),
        fromUser: sfs.string("sender"),
        ...(failure === "oversized-window" ? { offset: sfs.int(0) } : {}),
      }),
    ).rejects.toThrow();
    expect(f.plans).toEqual([]);
  }
  const profiles: (Row | undefined)[] = [
    undefined,
    { uid: "other", serverId: 1 },
    { uid: "self", serverId: 2 },
    { uid: "self", serverId: 1, banFlag: 1 },
    { uid: "self", serverId: 1, banTime: BigInt(now + 1) },
  ];
  for (const profile of profiles) {
    const f = fixture();
    f.state.profile = profile;
    await expect(f.game.execute("self", "mread.batch", params(2))).rejects.toThrow();
  }
  const f = fixture();
  f.db.mailBatch = unused;
  await expect(f.game.execute("self", "mread.batch", params(2))).rejects.toThrow();
});

test("mread.chat defaults only an absent type to personal conversation and preserves ownership and correlation", async () => {
  const f = fixture();
  f.entries.push(mailListEntry({ type: 22 }));
  const result = await f.game.execute("self", "mread.chat", {
    num: sfs.int(-9),
    offset: sfs.int(7),
    fromUser: sfs.string("sender"),
    toUser: sfs.string("foreign"),
    serverId: sfs.int(2),
    _cok_: sfs.string("chat-correlation"),
    cmdBaseTime: sfs.long(123),
  });
  expect(f.calls).toEqual([
    { uid: "self", query: { kind: "personal", begin: 0, limit: 7, fromUser: "sender", now } },
  ]);
  expect(f.clocks()).toBe(1);
  expect(message(result.body).uid).toEqual(sfs.string("mail"));
  expect(message(result.body).type).toEqual(sfs.int(1));
  expect(message(result.body).status).toBeUndefined();
  expect(result.body._cok_).toEqual(sfs.string("chat-correlation"));
  expect(result.body.cmdBaseTime).toEqual(sfs.long(123));
  expect(result.pushes).toEqual([]);
  expect(f.plans).toEqual([[]]);
  const missing = fixture();
  await expect(
    missing.game.execute("self", "mread.chat", { num: sfs.int(0), offset: sfs.int(1) }),
  ).rejects.toMatchObject({ code: "E000000" });
  expect(missing.calls).toEqual([]);
  for (const type of [sfs.null(), sfs.string("4"), sfs.long(4), sfs.byte(4)]) {
    const invalid = fixture();
    await expect(
      invalid.game.execute("self", "mread.chat", {
        ...params(4),
        type,
        fromUser: sfs.string("sender"),
      }),
    ).rejects.toThrow();
    expect(invalid.calls).toEqual([]);
  }
  const missingFields: Fields[] = [
    { offset: sfs.int(1), fromUser: sfs.string("sender") },
    { num: sfs.int(0), fromUser: sfs.string("sender") },
    { num: sfs.int(0), offset: sfs.int(1), fromUser: sfs.null() },
  ];
  for (const input of missingFields) {
    const invalid = fixture();
    await expect(invalid.game.execute("self", "mread.chat", input)).rejects.toThrow();
    expect(invalid.calls).toEqual([]);
  }
});

test("explicit mread.chat message selectors preserve batch queries, envelopes and failure semantics", async () => {
  for (const [selector, type] of [
    [2, 14],
    [3, 13],
    [4, 22],
    [5, 5],
    [6, 7],
    [7, 18],
    [8, 10],
    [9, 24],
    [11, 32],
    [0, null],
    [1, null],
    [-1, null],
    [2147483647, null],
  ]) {
    const batch = fixture();
    const chat = fixture();
    if (type !== null)
      {for (const f of [batch, chat])
        {f.entries.push(mailListEntry({ type, contents: Buffer.from("{n:1}") }));}}
    const input = { ...params(selector!), fromUser: sfs.string("sender"), _cok_: sfs.int(7) };
    expect(await chat.game.execute("self", "mread.chat", input)).toEqual(
      await batch.game.execute("self", "mread.batch", input),
    );
    expect(chat.calls).toEqual(batch.calls);
    expect(chat.requestedSenders).toEqual(batch.requestedSenders);
    expect(chat.plans).toEqual(batch.plans);
  }
  const unknown = fixture();
  expect(
    (
      await unknown.game.execute("self", "mread.chat", {
        ...params(-1),
        num: sfs.int(-9),
        offset: sfs.int(-1),
      })
    ).body,
  ).toEqual({ result: sfs.array() });
  const failed = fixture();
  failed.db.mailBatch = unused;
  await expect(
    failed.game.execute("self", "mread.chat", { ...params(4), fromUser: sfs.string("sender") }),
  ).rejects.toThrow();
  expect(failed.plans).toEqual([]);
});

test("mread.chat validates its own full response envelope before returning primary cleanup", async () => {
  const f = fixture();
  f.entries.push(mailListEntry({ type: 32, contents: Buffer.from("broken") }));
  const values = Array.from({ length: 127 }, () => sfs.string("x".repeat(32767)));
  values.push(sfs.string(""));
  const echo = sfs.array(values);
  const base = { result: sfs.array(), _cok_: echo };
  const padding = 4 * 1024 * 1024 - encode(extension("mread.chat", base)).length;
  expect(padding).toBeGreaterThan(0);
  expect(padding).toBeLessThanOrEqual(32767);
  values[127] = sfs.string("x".repeat(padding));
  const result = await f.game.execute("self", "mread.chat", { ...params(11), _cok_: echo });
  expect(encode(extension("mread.chat", result.body))).toHaveLength(4 * 1024 * 1024);
  expect(f.plans).toEqual([["mail"]]);
  f.plans.length = 0;
  await expect(
    f.game.execute("self", "mread.batch", { ...params(11), _cok_: echo }),
  ).rejects.toThrow();
  expect(f.plans).toEqual([]);
});
