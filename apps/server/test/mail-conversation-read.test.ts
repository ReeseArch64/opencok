import { expect, test } from "bun:test";
import { mailConversationReadRequest } from "@opencok/services/mail-conversation-read";
import { mailConversationReadQuery } from "@opencok/rules/mail-conversation-read";
import { mailServerType } from "@opencok/rules/mail";
import { sfs, type Fields } from "@opencok/messages/sfs";
import oracle from "./fixtures/mail-read-integers.json";

const now = 1792756800000;
const query = (input: Parameters<typeof mailConversationReadQuery>[0] = {}) =>
  mailConversationReadQuery(input, now);
const mail = (type: number) => ({ kind: "mail" as const, types: [type], unreadOnly: true });

test("conversation read plans preserve sender and moderator precedence and ordered chat effects", () => {
  expect(
    query({ fromUser: "sender", mod: 1, driftingBottle: 1, type: 14, types: "0,1,20" }),
  ).toEqual({
    now,
    effects: [
      { kind: "mail", fromUser: "sender", types: [23, 24], unreadOnly: true },
      { kind: "chat", others: "sender", types: ["2"] },
      mail(21),
      mail(22),
      mail(20),
      { kind: "chat", others: "", types: ["1", "20"] },
    ],
  });
  for (const mod of [undefined, 0, 2, -1, -2147483648, 2147483647])
    {for (const driftingBottle of [undefined, 0, 1, -1, 2]) {
      const bottle = driftingBottle === 1;
      expect(query({ fromUser: "sender", mod, driftingBottle, type: 7 }).effects).toEqual([
        {
          kind: "mail",
          fromUser: "sender",
          types: bottle ? [43, 44] : [20, 21, 22],
          unreadOnly: !bottle,
        },
        { kind: "chat", others: "sender", types: bottle ? ["3"] : ["1", "20"] },
      ]);
    }}
});

test("null, empty, blank and comma-containing senders retain distinct mailbox and chat values", () => {
  for (const sender of [null, "", " ", "\u180e", "\u00a0", " sender ", "one,two", ","]) {
    const plan = query({ fromUser: sender });
    expect(plan.effects).toEqual([
      { kind: "mail", fromUser: sender, types: [20, 21, 22], unreadOnly: true },
      { kind: "chat", others: sender === null ? "null" : sender, types: ["1", "20"] },
    ]);
  }
  expect(query()).toEqual({ now, effects: [] });
  expect(query({ types: "" }).effects).toEqual([]);
  expect(query({ types: ",,," }).effects).toEqual([]);
});

test("type lists retain duplicates and only the exact raw list emits the all-peer chat notification", () => {
  expect(query({ type: 21, types: ",4,,14,4," }).effects).toEqual([
    mail(10),
    mail(7),
    mail(12),
    mail(7),
  ]);
  for (const types of ["0,1,20", ",0,1,20,", "0,,1,20", "+0,1,20", "00,01,020", "０,１,２０"]) {
    const expected = [mail(21), mail(22), mail(20)];
    const effects = query({ types }).effects;
    expect(effects.slice(0, 3)).toEqual(expected);
    expect(effects.slice(3)).toEqual(
      types === "0,1,20" ? [{ kind: "chat", others: "", types: ["1", "20"] }] : [],
    );
  }
  expect(query({ types: "20,1,0" }).effects).toEqual([mail(20), mail(22), mail(21)]);
  expect(query({ type: 0, types: "0,1,20" }).effects).toHaveLength(5);
});

test("all client type mappings and signed unknown values remain exact for scalar and list selectors", () => {
  const mappings = new Map([
    [0, 21],
    [1, 22],
    [4, 7],
    [10, 14],
    [14, 12],
    [21, 10],
  ]);
  for (const type of [-2147483648, -1, ...Array.from({ length: 51 }, (_, i) => i), 2147483647]) {
    const stored = mappings.get(type) ?? type;
    expect(mailServerType(type)).toBe(stored);
    expect(query({ type }).effects).toEqual([mail(stored)]);
    expect(query({ types: String(type) }).effects).toEqual([mail(stored)]);
  }
  expect(query({ types: "010" }).effects).toEqual([mail(14)]);
});

test("comma-list decimal parsing matches 410 frozen synthetic Java 8 vectors without a Java runtime", () => {
  const mappings = new Map([
    [0, 21],
    [1, 22],
    [4, 7],
    [10, 14],
    [14, 12],
    [21, 10],
  ]);
  expect(oracle.vectors).toHaveLength(410);
  for (const { input, value } of oracle.vectors) {
    if (input === "") {expect(query({ types: input }).effects).toEqual([]);}
    else if (value === null) {expect(() => query({ types: input }), JSON.stringify(input)).toThrow();}
    else
      {expect(query({ types: input }).effects, JSON.stringify(input)).toEqual([
        mail(mappings.get(value) ?? value),
      ]);}
  }
  for (const types of [
    "1, 2",
    "1,2 ",
    "1,\n2",
    "0,1,20,bad",
    "0,1,20,2147483648",
    "0x10",
    "1e1",
    "1.0",
    "--1",
    "+-1",
  ])
    {expect(() => query({ fromUser: "sender", types })).toThrow();}
});

test("operation-plan bounds reject unsafe consumed fields without constraining ignored selectors", () => {
  const invalid = [NaN, Infinity, 1.5, -2147483649, 2147483648, null as never];
  for (const value of invalid) {
    expect(() => query({ mod: value })).toThrow();
    expect(() => query({ type: value })).toThrow();
    expect(() => query({ fromUser: "sender", driftingBottle: value })).toThrow();
    expect(() => query({ fromUser: "sender", type: value })).not.toThrow();
    expect(() => query({ fromUser: "sender", mod: 1, driftingBottle: value })).not.toThrow();
    expect(() => query({ driftingBottle: value })).not.toThrow();
  }
  for (const fromUser of ["x".repeat(41), "\0", "\ud800", "😀".repeat(21)])
    {expect(() => query({ fromUser })).toThrow();}
  expect(query({ fromUser: "😀".repeat(20) }).effects).toHaveLength(2);
  for (const clock of [-1, 0.5, NaN, Number.MAX_SAFE_INTEGER + 1])
    {expect(() => mailConversationReadQuery({}, clock)).toThrow();}
  expect(mailConversationReadQuery({}, 0)).toEqual({ now: 0, effects: [] });
  expect(query({ types: ",".repeat(65535) }).effects).toEqual([]);
  expect(() => query({ types: ",".repeat(65536) })).toThrow();
  expect(query({ types: Array(1000).fill("-2147483648").join(",") }).effects).toHaveLength(1000);
  expect(() => query({ types: Array(1001).fill("1").join(",") })).toThrow();
  expect(() => query({ types: null as never })).toThrow();
});

test("wire parsing consumes only the legacy branch fields while retaining the separate types list", () => {
  expect(
    mailConversationReadRequest(
      {
        fromUser: sfs.string("sender"),
        mod: sfs.int(1),
        type: sfs.string("ignored"),
        driftingBottle: sfs.string("ignored"),
        types: sfs.string("0,1,20"),
      },
      now,
    ),
  ).toEqual(query({ fromUser: "sender", mod: 1, types: "0,1,20" }));
  expect(
    mailConversationReadRequest({ type: sfs.int(14), driftingBottle: sfs.string("ignored") }, now),
  ).toEqual(query({ type: 14 }));
  expect(
    mailConversationReadRequest({ fromUser: sfs.null(), type: sfs.string("ignored") }, now),
  ).toEqual(query({ fromUser: null }));
  expect(mailConversationReadRequest({ driftingBottle: sfs.string("ignored") }, now)).toEqual(
    query(),
  );
  const input = {
    fromUser: sfs.string(" sender "),
    driftingBottle: sfs.int(1),
    types: sfs.string("1,,4"),
    toUser: sfs.string("forged"),
    serverId: sfs.int(2),
  };
  const before = structuredClone(input);
  expect(mailConversationReadRequest(input, now)).toEqual(
    query({ fromUser: " sender ", driftingBottle: 1, types: "1,,4" }),
  );
  expect(input).toEqual(before);
});

test("wire parsing rejects invalid consumed widths and fabricated value shapes before returning a plan", () => {
  const invalid: Fields[] = [
    { mod: sfs.null() },
    { mod: sfs.long(1) },
    { mod: sfs.string("1") },
    { fromUser: sfs.int(1) },
    { fromUser: sfs.string(undefined as never) },
    { type: sfs.null() },
    { type: sfs.long(1) },
    { type: sfs.string("1") },
    { types: sfs.null() },
    { types: sfs.int(1) },
    { types: sfs.string(undefined as never) },
    { fromUser: sfs.string("sender"), driftingBottle: sfs.string("1") },
    { fromUser: sfs.string("sender"), driftingBottle: sfs.null() },
    { fromUser: sfs.string("sender"), types: sfs.string("0,1,20,broken") },
  ];
  for (const value of [NaN, Infinity, 0.5, -2147483649, 2147483648, undefined as never])
    {invalid.push(
      { mod: sfs.int(value) },
      { type: sfs.int(value) },
      { fromUser: sfs.string("sender"), driftingBottle: sfs.int(value) },
    );}
  for (const params of invalid) {expect(() => mailConversationReadRequest(params, now)).toThrow();}
});
