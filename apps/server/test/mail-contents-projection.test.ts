import { expect, test } from "bun:test";
import { decodeLegacyJsonObject, LegacyJsonError } from "@opencok/messages/legacy-json";
import { mailContentsProjection } from "@opencok/controllers/mail-contents";
import { decode, encode, fields, ProtocolError, sfs, type Value } from "@opencok/messages/sfs";
import type { MailContentsEntry } from "@opencok/contracts/mail";
import { mailContentsQuery } from "@opencok/rules/mail";

const entry = (type: number, contents: string, uid = "message"): MailContentsEntry => ({
  uid,
  type,
  contents: Buffer.from(contents),
  extra: null,
  createTime: 9007199254740993n,
});
const result = (entries: MailContentsEntry[]) =>
  (mailContentsProjection(entries).body.result!.value as Value[]).map(fields);

test("stored JSON preserves integer widths, floating lexemes and permissive legacy grammar", () => {
  const object = decodeLegacyJsonObject(
    "{small:2147483647;long:2147483648,low:-9223372036854775808,high:9223372036854775807,over:9223372036854775808,decimal:1.0,exponent:1e2,octal:010,hex:0xF,decimal09:09,plus:+1,yes:TRUE,no:False,nil:null,} trailing",
  );
  expect(object).toEqual({
    small: sfs.int(2147483647),
    long: sfs.long(2147483648n),
    low: sfs.long(-9223372036854775808n),
    high: sfs.long(9223372036854775807n),
    over: sfs.double(9223372036854775808),
    decimal: sfs.double(1),
    exponent: sfs.double(100),
    octal: sfs.int(8),
    hex: sfs.int(15),
    decimal09: sfs.int(9),
    plus: sfs.int(1),
    yes: sfs.bool(true),
    no: sfs.bool(false),
    nil: sfs.null(),
  });
  expect(decode(encode(object))).toEqual(object);
  expect(
    decodeLegacyJsonObject(
      "{'a'=>'x\\x21\\u0041\\q','b':[1;2,],class:1,declaringClass:2,metaClass:3}",
    ),
  ).toEqual({ a: sfs.string("x!Aq"), b: sfs.array([sfs.int(1), sfs.int(2)]) });
  expect(decodeLegacyJsonObject("{a:1,a:2,a:[3],b:[1],b:2}")).toEqual({
    a: sfs.array([sfs.int(1), sfs.int(2), sfs.array([sfs.int(3)])]),
    b: sfs.array([sfs.int(1), sfs.int(2)]),
  });
  expect(decodeLegacyJsonObject('{"direct":"{}","spaced": "{}","a":"null","b": "null"}')).toEqual({
    direct: sfs.string("{}"),
    spaced: sfs.object({}),
    a: sfs.string("null"),
    b: sfs.null(),
  });
  expect(decodeLegacyJsonObject("{a:bare ;}")).toEqual({ a: sfs.string("bare") });
  expect(decodeLegacyJsonObject("null")).toEqual({});
  expect(decodeLegacyJsonObject('{"__proto__":1,"constructor":2}')).toEqual({
    ["__proto__"]: sfs.int(1),
    constructor: sfs.int(2),
  });
});

test("stored JSON separates malformed content from bounded or unresolved decoding cases", () => {
  for (const input of [
    "",
    "[]",
    "{a:bare}",
    "{a:1e999}",
    "{a:'line\nbreak'}",
    "{a:'\\xGG'}",
    "{a:1",
    "{a 1}",
  ])
    expect(() => decodeLegacyJsonObject(input)).toThrow(LegacyJsonError);
  for (const input of [
    "{a:[1,,2]}",
    "{class:[1,,2],a:1}",
    "{a:function(){}}",
    '{"a":' + "[".repeat(34) + "0" + "]".repeat(34) + "}",
    '{"' + "k".repeat(256) + '":0}',
    "{a:0x1p1}",
    "{[]:0}",
    " ".repeat(4 * 1024 * 1024 + 1),
  ])
    expect(() => decodeLegacyJsonObject(input)).toThrow(ProtocolError);
});

test("mail content projection covers every type and preserves raw text, timestamp and content chunks", () => {
  const structured = new Set([5, 7, 8, 9, 10, 12, 17, 18, 25, 26, 27, 30, 31, 32, 33, 36, 42]);
  for (let type = 0; type < 50; type++) {
    const content = structured.has(type) ? '{"count":9007199254740993}' : "hello\\nworld";
    const body = result([entry(type, content)])[0]!;
    expect(body.createTime).toEqual(sfs.long(9007199254740993n));
    expect(body.u).toEqual(sfs.string("message"));
    expect(body.contentStr).toEqual(sfs.string(""));
    expect(body.contentsArr).toEqual(sfs.array([sfs.string(content)]));
    if (structured.has(type)) expect(body.count).toEqual(sfs.long(9007199254740993n));
    else expect(body.contents).toEqual(sfs.string("hello\nworld"));
    expect(decode(encode(body))).toEqual(body);
  }
  const content = "x".repeat(10001);
  expect(result([entry(2, content)])[0]!.contentsArr).toEqual(
    sfs.array([sfs.string("x".repeat(5000)), sfs.string("x".repeat(5000)), sfs.string("x")]),
  );
  expect(result([entry(2, "")])[0]!.contentsArr).toEqual(sfs.array());
  expect(result([entry(8, "old\\nscout")])[0]!.contents).toEqual(sfs.string("old\nscout"));
  expect(result([entry(2, "\0 \ttrimmed\r\n\0")])[0]!.contents).toEqual(sfs.string("trimmed"));
  expect(result([{ ...entry(2, ""), contents: Buffer.from([255]) }])[0]!.contents).toEqual(
    sfs.string(""),
  );
});

test("combat and scouting repairs retain unrelated fields and stop gracefully at malformed repair members", () => {
  const body = result([
    entry(
      7,
      JSON.stringify({
        defGen: [{ skill: 1, ability: 2, uid: "def" }],
        atkGen: [{ skill: 1, ability: 2, uid: "atk" }],
        defHelpReport: { helper: [{ army: 1 }] },
        atkHelpReport: [{ genInfo: [{ skill: 1, ability: 2, uid: "help" }] }],
        unchanged: 3,
      }),
    ),
  ])[0]!;
  expect(body.defGen).toEqual(sfs.array([sfs.object({ uid: sfs.string("def") })]));
  expect(body.atkGen).toEqual(sfs.array([sfs.object({ uid: sfs.string("atk") })]));
  expect(body.defHelpReport).toEqual(
    sfs.array([
      sfs.object({
        name: sfs.string("helper"),
        armyInfo: sfs.array([sfs.object({ army: sfs.int(1) })]),
      }),
    ]),
  );
  expect(body.atkHelpReport).toEqual(
    sfs.array([sfs.object({ genInfo: sfs.array([sfs.object({ uid: sfs.string("help") })]) })]),
  );
  expect(body.unchanged).toEqual(sfs.int(3));
  const scout = result([
    entry(8, '{"ability":[{"622300":1,"622200":2,"622100":3,"622000":4,"620700":5,"safe":6}]}'),
  ])[0]!;
  expect(scout.ability).toEqual(sfs.array([sfs.object({ safe: sfs.int(6) })]));
  const partial = result([entry(7, '{"defGen":7,"atkGen":[{"skill":1}]}')])[0]!;
  expect(partial.atkGen).toEqual(sfs.array([sfs.object({ skill: sfs.int(1) })]));
  expect(mailContentsProjection([entry(7, '{"defHelpReport":{"x":1}}')]).invalidIds).toEqual([
    "message",
  ]);
});

test("malformed structured content is removed from results but missing storage and wire limits reject the whole projection", () => {
  const projected = mailContentsProjection([entry(5, "broken", "bad"), entry(2, "plain", "good")]);
  expect(projected.invalidIds).toEqual(["bad"]);
  expect(projected.body.result!.value as Value[]).toHaveLength(1);
  expect(
    result([{ ...entry(26, "ExTrA"), extra: Buffer.from('{"inviter":"synthetic"}') }])[0]!.inviter,
  ).toEqual(sfs.string("synthetic"));
  expect(() => mailContentsProjection([entry(5, "broken"), entry(2, "extra")])).toThrow(
    "Missing persisted mail contents",
  );
  expect(() => mailContentsProjection([entry(5, "broken"), entry(2, "x".repeat(32768))])).toThrow(
    ProtocolError,
  );
  expect(() => mailContentsProjection([entry(50, "text")])).toThrow(ProtocolError);
  expect(() =>
    mailContentsProjection([entry(5, "broken")], { _cok_: sfs.string("x".repeat(32768)) }),
  ).toThrow(ProtocolError);
  expect(() =>
    mailContentsProjection([{ ...entry(2, "text"), createTime: 9223372036854775808n }]),
  ).toThrow();
});

test("content queries preserve pipe splitting and whitespace IDs while bounding the request", () => {
  expect(mailContentsQuery("|one||two|one| |", 10)).toEqual({ ids: ["one", "two", " "], now: 10 });
  for (const value of [
    "",
    "|||",
    "x".repeat(41),
    "\0",
    "\ud800",
    Array(1001).fill("x").join("|"),
    "|".repeat(65536),
  ])
    expect(() => mailContentsQuery(value, 0)).toThrow();
  for (const now of [-1, NaN, 1.5, Number.MAX_SAFE_INTEGER + 1])
    expect(() => mailContentsQuery("id", now)).toThrow();
});

test("permissive comment syntax, duplicate JSON strings and split UTF-16 boundaries preserve legacy presentation", () => {
  const slash = "/";
  const input = "{" + slash + "* note *" + slash + "a:1," + slash + slash + " note\n# note\nb:2}";
  expect(decodeLegacyJsonObject(input)).toEqual({ a: sfs.int(1), b: sfs.int(2) });
  expect(decodeLegacyJsonObject('{a:"{}",a:1,b:"null",b:1}')).toEqual({
    a: sfs.array([sfs.object({}), sfs.int(1)]),
    b: sfs.array([sfs.null(), sfs.int(1)]),
  });
  const chunks = result([entry(2, "x".repeat(4999) + "😀" + "z")])[0]!.contentsArr;
  expect(chunks).toEqual(sfs.array([sfs.string("x".repeat(4999) + "?"), sfs.string("?z")]));
  for (const raw of ["{a:1٠}", "{a:0x-1}", '{a:"\\uD800"}', "{1.0:1}"])
    expect(() => decodeLegacyJsonObject(raw)).toThrow(ProtocolError);
});
