import { expect, test } from "bun:test";
import type { GameStore, GameServices } from "@opencok/contracts/game";
import type {
  MailCategoryQuery,
  MailCategorySnapshot,
  MailListEntry,
  MailCategoryReaders,
  MailSender,
  MailTranslationLookup,
} from "@opencok/contracts/mail";
import type { Row } from "@opencok/contracts/rows";
import { Game } from "@opencok/controllers/game";
import { Rules } from "@opencok/rules/game";
import { decode, encode, fields, sfs, type Fields, type Value } from "@opencok/messages/sfs";
import { mailListEntry, mailCategoryNow as now } from "./fixtures/mail-category.ts";
const unused = async (): Promise<never> => {
  throw new Error("Unexpected dependency");
};
const params = (category: number): Fields => ({
  category: sfs.int(category),
  num: sfs.int(0),
  offset: sfs.int(10),
});
const message = (body: Fields) => fields((body.result!.value as Value[])[0]);
function fixture() {
  const calls: { uid: string; query: MailCategoryQuery }[] = [];
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
    mailGroups: unused,
    mailBatch: unused,
    mailCategory: async (uid, query, inspect) => {
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

test("category command validates inputs, authenticates its snapshot and ignores sender filters", async () => {
  const f = fixture();
  f.entries.push(mailListEntry());
  const result = await f.game.execute("self", "mread.batch.category", {
    ...params(1),
    fromUser: sfs.string("ignored"),
    toUser: sfs.string("other"),
    serverId: sfs.int(2),
    _cok_: sfs.int(7),
    cmdBaseTime: sfs.long(8),
  });
  expect(f.calls).toEqual([{ uid: "self", query: { category: 1, begin: 0, offset: 10, now } }]);
  expect(f.clocks()).toBe(1);
  expect(result.pushes).toEqual([]);
  expect(decode(encode(result.body))).toEqual(result.body);
  expect(result.body._cok_).toEqual(sfs.int(7));
  expect(result.body.cmdBaseTime).toEqual(sfs.long(8));
  expect(message(result.body).uid).toEqual(sfs.string("mail"));
  expect(f.plans).toEqual([[]]);
  for (const input of [
    {},
    { ...params(1), num: sfs.long(0) },
    { ...params(1), category: sfs.int(1.5) },
    { ...params(1), offset: sfs.int(2147483648) },
    { ...params(1), fromUser: sfs.int(1) },
    { ...params(1), fromUser: sfs.string(undefined as never) },
  ]) {
    const g = fixture();
    await expect(g.game.execute("self", "mread.batch.category", input)).rejects.toThrow();
    expect(g.calls).toEqual([]);
  }
  for (const profile of [
    undefined,
    { uid: "other", serverId: 1 },
    { uid: "self", serverId: 2 },
    { uid: "self", serverId: 1, banFlag: 1 },
    { uid: "self", serverId: 1, banTime: BigInt(now + 1) },
  ] as (Row | undefined)[]) {
    const g = fixture();
    g.state.profile = profile;
    await expect(g.game.execute("self", "mread.batch.category", params(1))).rejects.toThrow();
  }
});

test("empty category windows retain acknowledgment versus empty-result shapes without presentation IO", async () => {
  const f = fixture();
  f.readers.senders = async (uids) => {
    expect(uids).toEqual([]);
    return new Map();
  };
  f.readers.translations = unused;
  f.services.playerUpdateTimes = unused;
  expect(
    (
      await f.game.execute("self", "mread.batch.category", {
        ...params(0),
        _cok_: sfs.string("ack"),
      })
    ).body,
  ).toEqual({ success: sfs.bool(true), _cok_: sfs.string("ack") });
  for (const category of [1, 4, 7])
    expect(
      (
        await f.game.execute("self", "mread.batch.category", {
          ...params(category),
          num: sfs.int(1),
        })
      ).body,
    ).toEqual({ result: sfs.array() });
});

test("chat category enriches only selected senders and resolves stored translations in sender language", async () => {
  const f = fixture();
  f.entries.push(
    mailListEntry({ uid: "skip", type: 28, fromUser: "ignored" }),
    mailListEntry({
      type: 22,
      translationId: "pt|translated",
      contents: Buffer.from("original\\ntext"),
    }),
    mailListEntry({ uid: "second", type: 22, translationId: "pt|translated" }),
  );
  f.senders.set("sender", {
    name: "Current",
    pic: "portrait",
    picVer: "9",
    lang: "jp",
    abbr: "TAG",
  });
  f.translations.push({
    id: "translated",
    language: "ja",
    contents: Buffer.from(" translated \n"),
  });
  const updates: unknown[] = [];
  f.services.playerUpdateTimes = async (realm, ids) => {
    updates.push([realm, ids]);
    return new Map([
      ["self", "owner-update"],
      ["sender", "unused-sender-update"],
    ]);
  };
  const result = await f.game.execute("self", "mread.batch.category", params(4));
  expect(f.requestedSenders).toEqual([["sender"]]);
  expect(f.requestedTranslations).toEqual([[{ id: "translated", language: "ja" }]]);
  expect(updates).toEqual([[1, ["self"]]]);
  const first = message(result.body);
  expect(first.contents).toEqual(sfs.string("original\ntext"));
  expect(first.translationMsg).toEqual(sfs.string(" translated \n"));
  expect(first.originalLang).toEqual(sfs.string("pt"));
  expect(first.lastUpdateTime).toEqual(sfs.string("owner-update"));
  expect(first.fromName).toEqual(sfs.string("Current"));
  expect(first.oldName).toEqual(sfs.string("Past Name"));
  expect(first.picVer).toEqual(sfs.string("9"));
  expect(first.alliance).toEqual(sfs.string("TAG"));
  expect(result.body.result!.value as Value[]).toHaveLength(2);
});

test("translation gates, malformed IDs, missing or blank stored values preserve original text", async () => {
  for (const setup of [
    "disabled",
    "null-language",
    "malformed",
    "missing",
    "blank",
    "invalid-utf8",
    "moderator",
  ] as const) {
    const f = fixture();
    f.entries.push(
      mailListEntry({
        type: setup === "moderator" ? 24 : 22,
        translationId: setup === "malformed" ? "invalid" : "pt|stored",
      }),
    );
    if (setup === "disabled") f.config.mailTranslationEnabled = false;
    if (setup === "null-language")
      f.senders.set("sender", { name: "Current", pic: "portrait", lang: null });
    if (setup === "blank" || setup === "invalid-utf8")
      f.translations.push({
        id: "stored",
        language: "en",
        contents: setup === "blank" ? Buffer.from("\t \n") : Buffer.from([0xff]),
      });
    const result = await f.game.execute(
      "self",
      "mread.batch.category",
      params(setup === "moderator" ? 7 : 4),
    );
    const first = message(result.body);
    expect(first.contents).toEqual(sfs.string("hello"));
    expect(first.translationMsg).toBeUndefined();
    expect(first.lastUpdateTime).toEqual(sfs.string(""));
    expect(first.translationId).toEqual(
      ["disabled", "null-language"].includes(setup)
        ? undefined
        : sfs.string(setup === "malformed" ? "invalid" : "pt|stored"),
    );
    expect(f.requestedTranslations.length).toBe(
      ["disabled", "null-language", "malformed"].includes(setup) ? 0 : 1,
    );
  }
});

test("projection, lookup and correlation failures produce no malformed-row removal plan", async () => {
  for (const failure of [
    "sender",
    "marker",
    "translation",
    "foreign-translation",
    "duplicate-translation",
    "encoding",
    "contents",
  ] as const) {
    const f = fixture();
    const chat = ["marker", "translation", "foreign-translation", "duplicate-translation"].includes(
      failure,
    );
    f.entries.push(
      mailListEntry({
        type: chat ? 22 : 32,
        translationId: "pt|id",
        contents: Buffer.from(failure === "contents" ? "extra" : "broken"),
      }),
    );
    if (failure === "sender") f.readers.senders = unused;
    if (failure === "marker") f.services.playerUpdateTimes = unused;
    if (failure === "translation") f.readers.translations = unused;
    if (failure === "foreign-translation")
      f.translations.push({ id: "other", language: "en", contents: Buffer.from("text") });
    if (failure === "duplicate-translation")
      f.translations.push(
        ...Array.from({ length: 2 }, () => ({
          id: "id",
          language: "en",
          contents: Buffer.from("text"),
        })),
      );
    await expect(
      f.game.execute("self", "mread.batch.category", {
        ...params(chat ? 4 : 3),
        ...(failure === "encoding" ? { _cok_: sfs.string("x".repeat(32768)) } : {}),
      }),
    ).rejects.toThrow();
    expect(f.plans).toEqual([]);
  }
  const f = fixture();
  f.entries.push(mailListEntry({ type: 32, contents: Buffer.from("broken") }));
  expect((await f.game.execute("self", "mread.batch.category", params(3))).body).toEqual({
    result: sfs.array(),
  });
  expect(f.plans).toEqual([["mail"]]);
  f.db.mailCategory = unused;
  await expect(f.game.execute("self", "mread.batch.category", params(1))).rejects.toThrow();
});
