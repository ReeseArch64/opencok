import { expect, test } from "bun:test";
import { drizzle, type NodePgClient } from "drizzle-orm/node-postgres";
import * as schema from "@opencok/drizzle/schema/kingdom";
import {
  acquireRealmAuthority,
  fenceRealmTransaction,
} from "@opencok/repositories/realm-authority";

function database() {
  let epoch = 0n;
  let owner = "";
  let realm = 0;
  let saved = { epoch, owner, realm };
  let ready = true;
  let disconnectOnWrite = false;
  const queries: { text: string; params: unknown[] }[] = [];
  const client = {
    query: async (query: { text: string }, params: unknown[] = []) => {
      queries.push({ text: query.text, params });
      if (query.text.startsWith("begin")) {saved = { epoch, owner, realm };}
      if (query.text === "rollback") {({ epoch, owner, realm } = saved);}
      if (query.text.startsWith("insert into")) {
        realm = params[0] as number;
        owner = params[2] as string;
        epoch++;
        if (disconnectOnWrite) {ready = false;}
        return { rows: [[String(epoch)]] };
      }
      if (query.text.startsWith("select"))
        {return {
          rows:
            params[0] === realm && BigInt(params[1] as string) === epoch && params[2] === owner
              ? [[String(epoch)]]
              : [],
        };}
      return { rows: [] };
    },
  };
  return {
    db: drizzle(client as unknown as NodePgClient, { schema }),
    queries,
    ready: () => ready,
    disconnect: () => {
      ready = false;
    },
    disconnectOnWrite: () => {
      disconnectOnWrite = true;
    },
    state: () => ({ epoch, owner, realm }),
  };
}

test("realm ownership increments a durable epoch and excludes a stale writer with a bound share lock", async () => {
  const fixture = database();
  const first = await acquireRealmAuthority(fixture.db, 2, fixture.ready, 100);
  const second = await acquireRealmAuthority(fixture.db, 2, fixture.ready, 101);
  expect(first.epoch).toBe(1n);
  expect(second.epoch).toBe(2n);
  expect(first.instance).not.toBe(second.instance);
  await expect(fixture.db.transaction((tx) => fenceRealmTransaction(tx, first))).rejects.toThrow();
  expect(fixture.queries.at(-1)!.text).toBe("rollback");
  await fixture.db.transaction((tx) => fenceRealmTransaction(tx, second));
  expect(fixture.queries.at(-2)!.text).toContain("for share");
  expect(fixture.queries.at(-2)!.params).toEqual([2, 2n, second.instance, 1]);
  expect(fixture.queries.at(-1)!.text).toBe("commit");
  expect(Object.isFrozen(second)).toBe(true);
});

test("coordination loss prevents acquisition and rolls back an acquisition that loses its session", async () => {
  const fixture = database();
  fixture.disconnectOnWrite();
  await expect(acquireRealmAuthority(fixture.db, 1, fixture.ready)).rejects.toThrow();
  expect(fixture.state().epoch).toBe(0n);
  expect(fixture.queries.at(-1)!.text).toBe("rollback");
  const before = fixture.queries.length;
  await expect(acquireRealmAuthority(fixture.db, 1, fixture.ready)).rejects.toThrow();
  expect(fixture.queries).toHaveLength(before);
});

test("active lease checks suspend writes on coordination loss and reject invalid realm identities", async () => {
  const fixture = database();
  for (const id of [0, -1, 1.5, 2147483648])
    {await expect(acquireRealmAuthority(fixture.db, id, fixture.ready)).rejects.toThrow();}
  expect(fixture.queries).toEqual([]);
  const authority = await acquireRealmAuthority(fixture.db, 1, fixture.ready);
  fixture.disconnect();
  expect(() => authority.assertReady()).toThrow();
  await expect(
    fixture.db.transaction((tx) => fenceRealmTransaction(tx, authority)),
  ).rejects.toThrow();
  expect(fixture.queries.at(-1)!.text).toBe("rollback");
});
