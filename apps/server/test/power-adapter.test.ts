import { expect, test } from "bun:test";
import { drizzle, type NodePgClient } from "drizzle-orm/node-postgres";
import * as schema from "@opencok/drizzle/schema/kingdom";
import { checkPowerStore, readPowerState } from "@opencok/repositories/power";
import { Database } from "@opencok/repositories/game";
import { generalSkillPoints, titleContractExpiries } from "@opencok/controllers/power";

const now = 1792756800000;
function database(
  options: {
    missing?: boolean;
    failure?: boolean;
    allianceId?: string;
    allianceFailure?: boolean;
  } = {},
) {
  const queries: { text: string; params: unknown[] }[] = [];
  const client = {
    query: async (query: { text: string }, params: unknown[] = []) => {
      queries.push({ text: query.text, params });
      const table = query.text.match(/from "opencok_kingdom"\."([^"]+)"/)?.[1];
      if (table === "userprofile")
        return {
          rows: options.missing
            ? []
            : [
                [
                  "synthetic",
                  5,
                  "0",
                  0,
                  "market_global",
                  options.allianceId ?? "",
                  1,
                  "9001;0;0",
                  2,
                ],
              ],
        };
      if (table === "user_army") return { rows: [["107001", 1, 2, 3, 4]] };
      if (table === "user_general") return { rows: [["1001", 5, Buffer.from('[{"600001":2}]')]] };
      if (table === "user_equip") return { rows: [[1001, 1, "487,3", 4]] };
      if (table === "user_wall") return { rows: [["108001", 5]] };
      if (table === "user_state") return { rows: [[510001, "9007199254740993", 487, 25]] };
      if (table === "user_vip") return { rows: [[250, "9007199254740993", 2]] };
      if (table === "user_civilization_prestige") return { rows: [[2, "9007199254740993"]] };
      if (table === "user_military_rank") return { rows: [["1001|1002"]] };
      if (table === "user_miracle_buff_active") return { rows: [[4]] };
      if (table === "alliance_science") {
        if (options.allianceFailure) throw new Error("Synthetic alliance read failure");
        return {
          rows: [
            [1000, 2],
            [2000, 0],
          ],
        };
      }
      if (table === "user_civilization_science") return { rows: [[2000, 3]] };
      if (table === "t_hero") return { rows: [[7001, 5, 20]] };
      if (table === "user_pet_dragon") return { rows: [[6001, 3, 5, 1]] };
      if (table === "user_pet_dragon_skill") return { rows: [[6001, 1, "8001", 3, 2]] };
      if (table === "user_knight_title")
        return { rows: [[8001, 8002, Buffer.from(`{"8002":${now + 1}}`)]] };
      if (table === "user_item") return { rows: [["talisman", 1, "9007199254740993"]] };
      if (table === "pic_upload_record") {
        if (options.failure) throw new Error("Synthetic upload read failure");
        return { rows: [["9007199254740993", "9007199254740995", 4]] };
      }
      return { rows: [] };
    },
  };
  return { db: drizzle(client as unknown as NodePgClient, { schema }), queries };
}

test("power snapshot scopes every domain to the owner, retains long values and performs no writes", async () => {
  const { db, queries } = database();
  const snapshot = await Database.prototype.power.call(
    { kingdom: { db } } as Database,
    "synthetic",
    now,
  );
  expect(snapshot.profile?.uid).toBe("synthetic");
  expect(generalSkillPoints(snapshot.generals)).toEqual([[{ id: "600001", points: 2 }]]);
  expect(snapshot.equipment).toEqual([
    { itemId: 1001, on: 1, extraProperty: "487,3", strengthLevel: 4 },
  ]);
  expect(snapshot.profile?.decomposeSuitEffect).toBe("9001;0;0");
  expect(snapshot.armies).toEqual([{ armyId: "107001", free: 1, pve: 2, defence: 3, march: 4 }]);
  expect(snapshot.walls).toEqual([{ armyId: "108001", num: 5 }]);
  expect(snapshot.civilizationSciences).toEqual([{ baseItemID: 2000, level: 3 }]);
  expect(snapshot.heroes).toEqual([{ heroid: 7001, level: 5, exp: 20 }]);
  expect(snapshot.dragons).toEqual([{ itemId: 6001, dragonState: 3, lv: 5, useFlag: 1 }]);
  expect(snapshot.dragonSkills).toEqual([
    { ownerId: 6001, index1: 1, skillId: "8001", level: 3, strengthenLevel: 2 },
  ]);
  expect(snapshot.upload).toEqual({
    updateTime: 9007199254740993n,
    banTime: 9007199254740995n,
    banCount: 4,
  });
  expect(snapshot.items[0]?.vanishTime).toBe(9007199254740993n);
  expect(Buffer.isBuffer(snapshot.knight?.contract_unlock_title)).toBe(true);
  expect(titleContractExpiries(snapshot.knight)).toEqual(new Map([["8002", BigInt(now + 1)]]));
  expect(queries[0]?.text).toBe("begin isolation level repeatable read read only");
  expect(queries.at(-1)?.text).toBe("commit");
  const selects = queries.filter((query) => query.text.startsWith("select"));
  expect(selects).toHaveLength(21);
  expect(snapshot.profile?.civilizationType).toBe(2);
  expect(snapshot.prestige).toEqual([{ civilizationType: 2, prestigeValue: 9007199254740993n }]);
  expect(snapshot.military).toEqual({ skill: "1001|1002" });
  expect(snapshot.miracle).toEqual({ level: 4 });
  expect(snapshot.vip).toEqual({ score: 250, vipEndTime: 9007199254740993n, sLevel: 2 });
  expect(snapshot.allianceSciences).toEqual([]);
  expect(snapshot.states).toEqual([
    { stateId: 510001, endTime: 9007199254740993n, ranEffId: 487, ranEffValue: 25 },
  ]);
  for (const query of selects) {
    expect(query.params[0]).toBe("synthetic");
    expect(query.text).toContain(" where ");
    expect(query.text).not.toMatch(/deviceId|deviceUuid|paidGold|passmd5|email/);
  }
  expect(queries.every((query) => !/\b(insert|update|delete)\b/i.test(query.text))).toBe(true);
  const items = selects.find((query) => query.text.includes('from "opencok_kingdom"."user_item"'))!;
  expect(items.params).toEqual(["synthetic", 0, 0n, BigInt(now)]);
  expect(items.text).toContain('"user_item"."ownerId" = $1');
  const science = selects.find((query) =>
    query.text.includes('from "opencok_kingdom"."user_civilization_science"'),
  )!;
  expect(science.text).toContain('"user_civilization_science"."userID" = $1');
  const equipment = selects.find((query) =>
    query.text.includes('from "opencok_kingdom"."user_equip"'),
  )!;
  expect(equipment.params).toEqual(["synthetic", 1]);
  const army = selects.find((query) => query.text.includes('from "opencok_kingdom"."user_army"'))!;
  expect(army.text).not.toContain('"train"');
  expect(army.text).toContain('order by "opencok_kingdom"."user_army"."armyId" asc');
});

test("missing players skip dependent reads and late failures roll back the entire snapshot", async () => {
  const missing = database({ missing: true });
  const result = await readPowerState(missing.db, "synthetic", now);
  expect(result.profile).toBeUndefined();
  expect(result.armies).toEqual([]);
  expect(missing.queries).toHaveLength(3);
  const failure = database({ failure: true });
  await expect(readPowerState(failure.db, "synthetic", now)).rejects.toThrow();
  expect(failure.queries.at(-1)?.text).toBe("rollback");
  expect(failure.queries.some((query) => query.text === "commit")).toBe(false);
});

test("alliance power reads follow the persisted membership and roll back on a late alliance failure", async () => {
  const fixture = database({ allianceId: "synthetic-alliance" });
  const snapshot = await readPowerState(fixture.db, "synthetic", now);
  expect(snapshot.allianceSciences).toEqual([
    { scienceId: 1000, level: 2 },
    { scienceId: 2000, level: 0 },
  ]);
  const query = fixture.queries.find((query) =>
    query.text.includes('from "opencok_kingdom"."alliance_science"'),
  )!;
  expect(query.params).toEqual(["synthetic-alliance"]);
  expect(query.text).toContain('"alliance_science"."allianceId" = $1');
  expect(query.text).not.toMatch(/researchstarttime|donateprogress|effectflag/);
  expect(fixture.queries.at(-1)?.text).toBe("commit");
  const blank = database({ allianceId: " " });
  expect((await readPowerState(blank.db, "synthetic", now)).allianceSciences).toEqual([]);
  expect(blank.queries.some((query) => query.text.includes('"alliance_science"'))).toBe(false);
  const failure = database({ allianceId: "synthetic-alliance", allianceFailure: true });
  await expect(readPowerState(failure.db, "synthetic", now)).rejects.toThrow();
  expect(failure.queries.at(-1)?.text).toBe("rollback");
  expect(failure.queries.some((query) => query.text === "commit")).toBe(false);
});

test("power readiness checks each required table without reading records or writing data", async () => {
  const queries: { text: string; params: unknown[] }[] = [];
  const client = {
    query: async (query: { text: string }, params: unknown[]) => {
      queries.push({ text: query.text, params });
      return { rows: [] };
    },
  };
  await checkPowerStore(drizzle(client as unknown as NodePgClient, { schema }));
  const tables = queries.map((query) => query.text.match(/from "opencok_kingdom"\."([^"]+)"/)?.[1]);
  expect(new Set(tables).size).toBe(22);
  for (const table of [
    "userprofile",
    "playerinfo",
    "user_general",
    "user_army",
    "user_wall",
    "user_building",
    "user_science",
    "user_civilization_science",
    "saga_tower_science",
    "user_equip",
    "t_hero",
    "user_pet_dragon",
    "user_pet_dragon_skill",
    "user_knight_title",
    "user_item",
    "pic_upload_record",
    "user_state",
    "user_vip",
    "alliance_science",
    "user_civilization_prestige",
    "user_military_rank",
    "user_miracle_buff_active",
  ])
    expect(tables).toContain(table);
  for (const query of queries) {
    expect(query.text.startsWith("select ")).toBe(true);
    expect(query.text).toContain(" limit $1");
    expect(query.params).toEqual([0]);
  }
  const failure = {
    query: async () => {
      throw new Error("Synthetic missing table");
    },
  };
  await expect(
    checkPowerStore(drizzle(failure as unknown as NodePgClient, { schema })),
  ).rejects.toThrow();
});
