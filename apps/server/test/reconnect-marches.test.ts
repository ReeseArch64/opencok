import { expect, test } from "bun:test";
import {
  reconnectMarchArmy,
  reconnectMarchBase,
  reconnectMarchDragon,
  reconnectMarches,
  type ReconnectMarchView,
} from "@opencok/mappings/reconnect-marches";
import { reconnectMarchGeneral } from "@opencok/hero/mappings/reconnect-march-general";
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

test("team reconnect projects arrived members through their leader and aggregates armies without disclosing unrelated marches", () => {
  const dragon = { uuid: sfs.string("dragon"), itemId: sfs.string("3001"), friendShip: sfs.int(0) };
  const general = { generalId: sfs.string("7"), userId: sfs.string("owner"), level: sfs.int(9) };
  const team = { leader: "leader", members: ["member"], createdAt: 50n };
  const view = (id: string, owner: string, type: number, state: number): ReconnectMarchView => {
    const saved = {
      ...row,
      uuid: id,
      ownerUid: owner,
      type,
      state,
      teamId: "team",
      worldId: 0,
      marchStartTime: 400n,
    };
    return {
      row: saved,
      base: reconnectMarchBase(saved, army, rules, context),
      team,
      petDragon: dragon,
      dragon,
      hasDragon: true,
      general,
      late: {},
      extras: {},
    };
  };
  const leader = view("leader", "leader-owner", 4, 0);
  const member = view("member", "owner", 5, 1);
  const snapshots = [leader, member];
  const result = reconnectMarches(snapshots, "owner", 300n);
  const own = (result.worldMarch!.value as { value: Record<string, unknown> }[])[0]!.value;
  expect(own.uuid).toEqual(sfs.string("member"));
  expect(own.ouid).toEqual(sfs.string("leader-owner"));
  expect(own.oType).toEqual(sfs.int(0));
  expect(own.sType).toEqual(sfs.int(1));
  expect(own.army).toEqual(
    sfs.array([sfs.object({ armId: sfs.int(1), total: sfs.int(40), dead: sfs.int(8) })]),
  );
  expect(own.dragonList).toEqual(sfs.array([sfs.object(dragon)]));
  expect(own.generalList).toEqual(sfs.array([sfs.object(general)]));
  const leaderResult = reconnectMarches(snapshots, "leader-owner", 300n);
  const leaderWire = (leaderResult.worldMarch!.value as { value: Record<string, unknown> }[])[0]!
    .value;
  expect(leaderWire.generalList).toEqual(
    sfs.array([sfs.object(general), sfs.object(general), sfs.object(general)]),
  );
  expect(leaderWire.dragonList).toEqual(sfs.array([sfs.object(dragon)]));
  leader.row = { ...leader.row, state: 2 };
  leader.base = reconnectMarchBase(leader.row, army, rules, context);
  const returning = reconnectMarches(snapshots, "leader-owner", 500n);
  expect(
    (returning.worldMarch!.value as { value: Record<string, unknown> }[])[0]!.value.leaderArmy,
  ).toEqual(leader.base.army);
  expect(() => reconnectMarches([member], "owner", 300n)).toThrow();
  expect(() => reconnectMarches([leader, member, member], "owner", 300n)).toThrow();
  member.row = { ...member.row, worldId: 1 };
  expect(() => reconnectMarches(snapshots, "owner", 300n)).toThrow();
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
