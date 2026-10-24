import { expect, test } from "bun:test";
import { drizzle, type NodePgClient } from "drizzle-orm/node-postgres";
import * as schema from "@opencok/drizzle/schema/kingdom";
import { readPowerState } from "@opencok/repositories/power";
import { titleContractExpiries } from "@opencok/controllers/power";

const now = 1792756800000;
function database(options: { missing?: boolean; failure?: boolean } = {}) {
  const queries: { text: string; params: unknown[] }[] = [];
  const client = {
    query: async (query: { text: string }, params: unknown[] = []) => {
      queries.push({ text: query.text, params });
      const table = query.text.match(/from "opencok_kingdom"\."([^"]+)"/)?.[1];
      if (table === "userprofile")
        return { rows: options.missing ? [] : [["synthetic", 5, "0", 0, "market_global", "", 1]] };
      if (table === "user_army") return { rows: [["107001", 1, 2, 3, 4]] };
      if (table === "user_wall") return { rows: [["108001", 5]] };
      if (table === "user_state") return { rows: [[510001, "9007199254740993", 487, 25]] };
      if (table === "user_civilization_science") return { rows: [[2000, 3]] };
      if (table === "t_hero") return { rows: [[7001]] };
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
  const snapshot = await readPowerState(db, "synthetic", now);
  expect(snapshot.profile?.uid).toBe("synthetic");
  expect(snapshot.armies).toEqual([{ armyId: "107001", free: 1, pve: 2, defence: 3, march: 4 }]);
  expect(snapshot.walls).toEqual([{ armyId: "108001", num: 5 }]);
  expect(snapshot.civilizationSciences).toEqual([{ baseItemID: 2000, level: 3 }]);
  expect(snapshot.heroes).toEqual([{ heroid: 7001 }]);
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
  expect(selects).toHaveLength(16);
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
