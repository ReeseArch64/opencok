import { expect, test } from "bun:test";
import { drizzle, type NodePgClient } from "drizzle-orm/node-postgres";
import * as schema from "@opencok/drizzle/schema/global";
import { commitNicknameGlobal } from "@opencok/repositories/nickname-global";
import { nicknameGoldDebit } from "@opencok/rules/nickname-change";

type Account = {
  uid: string;
  name: string | null;
  active: number | null;
  server: string;
  lastTime: bigint;
};
type Mapping = {
  uid: string;
  type: string;
  value: string | null;
  lastTime: bigint;
  active: number | null;
};
type State = { accounts: Map<string, Account>; mappings: Map<string, Mapping> };
const mappingKey = (uid: string, type: string) => JSON.stringify([uid, type]);
const account = (uid = "self", name = "Old"): Account => ({
  uid,
  name,
  active: 0,
  server: "2",
  lastTime: 42n,
});
const mapping = (uid = "self", type = "name", value = "Old"): Mapping => ({
  uid,
  type,
  value,
  lastTime: 99n,
  active: -1,
});
function deferred() {
  let resolve!: () => void;
  const promise = new Promise<void>((done) => {
    resolve = done;
  });
  return { promise, resolve };
}

function fixture(accounts = [account()], mappings = [mapping()]) {
  const saved: State = {
    accounts: new Map(accounts.map((row) => [row.uid, structuredClone(row)])),
    mappings: new Map(mappings.map((row) => [mappingKey(row.uid, row.type), structuredClone(row)])),
  };
  const locks = new Map<string, number>();
  const ownerQueues = new Map<string, Promise<void>>();
  const queries: { id: number; text: string; params: unknown[] }[] = [];
  const destroyed: number[] = [];
  let sequence = 0,
    failure = "";
  let rollbackFailure = false;
  let afterUpdate: (() => Promise<void>) | undefined;
  class Pool {
    async connect() {
      const id = sequence++;
      let working: State | undefined;
      let writes: ((state: State) => void)[] = [];
      let releaseOwner: (() => void) | undefined;
      const end = () => {
        for (const [key, owner] of locks) if (owner === id) locks.delete(key);
        releaseOwner?.();
        releaseOwner = undefined;
        working = undefined;
        writes = [];
      };
      const change = (write: (state: State) => void) => {
        if (!working) throw new Error("Write without account lock");
        write(working);
        writes.push(write);
      };
      const fail = (stage: string) => {
        if (failure === stage)
          throw Object.assign(new Error("Synthetic SQL failure"), { code: "XX000" });
      };
      return {
        release: (destroy = false) => {
          if (destroy) {
            destroyed.push(id);
            end();
          }
        },
        query: async (query: { text: string }, params: unknown[] = []) => {
          const text = query.text;
          queries.push({ id, text, params });
          if (text.startsWith("begin")) return { rows: [] };
          if (text === "rollback") {
            if (rollbackFailure) throw new Error("Synthetic rollback failure");
            end();
            return { rows: [] };
          }
          if (text === "commit") {
            fail("commit");
            for (const write of writes) write(saved);
            end();
            fail("lost");
            return { rows: [] };
          }
          if (text.includes("pg_try_advisory_xact_lock")) {
            const key = params[0] as string;
            const acquired = !locks.has(key);
            if (acquired) locks.set(key, id);
            return { rows: [{ acquired }] };
          }
          expect([...locks.values()]).toContain(id);
          const state = working ?? saved;
          if (text.startsWith('select "gameUid", "mappingType", "mappingValue"')) {
            const type = new RegExp(params[0] as string, "u"),
              value = new RegExp(params[1] as string, "u");
            return {
              rows: [...state.mappings.values()]
                .filter((row) => type.test(row.type) && row.value !== null && value.test(row.value))
                .map((row) => [row.uid, row.type, row.value]),
            };
          }
          if (text.startsWith('select "gameUid" from "opencok_global"."account_new"')) {
            if (text.includes('"active" <>')) {
              const uid = new RegExp(params[0] as string, "u");
              return {
                rows: [...state.accounts.values()]
                  .filter((row) => row.active !== null && row.active !== -1 && uid.test(row.uid))
                  .map((row) => [row.uid]),
              };
            }
            if (text.endsWith("for update")) {
              expect(text).toBe(
                'select "gameUid" from "opencok_global"."account_new" where "opencok_global"."account_new"."gameUid" = $1 for update',
              );
              const uid = params[0] as string;
              const previous = ownerQueues.get(uid) ?? Promise.resolve();
              ownerQueues.set(
                uid,
                new Promise<void>((finish) => {
                  releaseOwner = finish;
                }),
              );
              await previous;
              working = structuredClone(saved);
              fail("owner-lock");
              if (failure === "owner-disappeared") return { rows: [] };
              return { rows: working.accounts.has(uid) ? [[uid]] : [] };
            }
            fail("owner-read");
            if (failure === "owner-network") throw new Error("Synthetic transport failure");
            const uid = new RegExp(params[0] as string, "u");
            return {
              rows: [...state.accounts.values()]
                .filter((row) => uid.test(row.uid))
                .map((row) => [row.uid]),
            };
          }
          if (text.startsWith('update "opencok_global"."account_new"')) {
            expect(text).toBe(
              'update "opencok_global"."account_new" set "gameUserName" = $1 where "opencok_global"."account_new"."gameUid" = $2 returning "gameUid"',
            );
            const [name, uid] = params as [string, string];
            fail("account-update");
            change((data) => {
              data.accounts.get(uid)!.name = name;
            });
            await afterUpdate?.();
            return { rows: failure === "update-result" ? [] : [[uid]] };
          }
          if (text.startsWith('select "gameUid", "mappingType" from')) {
            expect(text).toBe(
              'select "gameUid", "mappingType" from "opencok_global"."usermapping" where ("opencok_global"."usermapping"."gameUid" collate "C" ~ $1 and "opencok_global"."usermapping"."mappingType" collate "C" ~ $2)',
            );
            fail("mapping-read");
            const uid = new RegExp(params[0] as string, "u"),
              type = new RegExp(params[1] as string, "u");
            return {
              rows: [...state.mappings.values()]
                .filter((row) => uid.test(row.uid) && type.test(row.type))
                .map((row) => [row.uid, row.type]),
            };
          }
          if (text.startsWith('delete from "opencok_global"."usermapping"')) {
            expect(params.length % 2).toBe(0);
            expect(params.length).toBeLessThanOrEqual(1000);
            expect(text).not.toContain('"mappingValue"');
            fail("mapping-delete");
            const keys = new Set<string>();
            for (let index = 0; index < params.length; index += 2)
              keys.add(mappingKey(params[index] as string, params[index + 1] as string));
            change((data) => {
              for (const key of keys) data.mappings.delete(key);
            });
            return { rows: [] };
          }
          if (text.startsWith('insert into "opencok_global"."usermapping"')) {
            expect(text).toBe(
              'insert into "opencok_global"."usermapping" ("gameUid", "mappingType", "mappingValue", "lastTime", "active") values ($1, $2, $3, default, default) returning "gameUid", "mappingType", "mappingValue"',
            );
            fail("mapping-insert");
            const [uid, type, value] = params as [string, string, string];
            change((data) => {
              const key = mappingKey(uid, type);
              if (data.mappings.has(key)) throw new Error("Synthetic uniqueness failure");
              data.mappings.set(key, { uid, type, value, lastTime: 0n, active: 0 });
            });
            return {
              rows: failure === "insert-result" ? [["wrong", type, value]] : [[uid, type, value]],
            };
          }
          throw new Error(`Unexpected synthetic query: ${text}`);
        },
      };
    }
  }
  return {
    db: drizzle(new Pool() as unknown as NodePgClient, { schema }),
    queries,
    destroyed,
    locks,
    state: () => structuredClone(saved),
    fail: (stage: string) => {
      failure = stage;
    },
    failRollback: () => {
      rollbackFailure = true;
    },
    afterUpdate: (callback: () => Promise<void>) => {
      afterUpdate = callback;
    },
  };
}

test("global rename changes only the account name and replaces owned name mappings with defaults", async () => {
  const rows = [
    mapping(),
    mapping("self", "email", "synthetic-binding"),
    mapping("fles", "name", "Other"),
    mapping("self", "eman", "Other"),
  ];
  const instance = fixture([account(), account("other", "Other")], rows);
  let prepareAt = -1;
  const receipt = { operation: "synthetic" };
  expect(
    await commitNicknameGlobal(instance.db, "self", "alpha", async () => {
      prepareAt = instance.queries.length;
      return receipt;
    }),
  ).toBe(receipt);
  expect(prepareAt).toBe(3);
  const after = instance.state();
  expect(after.accounts.get("self")).toEqual({ ...account(), name: "alpha" });
  expect(after.accounts.get("other")).toEqual(account("other", "Other"));
  expect(after.mappings.get(mappingKey("self", "name"))).toEqual({
    uid: "self",
    type: "name",
    value: "alpha",
    lastTime: 0n,
    active: 0,
  });
  for (const row of rows.slice(1))
    expect(after.mappings.get(mappingKey(row.uid, row.type))).toEqual(row);
  expect(instance.queries.at(-1)?.text).toBe("commit");
  expect(instance.locks.size).toBe(0);
});

test("global rename matches owner and mapping type using legacy collation without filtering account activity", async () => {
  for (const active of [-1, null, 0, 1]) {
    const instance = fixture(
      [{ ...account("SÉLF", "Different display name"), active, server: "99" }],
      [mapping("SELF", "Náme\u00a0", "Stale name")],
    );
    await commitNicknameGlobal(instance.db, "self", "alpha", async () => {});
    expect(instance.state().accounts.get("SÉLF")).toEqual({
      ...account("SÉLF", "alpha"),
      active,
      server: "99",
    });
    expect([...instance.state().mappings.values()]).toEqual([
      { uid: "self", type: "name", value: "alpha", lastTime: 0n, active: 0 },
    ]);
  }
});

test("global rename creates a missing mapping and leaves orphan mappings belonging to other owners", async () => {
  const orphan = mapping("ghost", "name", "alpha");
  const instance = fixture([account()], [orphan]);
  await commitNicknameGlobal(instance.db, "self", "alpha", async () => {});
  expect(instance.state().mappings.get(mappingKey("ghost", "name"))).toEqual(orphan);
  expect(instance.state().mappings.get(mappingKey("self", "name"))?.value).toBe("alpha");
});

test("confirmed occupation rejects before preparation and never changes saved state", async () => {
  const instance = fixture(
    [account(), account("other", "ALPHA")],
    [mapping(), mapping("other", "name", "ÁLPHA")],
  );
  const before = instance.state();
  let called = false;
  await expect(
    commitNicknameGlobal(instance.db, "self", "alpha", async () => {
      called = true;
    }),
  ).rejects.toMatchObject({ code: "105251" });
  expect(called).toBe(false);
  expect(instance.state()).toEqual(before);
});

test("preparation failures preserve game errors without entering the account update", async () => {
  const instance = fixture();
  const before = instance.state();
  await expect(
    commitNicknameGlobal(instance.db, "self", "alpha", async () =>
      nicknameGoldDebit(
        {
          gold: 0n,
          paidGold: 0n,
          paidSpecialGold: 0n,
          dmmGold: 0n,
          dmmPaidGold: 0n,
          dmmPaidSpecialGold: 0n,
        },
        null,
        "1",
      ),
    ),
  ).rejects.toMatchObject({ code: "E100001" });
  expect(instance.state()).toEqual(before);
  expect(instance.queries).toHaveLength(4);
});

test("missing accounts and reached account SQL errors retain the legacy missing-account code after preparation", async () => {
  for (const stage of ["missing", "owner-read", "owner-lock", "owner-disappeared"]) {
    const instance = fixture(stage === "missing" ? [] : [account()]);
    instance.fail(stage);
    let prepared = false;
    await expect(
      commitNicknameGlobal(instance.db, "self", "alpha", async () => {
        prepared = true;
      }),
    ).rejects.toMatchObject({ code: "E100123" });
    expect(prepared).toBe(true);
    expect(instance.queries.some((query) => query.text.startsWith("update "))).toBe(false);
    expect(instance.locks.size).toBe(0);
  }
});

test("global rename rolls back account and mapping changes on each write or malformed result failure", async () => {
  for (const stage of [
    "account-update",
    "update-result",
    "mapping-read",
    "mapping-delete",
    "mapping-insert",
    "insert-result",
  ]) {
    const instance = fixture();
    instance.fail(stage);
    const before = instance.state();
    await expect(
      commitNicknameGlobal(instance.db, "self", "alpha", async () => {}),
    ).rejects.toMatchObject({ code: "E100179" });
    expect(instance.state()).toEqual(before);
    expect(instance.queries.at(-1)?.text).toBe("rollback");
    expect(instance.locks.size).toBe(0);
  }
});

test("commit uncertainty is not converted into a refundable game error or an automatic retry", async () => {
  for (const stage of ["commit", "lost"]) {
    const instance = fixture();
    instance.fail(stage);
    let prepared = 0;
    await expect(
      commitNicknameGlobal(instance.db, "self", "alpha", async () => {
        prepared++;
      }),
    ).rejects.toThrow("nickname change transaction");
    expect(prepared).toBe(1);
    expect(instance.state().accounts.get("self")?.name).toBe(stage === "lost" ? "alpha" : "Old");
    expect(instance.state().mappings.get(mappingKey("self", "name"))?.value).toBe(
      stage === "lost" ? "alpha" : "Old",
    );
  }
});

test("failed rollback replaces the write game error with an uncertain dependency failure and discards the connection", async () => {
  const instance = fixture();
  const before = instance.state();
  instance.fail("mapping-insert");
  instance.failRollback();
  await expect(commitNicknameGlobal(instance.db, "self", "alpha", async () => {})).rejects.toThrow(
    "nickname change transaction",
  );
  expect(instance.destroyed).toEqual([0]);
  expect(instance.locks.size).toBe(0);
  expect(instance.state()).toEqual(before);
});

test("concurrent equivalent target names permit one global commit and reject later occupation", async () => {
  const instance = fixture(
    [account(), account("other", "Other")],
    [mapping(), mapping("other", "name", "Other")],
  );
  const entered = deferred(),
    finish = deferred();
  const first = commitNicknameGlobal(instance.db, "self", "alpha", async () => {
    entered.resolve();
    await finish.promise;
    return "first";
  });
  await entered.promise;
  let otherPrepared = false;
  const second = () =>
    commitNicknameGlobal(instance.db, "other", "ÁLPHA", async () => {
      otherPrepared = true;
    });
  try {
    await expect(second()).rejects.toMatchObject({ code: "105251" });
  } finally {
    finish.resolve();
  }
  expect(await first).toBe("first");
  await expect(second()).rejects.toMatchObject({ code: "105251" });
  expect(otherPrepared).toBe(false);
  expect(instance.state().accounts.get("other")?.name).toBe("Other");
});

test("different target names for one owner serialize account writes and leave one replacement mapping", async () => {
  const instance = fixture();
  const updated = deferred(),
    finish = deferred();
  let updates = 0;
  instance.afterUpdate(async () => {
    if (++updates === 1) {
      updated.resolve();
      await finish.promise;
    }
  });
  const first = commitNicknameGlobal(instance.db, "self", "alpha", async () => {});
  await updated.promise;
  const secondPrepared = deferred();
  const second = commitNicknameGlobal(instance.db, "self", "beta", async () => {
    secondPrepared.resolve();
  });
  await secondPrepared.promise;
  finish.resolve();
  await Promise.all([first, second]);
  expect(instance.state().accounts.get("self")?.name).toBe("beta");
  expect([...instance.state().mappings.values()]).toEqual([
    { uid: "self", type: "name", value: "beta", lastTime: 0n, active: 0 },
  ]);
});

test("owned collation aliases are deleted in bounded batches while account ambiguity stops the write", async () => {
  const aliases = Array.from({ length: 501 }, (_, index) =>
    mapping(
      "self",
      "name" + index.toString(2).padStart(9, "0").replace(/0/g, "\u200b").replace(/1/g, "\u200c"),
    ),
  );
  const instance = fixture([account()], aliases);
  await commitNicknameGlobal(instance.db, "self", "alpha", async () => {});
  expect(
    instance.queries
      .filter((query) => query.text.startsWith("delete "))
      .map((query) => query.params.length),
  ).toEqual([1000, 2]);
  expect(instance.state().mappings.size).toBe(1);
  const ambiguous = fixture([account("self"), account("SELF")]);
  await expect(commitNicknameGlobal(ambiguous.db, "self", "alpha", async () => {})).rejects.toThrow(
    "nickname change transaction",
  );
  expect(ambiguous.queries.some((query) => query.text.startsWith("update "))).toBe(false);
});

test("invalid owner input and non-SQL account failures reject without inventing account or mapping rows", async () => {
  for (const owner of ["", "a".repeat(101), "a\0b", "😀", null]) {
    const instance = fixture();
    await expect(
      commitNicknameGlobal(instance.db, owner as string, "alpha", async () => {}),
    ).rejects.toThrow("nickname global input");
    expect(instance.queries).toHaveLength(0);
  }
  const instance = fixture();
  instance.fail("owner-network");
  await expect(commitNicknameGlobal(instance.db, "self", "alpha", async () => {})).rejects.toThrow(
    "nickname change transaction",
  );
  expect(instance.state().accounts.get("self")?.name).toBe("Old");
});
