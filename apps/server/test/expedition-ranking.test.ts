import { expect, test } from "bun:test";
import { decodeExpeditionRanking } from "@opencok/controllers/expedition-ranking";
import { selectExpeditionRanking, expeditionRankingLimit } from "@opencok/rules/expedition-ranking";
import { expeditionRanking } from "@opencok/mappings/expedition-ranking";
import type { ExpeditionRankingEntry } from "@opencok/contracts/expedition-ranking";
import { Rules } from "@opencok/rules/game";
import { decode, encode, sfs } from "@opencok/messages/sfs";

const info =
  '{"name":"Name","pic":"portrait","picVer":2,"abbr":"A","serverId":2,"power":9007199254740993,"uid":"forged","rank":99,"gold":999,"email":"private"}';
function project(entries: ExpeditionRankingEntry[] | undefined, uid = "self") {
  return expeditionRanking(selectExpeditionRanking(uid, 4, decodeExpeditionRanking(entries)));
}

test("expedition missing pairing and empty scores differ from a populated board without presentation metadata", () => {
  expect(project(undefined)).toEqual({});
  expect(project([])).toEqual({});
  expect(
    project([
      { uid: "self", score: 1, info: null },
      { uid: "other", score: 0, info: " " },
    ]),
  ).toEqual({
    selfRanking: sfs.int(-1),
    serverRanking: sfs.array([]),
  });
});

test("expedition preserves source tie order and renumbers visible entries after missing metadata", () => {
  const result = project([
    { uid: "missing", score: 9, info: null },
    { uid: "z", score: 2.9, info },
    { uid: "self", score: 2.9, info },
  ]);
  expect(decode(encode(result))).toEqual({
    selfRanking: sfs.int(2),
    serverRanking: sfs.array(
      ["z", "self"].map((uid, index) =>
        sfs.object({
          uid: sfs.string(uid),
          rank: sfs.int(index + 1),
          score: sfs.int(2),
          name: sfs.string("Name"),
          pic: sfs.string("portrait"),
          picVer: sfs.int(2),
          abbr: sfs.string("A"),
          serverId: sfs.int(2),
          power: sfs.long(9007199254740993n),
        }),
      ),
    ),
  });
  expect(project([{ uid: "other", score: 1, info }]).selfRanking).toEqual(sfs.int(-1));
});

test("expedition score flooring saturates at Java int bounds and cached power retains integer or long widths", () => {
  for (const [score, expected] of [
    [-1.2, -2],
    [0, 0],
    [2147483647.9, 2147483647],
    [2147483648, 2147483647],
    [-2147483649, -2147483648],
    [Infinity, 2147483647],
    [-Infinity, -2147483648],
  ]) {
    const result = selectExpeditionRanking(
      "self",
      1,
      decodeExpeditionRanking([{ uid: "self", score: score!, info }]),
    )!;
    expect(result.rows[0]?.score).toBe(expected!);
  }
  for (const power of [
    "-2147483649",
    "-2147483648",
    "2147483647",
    "2147483648",
    "9223372036854775807",
  ]) {
    const result = project([
      { uid: "self", score: 1, info: info.replace("9007199254740993", power) },
    ]);
    const decoded = decode(encode(result));
    const value = BigInt(power);
    const expected = BigInt.asIntN(32, value) === value ? sfs.int(Number(value)) : sfs.long(value);
    expect(decoded.serverRanking).toEqual(
      sfs.array([
        sfs.object({
          uid: sfs.string("self"),
          rank: sfs.int(1),
          score: sfs.int(1),
          name: sfs.string("Name"),
          pic: sfs.string("portrait"),
          picVer: sfs.int(2),
          abbr: sfs.string("A"),
          serverId: sfs.int(2),
          power: expected,
        }),
      ]),
    );
  }
});

test("expedition malformed public metadata, duplicate entries and unrepresentable limits fail closed", () => {
  for (const raw of [
    "{",
    "[]",
    "null",
    "{}",
    info.replace('"name":"Name"', '"name":null'),
    info.replace("9007199254740993", "9007199254740993.0"),
    info.replace("9007199254740993", "9223372036854775808"),
    info.replace('"picVer":2', '"picVer":2147483648'),
    "x".repeat(65536),
    " ".repeat(65536),
  ])
    expect(() => project([{ uid: "self", score: 1, info: raw }])).toThrow();
  expect(() => project([{ uid: "self", score: NaN, info }])).toThrow();
  expect(() =>
    project([
      { uid: "self", score: 1, info },
      { uid: "self", score: 1, info },
    ]),
  ).toThrow();
  expect(() =>
    project(Array.from({ length: 5 }, (_, i) => ({ uid: String(i), score: 1, info }))),
  ).toThrow();
  for (const k2 of ["0", "-1", "32768", " 2", "2.5", ""])
    expect(() =>
      expeditionRankingLimit(
        new Rules(new Map(), new Map(), new Map(), undefined, new Map([["ranking", { k2 }]])),
      ),
    ).toThrow();
  expect(
    expeditionRankingLimit(
      new Rules(
        new Map(),
        new Map(),
        new Map(),
        undefined,
        new Map([["ranking", { k2: "32767" }]]),
      ),
    ),
  ).toBe(32767);
});
