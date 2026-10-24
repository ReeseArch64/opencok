import { expect, test } from "bun:test";
import { drizzle, type NodePgClient } from "drizzle-orm/node-postgres";
import * as schema from "@opencok/drizzle/schema/kingdom";
import { readPublicProfile } from "@opencok/repositories/profile";

function database(
  options: {
    missing?: boolean;
    fail?: string;
    overflow?: string;
    taverns?: number;
    noGenerals?: boolean;
  } = {},
) {
  const queries: { text: string; params: unknown[] }[] = [];
  const rows: Record<string, unknown[][]> = {
    userprofile: [["synthetic", "Public", 5, 123, null, 2, 3, 0, "", 2]],
    playerinfo: [[1, 2, 3, 4, 5, 6, "9007199254740993", 7, 8, 9, "9223372036854775807"]],
    user_vip: [[180, "9007199254740995"]],
    user_lord: [["medal-a"]],
    user_mixed_info: [[0, 1, 1]],
    user_military_rank: [[12]],
    kingdom_position: [["216001", 2]],
    user_building: Array.from({ length: options.taverns ?? 1 }, () => [4]),
    user_general: [["general-a", "1001", 5, 1, Buffer.from('[{"600001":2}]'), 1, 3]],
    user_skill: [
      [
        "skill-a",
        "synthetic",
        "622800",
        "9007199254740993",
        "9223372036854775807",
        "9007199254740995",
        2,
        3,
        4,
      ],
    ],
    user_equip: [["equip-a", 8001, 1, "7,8", "9,10", 2, 3, "7,1|8,0"]],
    user_honor: [["medal-a", 3]],
    user_achievement: [["3"]],
    flower_ranking: [[90, 15]],
  };
  const client = {
    query: async (query: { text: string }, params: unknown[] = []) => {
      queries.push({ text: query.text, params });
      const table = query.text.match(/from "opencok_kingdom"\."([^"]+)"/)?.[1];
      if (!table) return { rows: [] };
      if (table === options.fail) throw new Error("Synthetic profile read failure");
      if (table === "userprofile" && options.missing) return { rows: [] };
      if (table === "user_general" && options.noGenerals) return { rows: [] };
      if (table === options.overflow)
        return { rows: Array.from({ length: 32768 }, () => rows[table]![0]) };
      return { rows: rows[table] ?? [] };
    },
  };
  return { db: drizzle(client as unknown as NodePgClient, { schema }), queries };
}

test("public profile persistence binds one owner throughout a repeatable read snapshot", async () => {
  const { db, queries } = database();
  const state = await readPublicProfile(db, "synthetic");
  expect(state.profile).toEqual({
    uid: "synthetic",
    name: "Public",
    level: 5,
    exp: 123,
    pic: null,
    picVer: 2,
    picfraId: 3,
    gmFlag: 0,
    allianceId: "",
    serverId: 2,
  });
  expect(state.statistics).toMatchObject({
    power: 9223372036854775807n,
    armyKill: 9007199254740993n,
  });
  expect(state.vip).toEqual({ score: 180, vipEndTime: 9007199254740995n });
  expect(state.lord).toEqual({ medal: "medal-a" });
  expect(state.mixed).toEqual({ showEquip: 0, showMedal: 1, marchSoldierShow: 1 });
  expect(state.military).toEqual({ militaryRank: 12 });
  expect(state.office).toEqual({ positionId: "216001", serverId: 2 });
  expect(state.taverns).toEqual([{ level: 4 }]);
  expect(state.generals[0]).toMatchObject({
    uuid: "general-a",
    ability: Buffer.from('[{"600001":2}]'),
    plusSkillPoint: 3,
  });
  expect(state.equipment[0]).toMatchObject({ uuid: "equip-a", on: 1, lockProperty: "7,1|8,0" });
  expect(state.skills).toEqual([
    {
      uuid: "skill-a",
      ownerId: "synthetic",
      skillId: "622800",
      startTime: 9007199254740993n,
      endTime: 9223372036854775807n,
      actTime: 9007199254740995n,
      stat: 2,
      param1: 3,
      param2: 4,
    },
  ]);
  expect(state.honors).toEqual([{ id: "medal-a", level: 3 }]);
  expect(state.completedAchievements).toBe(3);
  expect(state.flowers).toEqual({ flowerVal: 90, eggVal: 15 });
  expect(state.alliance).toBeUndefined();
  expect(queries[0]?.text).toBe("begin isolation level repeatable read read only");
  expect(queries.at(-1)?.text).toBe("commit");
  const reads = queries.slice(1, -1);
  expect(reads).toHaveLength(14);
  for (const query of reads) {
    expect(query.params[0]).toBe("synthetic");
    expect(query.text).toMatch(/where .*\."(?:uid|ownerId)" = \$1/);
    expect(query.text).not.toMatch(
      /\b(insert|update|delete)\b|deviceId|deviceUuid|email|passmd5|gold|clientRecord|mdata|userSign|"cost"|select \*/,
    );
  }
  const equipment = reads.find((query) =>
    query.text.includes('from "opencok_kingdom"."user_equip"'),
  )!;
  expect(equipment.params).toEqual(["synthetic", 1, 32768]);
  expect(equipment.text).toContain('"user_equip"."on" = $2');
  const tavern = reads.find((query) =>
    query.text.includes('from "opencok_kingdom"."user_building"'),
  )!;
  expect(tavern.params).toEqual(["synthetic", 401000, 2]);
  const skills = reads.find((query) => query.text.includes('from "opencok_kingdom"."user_skill"'))!;
  expect(skills.params).toEqual(["synthetic", 32768]);
  expect(skills.text).toContain(
    'order by "opencok_kingdom"."user_skill"."endTime" asc, "opencok_kingdom"."user_skill"."uuid" asc',
  );
  const achievements = reads.find((query) =>
    query.text.includes('from "opencok_kingdom"."user_achievement"'),
  )!;
  expect(achievements.text).toContain("count(*)");
  expect(achievements.text).toContain('"user_achievement"."state" in ($2, $3)');
  expect(achievements.params).toEqual(["synthetic", 1, 2]);
  const flowers = reads.at(-1)!;
  expect(flowers.text).toContain('select "flowerVal", "eggVal"');
  expect(flowers.text).not.toMatch(/scoreVal|hideKing/);
  expect(flowers.params).toEqual(["synthetic", 1]);
});

test("public profile snapshots skip skill reads when there are no generals", async () => {
  const { db, queries } = database({ noGenerals: true, fail: "user_skill" });
  expect((await readPublicProfile(db, "synthetic")).skills).toEqual([]);
  expect(queries.some((query) => query.text.includes('from "opencok_kingdom"."user_skill"'))).toBe(
    false,
  );
});

test("missing profiles skip all dependent reads and invalid identities never reach SQL", async () => {
  const { db, queries } = database({ missing: true });
  const state = await readPublicProfile(db, "unknown");
  expect(state.profile).toBeUndefined();
  expect(state.statistics).toBeUndefined();
  expect(state.generals).toEqual([]);
  expect(state.completedAchievements).toBe(0);
  expect(queries).toHaveLength(3);
  for (const uid of ["", " ", "a".repeat(41)]) expect(() => readPublicProfile(db, uid)).toThrow();
  expect(queries).toHaveLength(3);
});

test("dependent failures and unrepresentable arrays reject the whole public snapshot", async () => {
  for (const options of [
    { fail: "user_vip" },
    { fail: "user_achievement" },
    { fail: "user_skill" },
    { fail: "flower_ranking" },
    { taverns: 2 },
    { overflow: "user_general" },
    { overflow: "user_skill" },
    { overflow: "user_equip" },
    { overflow: "user_honor" },
  ]) {
    const { db, queries } = database(options);
    await expect(readPublicProfile(db, "synthetic")).rejects.toThrow();
    expect(queries.at(-1)?.text).toBe("rollback");
    expect(queries.some((query) => query.text === "commit")).toBe(false);
  }
});
