import { expect, test } from "bun:test";
import { decodeLegacyJsonObject } from "@opencok/messages/legacy-json";
import type { MailListEntry, MailCategoryPresentation } from "@opencok/contracts/mail";
import { mailCategoryProjection } from "@opencok/services/mail-category";
import {
  decode,
  encode,
  fields,
  ProtocolError,
  sfs,
  type Fields,
  type Value,
} from "@opencok/messages/sfs";
import {
  mailBlank,
  mailCategoryQuery,
  mailCategoryWindow,
  mailCategorySenders,
  mailClientType,
  mailTranslationRequest,
  selectMailCategory,
} from "@opencok/rules/mail";

const now = 1792756800000;
const query = (category: number, begin = 0, offset = 1000) =>
  mailCategoryQuery(category, begin, offset, now);
function entry(type = 2, overrides: Partial<MailListEntry> = {}): MailListEntry {
  return {
    uid: "mail",
    toUser: "self",
    fromUser: "sender",
    fromName: "Past Name",
    title: "title",
    rewardId: " \titems:synthetic\n ",
    rewardStatus: 1,
    status: 0,
    itemIdFlag: 1,
    saveFlag: 1,
    reply: 9,
    translationId: null,
    type,
    contents: Buffer.from("hello\\nworld"),
    extra: null,
    createTime: 9007199254740993n,
    ...overrides,
  };
}
function presentation(): MailCategoryPresentation {
  return {
    senders: new Map(),
    translations: new Map(),
    recipientUpdateTime: "owner-marker",
    translationEnabled: true,
  };
}
function project(category: number, entries: MailListEntry[], context = presentation()) {
  return mailCategoryProjection("self", query(category), entries, context);
}
function messages(body: Fields): Fields[] {
  expect(decode(encode(body))).toEqual(body);
  return (body.result!.value as Value[]).map(fields);
}

test("category windows retain early break, signed-int addition and unknown-category distinctions", () => {
  const vectors = [
    [0, 10, 10],
    [1, 10, 0],
    [-1, 10, 9],
    [-10, 10, 0],
    [-11, 10, 0],
    [0, -1, 0],
    [0, 0, 0],
    [-2147483648, -1, 2147483647],
    [-2147483648, -2147483648, 0],
    [-1, -2147483648, 2147483647],
    [-2147483648, 2147483647, 0],
    [2147483647, 2147483647, 0],
    [0, 2147483647, 2147483647],
  ];
  for (let category = 1; category <= 8; category++)
    {for (const [begin, offset, expected] of vectors)
      {expect(mailCategoryWindow(query(category, begin!, offset!))).toBe(expected);}}
  for (const category of [-2147483648, -1, 0, 9, 2147483647]) {
    expect(mailCategoryWindow(query(category))).toBeUndefined();
    expect(mailCategoryProjection("self", query(category), [], presentation())).toEqual({
      body: {},
      invalidIds: [],
    });
  }
  expect(mailCategoryProjection("self", query(1, 1, 10), [], presentation()).body).toEqual({
    result: sfs.array(),
  });
  for (const invalid of [NaN, Infinity, 0.5, 2147483648, -2147483649]) {
    expect(() => query(invalid)).toThrow();
    expect(() => query(1, invalid)).toThrow();
    expect(() => query(1, 0, invalid)).toThrow();
  }
  for (const time of [-1, 0.5, NaN, Number.MAX_SAFE_INTEGER + 1])
    {expect(() => mailCategoryQuery(1, 0, 1, time)).toThrow();}
});

test("category membership retains overlapping types, notice exceptions and filtering after the mailbox window", () => {
  const expected = [
    [2, 11, 14, 28, 29, 34],
    [13, 15, 16],
    [32],
    [20, 21, 22, 37, 38, 45, 46],
    [10, 17, 25, 26, 27, 33, 34, 35, 36],
    [5, 6, 7, 8, 9, 12, 18, 30, 42, 48],
    [23, 24, 39, 40],
    [43, 44],
  ];
  const all = Array.from({ length: 50 }, (_, type) => ({ type, title: "ordinary" }));
  for (let category = 1; category <= 8; category++) {
    expect(selectMailCategory(query(category), all).map((row) => row.type)).toEqual(
      expected[category - 1]!,
    );
    const notices = all.map((row) => ({ ...row, title: "115429" }));
    expect(selectMailCategory(query(category), notices).map((row) => row.type)).toEqual(
      category === 1 ? [] : category === 5 ? all.map((row) => row.type) : expected[category - 1]!,
    );
  }
  expect(selectMailCategory(query(5), [{ type: 100, title: "115429" }])).toHaveLength(1);
  expect(
    selectMailCategory(query(1, 0, 2), [
      { type: 13, title: "" },
      { type: 2, title: "" },
    ]),
  ).toEqual([{ type: 2, title: "" }]);
  expect(() => selectMailCategory(query(1, 0, 1), all)).toThrow();
  expect(() =>
    selectMailCategory(
      query(1, 0, 2147483647),
      Array.from({ length: 1001 }, () => all[2]!),
    ),
  ).toThrow();
  expect(() => selectMailCategory(query(0), [all[2]!])).toThrow();
});

test("sender enrichment and stored-to-client types use their distinct legacy allowlists", () => {
  const candidates = Array.from({ length: 50 }, (_, type) => ({ type, fromUser: String(type) }));
  expect(mailCategorySenders(candidates)).toEqual(
    [6, 10, 17, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 33, 34, 37, 38, 39, 40, 43, 44, 45, 46].map(
      String,
    ),
  );
  expect(
    mailCategorySenders([
      { type: 22, fromUser: "same" },
      { type: 24, fromUser: "same" },
      { type: 2, fromUser: "ignored" },
      { type: 22, fromUser: null },
      { type: 22, fromUser: "\u2000" },
      { type: 22, fromUser: "\u00a0" },
    ]),
  ).toEqual(["same", "\u00a0"]);
  const mappings = new Map([
    [7, 4],
    [10, 21],
    [12, 14],
    [14, 10],
    [21, 0],
    [22, 1],
  ]);
  for (let type = 0; type < 50; type++)
    {expect(mailClientType(type)).toBe(mappings.get(type) ?? type);}
  for (const value of [
    null,
    undefined,
    "",
    "\t\n\r\u001c \u1680\u180e\u2000\u200a\u2028\u2029\u205f\u3000",
  ])
    {expect(mailBlank(value)).toBe(true);}
  for (const value of ["\0", "\u00a0", "\u2007", "\u202f", " name "])
    {expect(mailBlank(value)).toBe(false);}
});

test("ordinary list envelopes preserve exact field widths, reward descriptors, flags and nested content", () => {
  const [message] = messages(project(1, [entry()]).body);
  expect(message).toEqual({
    uid: sfs.string("mail"),
    fromUid: sfs.string("sender"),
    title: sfs.string("title"),
    rewardId: sfs.string("items:synthetic"),
    rewardStatus: sfs.int(1),
    status: sfs.int(0),
    type: sfs.int(2),
    createTime: sfs.long(9007199254740993n),
    itemIdFlag: sfs.int(1),
    save: sfs.int(1),
    mbLevel: sfs.int(0),
    share: sfs.int(0),
    reply: sfs.int(1),
    like: sfs.int(0),
    donate: sfs.int(1),
    fromName: sfs.string("Past Name"),
    oldName: sfs.string("Past Name"),
    detail: sfs.object({ contents: sfs.string("hello\nworld") }),
  });
  for (const bits of [0, 1, 2, 4, 8, 15, -1, -2147483648]) {
    const item = messages(project(1, [entry(2, { reply: bits })]).body)[0]!;
    for (const [name, mask] of [
      ["reply", 1],
      ["share", 2],
      ["like", 4],
      ["donate", 8],
    ] as const)
      {expect(item[name]).toEqual(sfs.int((bits & mask) === mask ? 1 : 0));}
  }
  const stored =
    '{createTime:12,u:"original",contentStr:"keep",contentsArr:["keep"],n:9223372036854775807}';
  const detail = fields(
    messages(project(3, [entry(32, { contents: Buffer.from(stored) })]).body)[0]!.detail,
  );
  expect(detail).toEqual({
    createTime: sfs.int(12),
    u: sfs.string("original"),
    contentStr: sfs.string("keep"),
    contentsArr: sfs.array([sfs.string("keep")]),
    n: sfs.long(9223372036854775807n),
  });
});

test("version notices and null database flags retain their legacy defaults", () => {
  for (const fromUser of [null, "", "12.06.0"]) {
    const result = messages(
      project(2, [
        entry(16, {
          fromUser,
          title: null,
          fromName: null,
          rewardId: null,
          status: null,
          itemIdFlag: null,
          saveFlag: null,
        }),
      ]).body,
    )[0]!;
    expect(result.version).toEqual(sfs.string(fromUser ?? "1.0.59"));
    for (const key of ["title", "fromName", "oldName", "rewardId"])
      {expect(result[key]).toEqual(sfs.string(""));}
    for (const key of ["status", "itemIdFlag", "save"]) {expect(result[key]).toEqual(sfs.int(0));}
  }
  expect(messages(project(2, [entry(15)]).body)[0]!.version).toBeUndefined();
});

test("sender presentation retains name history, portrait versions and optional alliance", () => {
  const context = presentation();
  const info = { name: "Current Name", pic: "portrait", lang: "en", abbr: "TAG" };
  context.senders = new Map([["sender", info]]);
  let result = messages(project(1, [entry(28)], context).body)[0]!;
  expect(result.fromName).toEqual(sfs.string("Current Name"));
  expect(result.oldName).toEqual(sfs.string("Past Name"));
  expect(result.pic).toEqual(sfs.string("portrait"));
  expect(result.picVer).toEqual(sfs.string("0"));
  expect(result.alliance).toEqual(sfs.string("TAG"));
  expect(result.picfraId).toBeUndefined();
  context.senders = new Map([["sender", { ...info, picVer: "17", abbr: "\u2002" }]]);
  result = messages(project(1, [entry(28, { fromName: "\u2002" })], context).body)[0]!;
  expect(result.oldName).toEqual(sfs.string("Current Name"));
  expect(result.picVer).toEqual(sfs.string("17"));
  expect(result.alliance).toBeUndefined();
  result = messages(project(1, [entry(28, { fromUser: " " })], context).body)[0]!;
  expect(result.fromName).toEqual(sfs.string("Past Name"));
  expect(result.pic).toBeUndefined();
  context.senders = new Map([["sender", { ...info, pic: null }]]);
  expect(() => project(1, [entry(28)], context)).toThrow(ProtocolError);
});

test("chat categories carry content, recipient update metadata and sender identity without ordinary list fields", () => {
  for (const [category, types] of [
    [4, [20, 21, 22, 37, 38, 45, 46]],
    [7, [23, 24, 39, 40]],
  ] as const)
    {for (const type of types) {
      const result = messages(project(category, [entry(type)]).body)[0]!;
      expect(result).toEqual({
        contents: sfs.string("hello\nworld"),
        uid: sfs.string("mail"),
        type: sfs.int(mailClientType(type)),
        createTime: sfs.long(9007199254740993n),
        lastUpdateTime: sfs.string("owner-marker"),
        fromName: sfs.string("Past Name"),
        oldName: sfs.string("Past Name"),
        fromUser: sfs.string("sender"),
        status: sfs.int(0),
      });
    }}
  expect(messages(project(4, [entry(22, { fromUser: null })]).body)[0]!.fromUser).toBeUndefined();
  expect(messages(project(8, [entry(44)]).body)[0]!.detail).toEqual(
    sfs.object({ contents: sfs.string("hello\nworld") }),
  );
});

test("chat translation preserves original text and observes type, language and feature gates", () => {
  const context = presentation();
  context.translations = new Map([["mail", { originalLang: "pt", translationMsg: "translated" }]]);
  for (const [category, type] of [
    [4, 22],
    [7, 24],
  ]) {
    const message = entry(type, { translationId: "pt|stored-id" });
    let result = messages(project(category!, [message], context).body)[0]!;
    expect(result.contents).toEqual(sfs.string("hello\nworld"));
    expect(result.translationId).toEqual(sfs.string("pt|stored-id"));
    expect(result.originalLang).toEqual(sfs.string("pt"));
    expect(result.translationMsg).toEqual(sfs.string("translated"));
    result = messages(
      project(category!, [message], { ...context, translations: new Map() }).body,
    )[0]!;
    expect(result.translationId).toEqual(sfs.string("pt|stored-id"));
    expect(result.translationMsg).toBeUndefined();
    for (const suppressed of [
      { ...context, translationEnabled: false },
      { ...context, senders: new Map([["sender", { name: "name", pic: "pic", lang: null }]]) },
    ]) {
      result = messages(project(category!, [message], suppressed).body)[0]!;
      expect(result.translationId).toBeUndefined();
      expect(result.translationMsg).toBeUndefined();
    }
  }
  const malformed = messages(
    project(4, [entry(22, { translationId: "broken" })], context).body,
  )[0]!;
  expect(malformed.translationId).toEqual(sfs.string("broken"));
  expect(malformed.translationMsg).toBeUndefined();
  for (const message of [entry(21, { translationId: "pt|id" }), entry(22, { translationId: " " })])
    {expect(messages(project(4, [message], context).body)[0]!.translationMsg).toBeUndefined();}
});

test("translation requests retain legacy language aliases, case distinctions and split behavior", () => {
  const aliases: Record<string, string> = {
    cn: "zh-Hans",
    CN: "zh-Hans",
    "zh-chs": "zh-Hans",
    zh_cn: "zh-Hans",
    "zh-CN": "zh-Hans",
    tw: "zh-Hant",
    "ZH-CHT": "zh-Hant",
    zh_tw: "zh-Hant",
    id: "ms",
    IN: "ms",
    jp: "ja",
    en_gb: "en",
    fr_fr: "fr",
    it_it: "it",
    FR_FR: "en",
    EN: "en",
    PT: "en",
    pt: "pt",
    "zh-Hans": "zh-Hans",
    "zh-hans": "en",
    ko: "ko",
    unknown: "en",
    "": "en",
  };
  for (const [lang, expected] of Object.entries(aliases))
    {expect(mailTranslationRequest("|pt||id|ignored|", lang)).toEqual({
      id: "id",
      fromLang: "pt",
      toLang: expected,
    });}
  for (const id of [null, "", " ", "pt", "pt|||", "| |id", "pt|\u2000"])
    {expect(mailTranslationRequest(id, "en")).toBeUndefined();}
  expect(mailTranslationRequest("pt|id", null)).toBeUndefined();
  expect(mailTranslationRequest("pt| id ", "en")).toEqual({
    id: " id ",
    fromLang: "pt",
    toLang: "en",
  });
});

test("combat previews distinguish win, loss and draw and fail independently from valid detail", () => {
  for (const [winner, win] of [
    ["self", 0],
    ["other", 1],
    ["", 2],
    ["\u2000", 2],
  ] as const)
    {for (const npc of [false, true]) {
      const content = JSON.stringify({
        warPoint: "point",
        atkUser: { name: "attacker" },
        defUser: npc ? { npcId: "npc" } : { name: "defender" },
        winner,
        defGen: [{ skill: [], ability: [] }],
      });
      const result = messages(project(6, [entry(7, { contents: Buffer.from(content) })]).body)[0]!;
      expect(result.type).toEqual(sfs.int(4));
      expect(result.contents).toEqual(
        sfs.object({
          warPoint: sfs.string("point"),
          atkName: sfs.string("attacker"),
          ...(npc ? { npcId: sfs.string("npc") } : { defName: sfs.string("defender") }),
          win: sfs.int(win),
        }),
      );
      expect(fields(result.detail).defGen).toEqual(sfs.array([sfs.object()]));
    }}
  const missingWinner = '{warPoint:"p",atkUser:{name:"a"},defUser:{name:"d"}}';
  expect(
    fields(
      messages(project(6, [entry(7, { contents: Buffer.from(missingWinner) })]).body)[0]!.contents,
    ).win,
  ).toEqual(sfs.int(2));
  for (const contents of [
    "{}",
    '{warPoint:1,atkUser:{name:"a"},defUser:{name:"d"}}',
    '{warPoint:"p",atkUser:{name:"a"},defUser:{npcId:1}}',
  ]) {
    const projection = project(6, [entry(7, { contents: Buffer.from(contents) })]);
    expect(projection.invalidIds).toEqual([]);
    expect(messages(projection.body)[0]!.contents).toBeUndefined();
  }
});

test("malformed list content is omitted only after owned selection while capacity and encoding failures reject the plan", () => {
  const bad = entry(32, {
    uid: "bad",
    contents: Buffer.from("broken"),
    rewardStatus: 0,
    saveFlag: 1,
  });
  const good = entry(32, { uid: "good", contents: Buffer.from("{n:1}") });
  const before = structuredClone([bad, good]);
  const result = project(3, [bad, good]);
  expect(result.invalidIds).toEqual(["bad"]);
  expect(messages(result.body).map((row) => row.uid)).toEqual([sfs.string("good")]);
  expect(structuredClone([bad, good])).toEqual(before);
  expect(project(1, [bad]).invalidIds).toEqual([]);
  for (const contents of ["{[]:1}", " ".repeat(4 * 1024 * 1024 + 1) + "{}"])
    {expect(() => project(3, [bad, { ...good, contents: Buffer.from(contents) }])).toThrow();}
  expect(() => project(3, [bad, { ...good, toUser: "other" }])).toThrow();
  expect(() => project(3, [good, good])).toThrow();
  expect(() =>
    mailCategoryProjection("self", query(3), [bad], presentation(), {
      _cok_: sfs.string("x".repeat(32768)),
    }),
  ).toThrow();
  expect(() => project(3, [bad, { ...good, contents: Buffer.from("extra") }])).toThrow(
    "Missing persisted mail contents",
  );
  expect(() => project(5, [entry(100, { title: "115429" })])).toThrow();
});

test("list content reuses persisted extra bodies, scout repairs and plain-scout fallback without raw chunks", () => {
  const scout = entry(8, {
    contents: Buffer.from("extra"),
    extra: Buffer.from("{ability:[{622300:1,123:2}]}"),
  });
  const result = messages(project(6, [scout]).body)[0]!;
  expect(result.detail).toEqual(
    sfs.object({ ability: sfs.array([sfs.object({ "123": sfs.int(2) })]) }),
  );
  expect(messages(project(6, [entry(8)]).body)[0]!.detail).toEqual(
    sfs.object({ contents: sfs.string("hello\nworld") }),
  );
  expect(fields(result.detail).contentsArr).toBeUndefined();
});

test("category projection checks the transport envelope before returning malformed-row removals", () => {
  const raw = "{a:".repeat(29) + "{}" + "}".repeat(29);
  expect(() =>
    encode({
      result: sfs.array([sfs.object({ detail: sfs.object(decodeLegacyJsonObject(raw)) })]),
    }),
  ).not.toThrow();
  expect(() =>
    project(3, [
      entry(32, { uid: "bad", contents: Buffer.from("broken") }),
      entry(32, { uid: "deep", contents: Buffer.from(raw) }),
    ]),
  ).toThrow(ProtocolError);
});
