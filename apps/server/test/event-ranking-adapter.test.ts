import { expect, test } from "bun:test";
import { drizzle, type NodePgClient } from "drizzle-orm/node-postgres";
import * as schema from "@opencok/drizzle/schema/kingdom";
import { readHeroRanking } from "@opencok/repositories/hero-ranking";
import { readThroneRanking } from "@opencok/repositories/throne-ranking";

function database(tableRows: Record<string, unknown[][]>) {
  const queries: { text: string; params: unknown[] }[] = [];
  const client = {
    query: async (query: { text: string }, params: unknown[] = []) => {
      queries.push({ text: query.text, params });
      const table = query.text.match(/from "opencok_(?:kingdom|global)"\."([^"]+)"/)?.[1];
      return { rows: table ? (tableRows[table] ?? []) : [] };
    },
  };
  return { db: drizzle(client as unknown as NodePgClient, { schema }), queries };
}

test("hero adapter reads one owner's activity and ordered events in a read-only snapshot", async () => {
  const { db, queries } = database({
    userprofile: [["self", "alliance", 1, 0, "0"]],
    hero_activity: [["active"]],
    hero_event: [["event", "active", "rule", 4, "9007199254740993", "1_2"]],
  });
  const state = await readHeroRanking(db, "self", "activity", 1000);
  expect(state.events[0]?.endTime).toBe(9007199254740993n);
  expect(queries[0]?.text).toContain("repeatable read read only");
  expect(
    queries.find((query) => query.text.includes('from "opencok_kingdom"."hero_event"'))?.params,
  ).toContain("active");
  expect(queries.some((query) => /insert|update|delete/i.test(query.text))).toBe(false);
  expect(queries.map((query) => query.text).join(" ")).not.toMatch(
    /device|email|password|deadDetail/,
  );
  const invalid = database({
    userprofile: [["self", "", 1, 0, "0"]],
    hero_activity: [["one"], ["two"]],
  });
  await expect(readHeroRanking(invalid.db, "self", "activity", 1000)).rejects.toThrow();
  expect(invalid.queries.at(-1)?.text).toBe("rollback");
});

test("throne adapter scopes the current fight, stabilizes kill ties and reads only public columns", async () => {
  const { db, queries } = database({
    fight_king_status: [[7, '{"isCrossOpen":true}']],
    user_cross_throne: [[1, "self", "9007199254740993", "2", "Self", "Alliance", "AL", 2]],
    server_king_info: [[2, "Realm"]],
  });
  const state = await readThroneRanking(
    db,
    db as unknown as Parameters<typeof readThroneRanking>[1],
  );
  expect(state.rows[0]).toMatchObject({
    uid: "self",
    totalKills: 9007199254740993n,
    kingdomName: "Realm",
  });
  const select = queries.find((query) =>
    query.text.includes('from "opencok_kingdom"."user_cross_throne"'),
  )!;
  expect(select.params).toContain(7);
  expect(select.text).toContain('"totalKills" desc');
  expect(select.text).toContain('"id" asc');
  expect(select.text).not.toContain("deadDetail");
  expect(queries.some((query) => /insert|update|delete/i.test(query.text))).toBe(false);
});
