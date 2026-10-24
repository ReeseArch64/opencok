import { expect, test } from "bun:test";
import { reconnectArmies, reconnectArmy, reconnectBalances } from "@opencok/dtos/reconnect";
import { decode, encode, sfs } from "@opencok/messages/sfs";
import type { Row } from "@opencok/contracts/rows";

test("reconnect balances preserve all seven long fields without disclosing other profile data", () => {
  const profile = Object.freeze({
    uid: "synthetic-owner",
    gold: 9007199254740993n,
    paidGold: 8n,
    paidSpecialGold: 2n,
    dmmGold: 9007199254740995n,
    dmmPaidGold: 11n,
    dmmPaidSpecialGold: 17n,
    level: 40,
    email: "synthetic@example.invalid",
    crystalGold: 999n,
  });
  expect(decode(encode(reconnectBalances(profile)))).toEqual({
    gold: sfs.long(9007199254741003n),
    freeGold: sfs.long(9007199254740993n),
    paidGold: sfs.long(8n),
    paidSpecialGold: sfs.long(2n),
    dmmGold: sfs.long(9007199254740995n),
    dmmPaidGold: sfs.long(11n),
    dmmPaidSpecialGold: sfs.long(17n),
  });
});

test("reconnect currency arithmetic wraps signed longs and preserves nullable primitive defaults", () => {
  for (const [gold, paidGold, paidSpecialGold, expected] of [
    [9223372036854775807n, 1n, 0n, -9223372036854775808n],
    [-9223372036854775808n, -1n, 0n, 9223372036854775807n],
    [9223372036854775807n, 9223372036854775807n, 3n, 1n],
    [-100n, 70n, 20n, -10n],
  ]) {
    const result = decode(
      encode(
        reconnectBalances({ gold: gold!, paidGold: paidGold!, paidSpecialGold: paidSpecialGold! }),
      ),
    );
    expect(result.gold).toEqual(sfs.long(expected!));
    expect(result.freeGold).toEqual(sfs.long(gold!));
  }
  const empty = reconnectBalances({ paidSpecialGold: null, dmmPaidSpecialGold: null });
  expect(Object.keys(empty)).toHaveLength(7);
  expect(Object.values(empty)).toEqual(Array.from({ length: 7 }, () => sfs.long(0n)));
});

test("reconnect rejects malformed currency inputs before serialization", () => {
  for (const key of [
    "gold",
    "paidGold",
    "paidSpecialGold",
    "dmmGold",
    "dmmPaidGold",
    "dmmPaidSpecialGold",
  ])
    for (const value of [
      9007199254740992,
      1.5,
      NaN,
      Infinity,
      "9223372036854775808",
      "-9223372036854775809",
      "",
      "1.0",
      "1e3",
      "secret-invalid-value",
    ])
      expect(() => reconnectBalances({ [key]: value })).toThrow("102192");
});

test("reconnect army uses persisted fields without needing static army rules", () => {
  const army = Object.freeze({
    armyId: "synthetic-army",
    free: 2147483647,
    march: 12,
    level: 5,
    train: 0,
    finishTime: "ignored",
    uid: "private-owner",
    pve: 7,
    defence: 9,
    foodCostTime: 42n,
    attack: 100,
  });
  expect(decode(encode(reconnectArmy(army)))).toEqual({
    id: sfs.string("synthetic-army"),
    free: sfs.int(2147483647),
    march: sfs.int(12),
    level: sfs.int(5),
  });
  for (const train of [1, -1, 2147483647])
    expect(
      decode(encode(reconnectArmy({ ...army, train, finishTime: 9007199254740993n }))),
    ).toEqual({
      id: sfs.string("synthetic-army"),
      free: sfs.int(2147483647),
      march: sfs.int(12),
      level: sfs.int(5),
      train: sfs.int(train),
      finish: sfs.long(9007199254740993n),
    });
  expect(reconnectArmy({ armyId: "zero", train: null })).toEqual({
    id: sfs.string("zero"),
    free: sfs.int(0),
    march: sfs.int(0),
    level: sfs.int(0),
  });
});

test("reconnect armies preserve supplied order and reject ambiguous or unrepresentable state", () => {
  const rows = Object.freeze([
    Object.freeze({ armyId: "b", free: 3 }),
    Object.freeze({ armyId: "a", free: -2 }),
  ]);
  expect(decode(encode(reconnectArmies(rows)))).toEqual({
    army: sfs.array(rows.map((row) => sfs.object(reconnectArmy(row)))),
  });
  expect(reconnectArmies([])).toEqual({ army: sfs.array() });
  expect(() => reconnectArmies([{ armyId: "a" }, { armyId: "a" }])).toThrow();
  expect(() =>
    reconnectArmies(Array.from({ length: 32768 }, (_, i) => ({ armyId: String(i) }))),
  ).toThrow();
  const invalid: Row[] = [
    {},
    { armyId: "" },
    { armyId: 1 },
    { armyId: "a".repeat(21) },
    ...["free", "march", "level", "train"].flatMap((key) =>
      [2147483648, -2147483649, 1.5, "malformed"].map((value) => ({ armyId: "a", [key]: value })),
    ),
    { armyId: "a", train: 1, finishTime: "9223372036854775808" },
  ];
  for (const row of invalid) expect(() => reconnectArmy(row)).toThrow();
});
