import { expect, test } from "bun:test";
import {
  reconnectMarchArmy,
  reconnectMarchBase,
  reconnectMarchDragon,
  reconnectMarchGeneral,
} from "@opencok/dtos/reconnect-marches";
import { decodeWorldMarchArmy } from "@opencok/messages/world-resource-army";
import { sfs, decode, encode, Type } from "@opencok/messages/sfs";
import { Rules } from "@opencok/rules/game";
import fixture from "./fixtures/reconnect-march-army.json";

const rules = new Rules(new Map(), new Map(), new Map());
rules.arms.set("100001", { arm: "1", new_arms: "1" });
const army = decodeWorldMarchArmy(Buffer.from(fixture.companions, "base64"))!;
const row = {
  uuid: "march",
  ownerUid: "owner",
  ownerName: null,
  type: 0,
  state: 0,
  ownerId: 5,
  targetId: 8,
  marchStartTime: 100n,
  marchArrivalTime: 200n,
  arrivalTime: 300n,
  returnStartTime: 150n,
  territoryStartTime: 9007199254740993n,
  territoryUpdateTime: 9007199254740995n,
  territoryStat: 2,
};
const context = {
  serverId: 3,
  miracle: false,
  miracleState: undefined,
  resourceBattle: false,
  siege: false,
};

test("march companions use current dragon levels and saved general levels with unexpired active skills", () => {
  const catalog = new Rules(new Map(), new Map(), new Map());
  catalog.power.dragonLevels = new Map([["7004", { id: "7004", base_id: "3001", level: "4" }]]);
  const dragon = reconnectMarchDragon(
    { uid: "owner", uuid: "dragon", itemId: 3001, lv: 4, friendly: 42, nickName: "" },
    catalog,
  );
  expect(decode(encode(dragon))).toEqual({
    userId: sfs.string("owner"),
    uuid: sfs.string("dragon"),
    itemId: sfs.string("7004"),
    friendShip: sfs.int(42),
    nickName: sfs.string(""),
  });
  expect(reconnectMarchDragon(undefined, catalog)).toEqual({
    uuid: sfs.string(""),
    itemId: sfs.string(""),
    friendShip: sfs.int(0),
  });
  expect(() => reconnectMarchDragon({ itemId: 999, lv: 1 }, catalog)).toThrow();
  const general = { owner: "owner", id: 7, level: 9 };
  const skill = { uid: "owner", newGeneralId: 7, stat: 3, actTime: 100n };
  expect(
    decode(
      encode(
        reconnectMarchGeneral(
          general,
          [
            { ...skill, skillId: "active" },
            { ...skill, skillId: "expired", actTime: 99n },
            { ...skill, skillId: "other", uid: "other" },
            { ...skill, skillId: "idle", stat: 0 },
          ],
          100n,
        ),
      ),
    ),
  ).toEqual({
    userId: sfs.string("owner"),
    generalId: sfs.string("7"),
    level: sfs.int(9),
    skillList: { type: Type.StringArray, value: ["active"] },
  });
  expect(reconnectMarchGeneral(general, [], 100n)).not.toHaveProperty("skillList");
});

test("march armies aggregate saved families and knight counts without replacing saved troop totals", () => {
  expect(reconnectMarchArmy(army, rules)).toEqual([
    sfs.object({
      armId: sfs.int(1),
      total: sfs.int(20),
      dead: sfs.int(4),
      knight_total: sfs.int(20),
      knight_dead: sfs.int(4),
    }),
  ]);
  const saved = {
    ...army,
    soldiers: army.soldiers!.map((soldier) => ({ ...soldier, basicArm: null })),
  };
  expect(reconnectMarchArmy(saved, rules)).toEqual([
    sfs.object({
      armId: sfs.int(0),
      total: sfs.int(20),
      dead: sfs.int(4),
      knight_total: sfs.int(20),
      knight_dead: sfs.int(4),
    }),
  ]);
  expect(reconnectMarchArmy(null, rules)).toEqual([]);
  expect(() => reconnectMarchArmy({ ...army, soldiers: null }, rules)).toThrow();
});

test("march direction and long deadlines match outgoing, occupied and early return states", () => {
  const outgoing = decode(encode(reconnectMarchBase(row, army, rules, context)));
  expect(outgoing.st).toEqual(sfs.long(100n));
  expect(outgoing.et).toEqual(sfs.long(300n));
  expect(outgoing.o).toEqual(sfs.string(""));
  expect(outgoing.territoryStartTime).toEqual(sfs.long(9007199254740993n));
  const occupied = reconnectMarchBase({ ...row, state: 1 }, army, rules, context);
  expect(occupied.st).toEqual(sfs.long(0n));
  expect(occupied.et).toEqual(sfs.long(0n));
  const returning = reconnectMarchBase({ ...row, state: 2 }, army, rules, context);
  expect(returning.st).toEqual(sfs.long(100n));
  expect(returning.sp).toEqual(sfs.int(8));
  expect(returning.dp).toEqual(sfs.int(5));
  expect(returning.et).toEqual(sfs.long(300n));
  expect(reconnectMarchBase({ ...row, state: 2 }, null, rules, context).et).toEqual(sfs.long(0n));
  expect(
    reconnectMarchBase({ ...row, state: 2 }, army, rules, { ...context, siege: true }).et,
  ).toEqual(sfs.long(0n));
  const empty = { ...army, soldiers: [] };
  for (const type of [1, 3, 9, 10, 12, 13, 17])
    expect(reconnectMarchBase({ ...row, state: 2, type }, empty, rules, context).et).toEqual(
      sfs.long(300n),
    );
  expect(row.arrivalTime).toBe(300n);
  expect(() => reconnectMarchBase({ ...row, state: 3 }, army, rules, context)).toThrow();
});

test("march miracle, siege and loot projections preserve conditional field presence", () => {
  const absent = reconnectMarchBase(row, army, rules, { ...context, miracle: true });
  expect(absent).not.toHaveProperty("territoryStartTime");
  const present = reconnectMarchBase(row, army, rules, {
    ...context,
    miracle: true,
    miracleState: { starttime: 1n, updatetime: 2n, state: 3 },
  });
  expect(present.territoryStartTime).toEqual(sfs.long(1n));
  expect(present.territoryUpdateTime).toEqual(sfs.long(2n));
  expect(present.territoryStat).toEqual(sfs.int(3));
  const loot = reconnectMarchBase(
    { ...row, plunderRes: "", retrieveRes: "present" },
    army,
    rules,
    context,
  );
  expect(loot.plunderRes).toEqual(sfs.string(""));
  expect(loot).not.toHaveProperty("retrieveRes");
  const siege = reconnectMarchBase(
    { ...row, monsterArmyCount: 12, monsterLevel: 4, blackLandMarchTime: "bad" },
    army,
    rules,
    { ...context, siege: true },
  );
  expect(siege.monsterCount).toEqual(sfs.int(12));
  expect(siege.monsterLevel).toEqual(sfs.int(4));
  expect(siege).not.toHaveProperty("mt2");
});
