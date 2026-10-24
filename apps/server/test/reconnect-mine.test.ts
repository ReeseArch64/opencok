import { expect, test } from "bun:test";
import { Rules, type Rule } from "@opencok/rules/game";
import { friendshipMineView, initialFriendshipMine } from "@opencok/rules/reconnect-mine";
import { reconnectFriendshipMine } from "@opencok/controllers/reconnect";
import { reconnectMine } from "@opencok/mappings/reconnect";
import { decode, encode, sfs } from "@opencok/messages/sfs";
import type { Row } from "@opencok/contracts/rows";

function rules(
  treasures = new Map<string, Rule>([
    ["8103", { id: "8103", lv: "4", exp: "25", helper: "6" }],
    ["8100", { id: "8100", lv: "1", exp: "3", helper: "2" }],
    ["9100", { id: "9100", lv: "1", exp: "4", helper: "3" }],
  ]),
) {
  return new Rules(
    new Map(),
    new Map(),
    new Map(),
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    2,
    undefined,
    undefined,
    undefined,
    undefined,
    { treasures },
  );
}

test("friendship mine initialization chooses the first exact level-one record and validates its presentation", () => {
  const catalog = rules();
  const initial = initialFriendshipMine(catalog);
  expect(initial).toEqual({ itemId: 8100, level: 1, exp: 0, miner: 0, mineTime: 0n, call: 0 });
  expect(decode(encode(reconnectMine(friendshipMineView({ ...initial }, catalog))))).toEqual({
    mine: sfs.object({
      itemId: sfs.int(8100),
      level: sfs.int(1),
      exp: sfs.int(0),
      miner: sfs.int(0),
      mineTime: sfs.long(0),
      call: sfs.int(0),
      xml_exp: sfs.int(3),
      xml_miner: sfs.int(2),
    }),
  });
  catalog.reconnect.treasures!.get("8100")!.lv = "01";
  expect(initialFriendshipMine(catalog).itemId).toBe(9100);
  catalog.reconnect.treasures!.delete("9100");
  expect(() => initialFriendshipMine(catalog)).toThrow("102192");
  for (const key of ["id", "exp", "helper"]) {
    const malformed = rules();
    malformed.reconnect.treasures!.get("8100")![key] = "2147483648";
    expect(() => initialFriendshipMine(malformed)).toThrow("102192");
  }
});

test("persisted friendship mine retains progress and resolves level offsets without exposing bindings or rewards", () => {
  const mine = Object.freeze({
    itemId: 8100,
    level: 4,
    exp: 21,
    miner: 5,
    mineTime: 9007199254740993n,
    call: 1,
    uid: "synthetic-owner",
    fId: "synthetic-binding",
    helpInfo: Buffer.from("synthetic-private-history"),
    gold: 999,
  });
  const view = friendshipMineView(mine, rules());
  expect(view).toEqual({
    itemId: 8100,
    level: 4,
    exp: 21,
    miner: 5,
    mineTime: 9007199254740993n,
    call: 1,
    requiredExp: 25,
    maxMiners: 6,
  });
  expect(decode(encode(reconnectMine(view)))).toEqual({
    mine: sfs.object({
      itemId: sfs.int(8100),
      level: sfs.int(4),
      exp: sfs.int(21),
      miner: sfs.int(5),
      mineTime: sfs.long(9007199254740993n),
      call: sfs.int(1),
      xml_exp: sfs.int(25),
      xml_miner: sfs.int(6),
    }),
  });
  expect(
    friendshipMineView({ itemId: 8100, level: 1, exp: null, mineTime: null }, rules()),
  ).toMatchObject({ exp: 0, miner: 0, mineTime: 0n, call: 0 });
});

test("mine rule offsets preserve Java signed arithmetic and reject malformed inputs", () => {
  const catalog = rules(new Map([["-2147483648", { exp: "-1", helper: "2147483647" }]]));
  expect(
    friendshipMineView(
      {
        itemId: 2147483647,
        level: 2,
        exp: -1,
        miner: -2,
        mineTime: -9223372036854775808n,
        call: -1,
      },
      catalog,
    ),
  ).toEqual({
    itemId: 2147483647,
    level: 2,
    exp: -1,
    miner: -2,
    mineTime: -9223372036854775808n,
    call: -1,
    requiredExp: -1,
    maxMiners: 2147483647,
  });
  for (const key of ["itemId", "level", "exp", "miner", "call"])
    for (const value of [1.5, 2147483648, -2147483649, "1e3", "bad"])
      expect(() => friendshipMineView({ itemId: 8100, level: 1, [key]: value }, rules())).toThrow(
        "102192",
      );
  for (const value of [9007199254740992, "9223372036854775808", "-9223372036854775809", "1.5"])
    expect(() =>
      friendshipMineView({ itemId: 8100, level: 1, mineTime: value }, rules()),
    ).toThrow();
  expect(() => friendshipMineView({ itemId: 8100, level: 5 }, rules())).toThrow();
  expect(() => initialFriendshipMine(rules(new Map()))).toThrow();
});

test("reconnect mine use case initializes lazily and never substitutes defaults after store failures", async () => {
  const catalog = rules();
  const calls: string[] = [];
  const fresh = await reconnectFriendshipMine(
    {
      async friendshipMine(uid, initial) {
        calls.push(uid);
        return { ...initial() };
      },
    },
    "synthetic",
    catalog,
  );
  expect(calls).toEqual(["synthetic"]);
  expect(fresh).toEqual(
    reconnectMine(friendshipMineView({ ...initialFriendshipMine(catalog) }, catalog)),
  );
  catalog.reconnect.treasures!.delete("8100");
  catalog.reconnect.treasures!.delete("9100");
  const existing: Row = { itemId: 8100, level: 4, mineTime: 123n };
  expect(
    await reconnectFriendshipMine(
      {
        async friendshipMine() {
          return existing;
        },
      },
      "synthetic",
      catalog,
    ),
  ).toEqual(reconnectMine(friendshipMineView(existing, catalog)));
  await expect(
    reconnectFriendshipMine(
      {
        async friendshipMine() {
          throw new Error("Synthetic failure");
        },
      },
      "synthetic",
      catalog,
    ),
  ).rejects.toThrow("Synthetic failure");
  for (const uid of ["", " ", "x".repeat(41)])
    await expect(
      reconnectFriendshipMine(
        {
          async friendshipMine() {
            throw new Error("Store must not be called");
          },
        },
        uid,
        catalog,
      ),
    ).rejects.toThrow("102192");
});
