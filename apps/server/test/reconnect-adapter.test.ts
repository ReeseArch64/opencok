import { expect, test } from "bun:test";
import { drizzle, type NodePgClient } from "drizzle-orm/node-postgres";
import * as schema from "@opencok/drizzle/schema/kingdom";
import { readReconnectBase } from "@opencok/repositories/reconnect";
import { reconnectArmies, reconnectBalances } from "@opencok/dtos/reconnect";
import { decode, encode, sfs } from "@opencok/messages/sfs";

function database(options: { missing?: boolean; armies?: number; fail?: string } = {}) {
  const queries: { text: string; params: unknown[] }[] = [];
  const client = {
    query: async (query: { text: string }, params: unknown[] = []) => {
      queries.push({ text: query.text, params });
      const table = query.text.match(/from "opencok_kingdom"\."([^"]+)"/)?.[1];
      if (table === options.fail && table) throw new Error("Synthetic reconnect read failure");
      if (table === "userprofile")
        return {
          rows: options.missing
            ? []
            : [
                [
                  "synthetic",
                  2,
                  0,
                  "0",
                  "9007199254740993",
                  "8",
                  "2",
                  "9007199254740995",
                  "11",
                  "17",
                ],
              ],
        };
      if (table === "user_army")
        return {
          rows: Array.from({ length: options.armies ?? 2 }, (_, i) => [
            `army-${i}`,
            i + 1,
            2,
            3,
            i,
            "9007199254740997",
          ]),
        };
      return { rows: [] };
    },
  };
  return { db: drizzle(client as unknown as NodePgClient, { schema }), queries };
}

test("reconnect base binds all reads to one owner in a read-only repeatable snapshot", async () => {
  const { db, queries } = database();
  const state = await readReconnectBase(db, "synthetic");
  expect(state.profile).toEqual({
    uid: "synthetic",
    serverId: 2,
    banFlag: 0,
    banTime: 0n,
    gold: 9007199254740993n,
    paidGold: 8n,
    paidSpecialGold: 2n,
    dmmGold: 9007199254740995n,
    dmmPaidGold: 11n,
    dmmPaidSpecialGold: 17n,
  });
  expect(state.armies).toEqual([
    { armyId: "army-0", free: 1, march: 2, level: 3, train: 0, finishTime: 9007199254740997n },
    { armyId: "army-1", free: 2, march: 2, level: 3, train: 1, finishTime: 9007199254740997n },
  ]);
  expect(queries).toHaveLength(4);
  expect(queries[0]?.text).toBe("begin isolation level repeatable read read only");
  expect(queries.at(-1)?.text).toBe("commit");
  expect(queries[1]?.params).toEqual(["synthetic", 1]);
  expect(queries[2]?.params).toEqual(["synthetic", 32768]);
  for (const query of queries.slice(1, -1)) {
    expect(query.text).toMatch(/where .*\."uid" = \$1/);
    expect(query.text).not.toMatch(
      /\b(insert|update|delete)\b|select \*|deviceId|email|passmd5|foodCostTime|"pve"|"defence"/,
    );
  }
  expect(queries[2]?.text).toContain('order by "opencok_kingdom"."user_army"."armyId" asc');
  const result = decode(
    encode({ ...reconnectBalances(state.profile!), ...reconnectArmies(state.armies) }),
  );
  expect(result.gold).toEqual(sfs.long(9007199254741003n));
  expect(result.army).toEqual(
    sfs.array([
      sfs.object({
        id: sfs.string("army-0"),
        free: sfs.int(1),
        march: sfs.int(2),
        level: sfs.int(3),
      }),
      sfs.object({
        id: sfs.string("army-1"),
        free: sfs.int(2),
        march: sfs.int(2),
        level: sfs.int(3),
        train: sfs.int(1),
        finish: sfs.long(9007199254740997n),
      }),
    ]),
  );
});

test("missing reconnect owners skip dependent reads and invalid identities never reach SQL", async () => {
  const { db, queries } = database({ missing: true, fail: "user_army" });
  expect(await readReconnectBase(db, "unknown")).toEqual({ profile: undefined, armies: [] });
  expect(queries).toHaveLength(3);
  expect(queries.at(-1)?.text).toBe("commit");
  for (const uid of ["", " ", "a".repeat(41)]) expect(() => readReconnectBase(db, uid)).toThrow();
  expect(queries).toHaveLength(3);
});

test("reconnect snapshots distinguish empty armies from failure and collection overflow", async () => {
  const empty = database({ armies: 0 });
  expect((await readReconnectBase(empty.db, "synthetic")).armies).toEqual([]);
  expect(empty.queries.at(-1)?.text).toBe("commit");
  for (const options of [{ fail: "userprofile" }, { fail: "user_army" }, { armies: 32768 }]) {
    const { db, queries } = database(options);
    await expect(readReconnectBase(db, "synthetic")).rejects.toThrow();
    expect(queries.at(-1)?.text).toBe("rollback");
    expect(queries.some((query) => query.text === "commit")).toBe(false);
  }
});
