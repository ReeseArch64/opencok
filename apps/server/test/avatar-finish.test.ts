import { expect, test } from "bun:test";
import { drizzle, type NodePgClient } from "drizzle-orm/node-postgres";
import * as schema from "@opencok/drizzle/schema/kingdom";
import { commitAvatarFinish } from "@opencok/repositories/avatar-finish";
import { finishAvatar } from "@opencok/controllers/avatar-finish";
import { Rules, type Rule } from "@opencok/rules/game";
import { avatarFinishQuery, avatarFinishPlan } from "@opencok/rules/avatar";
import type { AvatarFinishInspector, AvatarGrantReaders } from "@opencok/contracts/files";

const now = 1792756800123;
const hash = "a".repeat(64);
const template = {
  id: "10111",
  sender: "synthetic-sender",
  title: "synthetic-title",
  message: "synthetic-message",
  type: "2",
};
function rules(mode = "1", interval = "60") {
  return new Rules(
    new Map(),
    new Map(),
    new Map(),
    undefined,
    new Map<string, Rule>([
      ["function_on5", { k2: mode }],
      ["hero", { k9: "10", k7: interval }],
    ]),
  );
}
function fixture() {
  let state = {
    profile: ["1001", 1, "0", 0, 1000004, "Synthetic Name", "synthetic-platform"] as
      | unknown[]
      | null,
    record: null as unknown[] | null,
    completions: [] as unknown[][],
  };
  let working = structuredClone(state);
  const queries: { text: string; params: unknown[] }[] = [];
  const calls: string[] = [];
  let failure = "";
  let committed = false;
  let castles: unknown[][] = [["1001", 10]];
  let candidate: { owner: string; sequence: string; hash: string } | null = {
    owner: "1001",
    sequence: "5",
    hash,
  };
  let backlog = 0;
  const client = {
    query: async (statement: { text: string }, params: unknown[] = []) => {
      const text = statement.text;
      queries.push({ text, params });
      if (text.startsWith("begin")) {
        working = structuredClone(state);
        committed = false;
        return { rows: [] };
      }
      if (text === "rollback") return { rows: [] };
      if (text === "commit") {
        if (failure === "commit") throw new Error("Synthetic commit failure");
        state = working;
        committed = true;
        if (failure === "lost") throw new Error("Synthetic lost response");
        return { rows: [] };
      }
      const source = text.includes('"avatar_completion"')
        ? "completion"
        : text.includes('"pic_upload_record"')
          ? "record"
          : text.includes('"user_building"')
            ? "castle"
            : "profile";
      const operation = `${text.split(" ")[0]}:${source}`;
      calls.push(operation);
      if (failure === operation) throw new Error("Synthetic database failure");
      if (text.startsWith("select")) {
        if (source === "profile") return { rows: working.profile ? [working.profile] : [] };
        if (source === "castle") return { rows: castles };
        if (source === "record")
          return {
            rows: working.record ? [[working.record[0], working.record[2], working.record[5]]] : [],
          };
        if (text.includes('"pendingEffects" >'))
          return { rows: Array.from({ length: backlog }, () => [1]) };
        return {
          rows: working.completions.filter((row) => row[0] === params[0] && row[1] === params[1]),
        };
      }
      if (operation === "insert:record") {
        const previous = working.record;
        working.record = params.slice(0, 7);
        if (previous) {
          working.record[4] = previous[4];
          working.record[5] = previous[5];
        }
      }
      if (operation === "update:profile") {
        if (failure === "cas") return { rows: [] };
        expect(params).toEqual([params[0], "1001", 1, working.profile![4]]);
        working.profile![4] = params[0];
        return { rows: [["1001"]] };
      }
      if (operation === "insert:completion") {
        if (working.completions.some((row) => row[0] === params[0] && row[1] === params[1]))
          throw new Error("Synthetic duplicate receipt");
        working.completions.push(params.slice(0, 7));
      }
      return { rows: [] };
    },
  };
  const db = drizzle(client as unknown as NodePgClient, { schema });
  const store = {
    commit: (
      owner: string,
      query: ReturnType<typeof avatarFinishQuery>,
      find: (owner: string, sequence: number) => Promise<typeof candidate>,
      inspect: AvatarFinishInspector,
    ) => commitAvatarFinish(db, 1, owner, query, find, inspect),
  };
  const files = {
    find: async (owner: string, sequence: number) => {
      calls.push("find");
      expect(owner).toBe("1001");
      expect(Number.isInteger(sequence)).toBe(true);
      if (failure === "find") throw new Error("Synthetic files failure");
      return candidate;
    },
  };
  return {
    db,
    store,
    files,
    queries,
    calls,
    get state() {
      return state;
    },
    get committed() {
      return committed;
    },
    fail: (value: string) => {
      failure = value;
    },
    setCastles: (value: unknown[][]) => {
      castles = value;
    },
    setCandidate: (value: typeof candidate) => {
      candidate = value;
    },
    setBacklog: (value: number) => {
      backlog = value;
    },
    run: (config = rules(), receipt = `5:${hash}`, mail = template) =>
      finishAvatar(store, files, config, "1001", receipt, now, mail),
  };
}

test("new completion commits profile, moderation and captured effects under the owner lock", async () => {
  const f = fixture();
  f.state.record = ["1001", 4, String(now - 60000), 9, 7, String(now), 2];
  const result = await f.run();
  expect(result).toMatchObject({ picVer: 5, superseded: false, applied: true });
  expect(f.state.profile![4]).toBe(5);
  expect(f.state.record).toEqual(["1001", 5, BigInt(now), 0, 7, String(now), 0]);
  expect(f.state.completions).toHaveLength(1);
  const receipt = f.state.completions[0]!;
  expect(receipt.slice(0, 5)).toEqual(["1001", 5, hash, 5, BigInt(now)]);
  expect(JSON.parse(receipt[5] as string)).toEqual({
    version: 1,
    mail: template,
    profile: {
      userName: "Synthetic Name",
      platform: "synthetic-platform",
      updatedAt: "1792756800",
    },
  });
  expect(receipt[6]).toBe(7);
  expect(f.queries[0]!.text).toBe("begin isolation level repeatable read read write");
  expect(f.queries[1]!.text).toEndWith("limit $2 for update");
  expect(f.queries[1]!.params).toEqual(["1001", 1]);
  expect(f.calls).toEqual([
    "select:profile",
    "find",
    "select:completion",
    "select:castle",
    "select:record",
    "select:completion",
    "insert:record",
    "update:profile",
    "insert:completion",
  ]);
  const upsert = f.queries.find((row) =>
    row.text.startsWith('insert into "opencok_kingdom"."pic_upload_record"'),
  )!;
  expect(upsert.text.split("do update set")[1]).not.toMatch(/banCount|banTime/);
  expect(f.queries.filter((row) => row.text.includes('"user_building"'))[0]!.params).toEqual([
    "1001",
    400000,
    2,
  ]);
  expect(f.queries.find((row) => row.text.includes('"pendingEffects" >'))!.params).toEqual([
    "1001",
    0,
    1000,
  ]);
  expect(
    f.queries
      .filter((row) => row.text.startsWith("select"))
      .every((row) => !row.text.includes('"effects"')),
  ).toBe(true);
  expect(f.queries.at(-1)!.text).toBe("commit");
});

test("first moderated upload initializes the record; exact bypass leaves it unchanged and encodes Waiting", async () => {
  const initial = fixture();
  await initial.run();
  expect(initial.state.record).toEqual(["1001", 5, BigInt(now), 0, 0, 0n, 0]);
  const bypass = fixture();
  bypass.state.record = ["1001", 4, String(now), 9, 7, String(now + 60000), 2];
  const before = structuredClone(bypass.state.record);
  await bypass.run(rules("0", "invalid"));
  expect(bypass.state.profile![4]).toBe(2000005);
  expect(bypass.state.record).toEqual(before);
  expect(bypass.calls).not.toContain("select:castle");
  expect(bypass.calls).not.toContain("select:record");
  expect(JSON.parse(bypass.state.completions[0]![5] as string).mail).toBeNull();
  expect(bypass.state.completions[0]![6]).toBe(6);
});

test("current and older verified receipts do not recheck eligibility or duplicate effects", async () => {
  const f = fixture();
  await f.run();
  const before = structuredClone(f.state);
  f.queries.length = 0;
  f.calls.length = 0;
  const invalidConfig = rules();
  invalidConfig.items.clear();
  expect(await f.run(invalidConfig)).toMatchObject({
    picVer: 5,
    superseded: false,
    applied: false,
  });
  expect(f.state).toEqual(before);
  expect(f.calls).toEqual(["select:profile", "find", "select:completion"]);
  f.state.profile![4] = 3000007;
  expect(await f.run(invalidConfig)).toMatchObject({
    picVer: 3000007,
    superseded: true,
    applied: false,
  });
  expect(f.state.completions).toHaveLength(1);
  const imported = fixture();
  imported.state.profile![4] = 2000005;
  expect(await imported.run(invalidConfig)).toMatchObject({ applied: false, picVer: 2000005 });
  expect(imported.state.completions).toHaveLength(1);
  expect(imported.state.completions[0]![6]).toBe(0);
  expect(JSON.parse(imported.state.completions[0]![5] as string)).toEqual({
    version: 1,
    observed: true,
  });
  imported.state.profile![4] = 4;
  await expect(imported.run(invalidConfig)).rejects.toThrow();
  const failedVersion = fixture();
  failedVersion.state.profile![4] = 3000005;
  expect(await failedVersion.run(invalidConfig)).toMatchObject({ applied: false, picVer: 3000005 });
  expect(failedVersion.state.completions[0]![3]).toBe(3000005);
});

test("lost commit response is resolved by a fresh retry without duplicating committed effects", async () => {
  const f = fixture();
  f.fail("lost");
  await expect(f.run()).rejects.toThrow();
  expect(f.committed).toBe(true);
  expect(f.state.profile![4]).toBe(5);
  f.fail("");
  expect(await f.run()).toMatchObject({ applied: false, picVer: 5 });
  expect(f.state.completions).toHaveLength(1);
  expect(f.calls.filter((call) => call === "insert:completion")).toHaveLength(1);
});

test("every failed precondition and write rolls back without a partial completion", async () => {
  for (const failure of [
    "find",
    "select:profile",
    "select:completion",
    "select:castle",
    "select:record",
    "insert:record",
    "update:profile",
    "insert:completion",
    "cas",
    "commit",
  ]) {
    const f = fixture();
    const before = structuredClone(f.state);
    f.fail(failure);
    await expect(f.run()).rejects.toThrow();
    expect(f.state).toEqual(before);
    expect(f.queries.at(-1)!.text).toBe("rollback");
    expect(f.committed).toBe(false);
  }
  const backlog = fixture();
  backlog.setBacklog(1000);
  await expect(backlog.run()).rejects.toThrow("Avatar completion backlog full");
  expect(
    backlog.calls.some((call) => call.startsWith("insert:") || call.startsWith("update:")),
  ).toBe(false);
  const below = fixture();
  below.setBacklog(999);
  expect(await below.run()).toMatchObject({ applied: true });
});

test("invalid ownership, receipts, future gaps and previously completed reset sequences cannot mutate", async () => {
  for (const profile of [
    null,
    ["other", 1, "0", 0, 4],
    ["1001", 2, "0", 0, 4],
    ["1001", 1, "0", 1, 4],
    ["1001", 1, String(now + 1), 0, 4],
  ]) {
    const f = fixture();
    f.state.profile = profile;
    const result = await f.run();
    expect(result.applied).toBeUndefined();
    expect(f.calls).toEqual(["select:profile"]);
  }
  for (const receipt of [
    null,
    { owner: "other", sequence: "5", hash },
    { owner: "1001", sequence: "6", hash },
    { owner: "1001", sequence: "5", hash: "b".repeat(64) },
  ]) {
    const f = fixture();
    f.setCandidate(receipt);
    await expect(f.run()).rejects.toThrow();
    expect(f.state.completions).toEqual([]);
  }
  for (const version of [-1, null, 2147483648, 1.5, 2]) {
    const f = fixture();
    f.state.profile![4] = version;
    await expect(f.run()).rejects.toThrow();
    expect(f.state.completions).toEqual([]);
  }
  const reset = fixture();
  await reset.run();
  reset.state.profile![4] = 4;
  await expect(reset.run()).rejects.toThrow();
  expect(reset.state.completions).toHaveLength(1);
  const changedHash = fixture();
  await changedHash.run();
  changedHash.state.completions[0]![2] = "b".repeat(64);
  await expect(changedHash.run()).rejects.toThrow();
  for (const castles of [
    [],
    [["other", 10]],
    [
      ["1001", 10],
      ["1001", 11],
    ],
  ]) {
    const f = fixture();
    f.setCastles(castles);
    await expect(f.run()).rejects.toThrow();
    expect(f.state.completions).toEqual([]);
  }
});

test("finish parses interval before a missing record and preserves level, cooldown, ban precedence", async () => {
  const noRecord = fixture();
  await expect(noRecord.run(rules("1", "invalid"))).rejects.toThrow("102192");
  expect(noRecord.calls).not.toContain("select:record");
  const low = fixture();
  low.setCastles([["1001", 9]]);
  await expect(low.run(rules("1", "invalid"))).rejects.toThrow("105775");
  const missingFlag = fixture();
  const config = rules();
  config.items.set("function_on5", {});
  await expect(missingFlag.run(config)).rejects.toThrow("102192");
  for (const [updated, banned, error] of [
    [now, now + 1, "105769"],
    [now - 60000, now + 1, "105770"],
  ] as const) {
    const f = fixture();
    f.state.record = ["1001", 4, String(updated), 1, 0, String(banned), 2];
    await expect(f.run()).rejects.toThrow(error);
    expect(f.state.completions).toEqual([]);
  }
  const wrapped = fixture();
  wrapped.state.record = ["1001", 4, String(now), 1, 0, "0", 2];
  expect(await wrapped.run(rules("1", "9223372036854775807"))).toMatchObject({ applied: true });
});

test("query, plan and escaped-reader boundaries reject malformed data before writes", async () => {
  for (const raw of [
    "",
    `0:${hash}`,
    `01:${hash}`,
    `1000000:${hash}`,
    `5:${hash.toUpperCase()}`,
    `5:${hash}\n`,
  ])
    expect(() => avatarFinishQuery(raw, now)).toThrow();
  for (const time of [-1, NaN, 1.5, Number.MAX_SAFE_INTEGER + 1])
    expect(() => avatarFinishQuery(`5:${hash}`, time)).toThrow();
  const f = fixture();
  for (const owner of ["", "other", "1".repeat(21)])
    expect(() =>
      commitAvatarFinish(
        f.db,
        1,
        owner,
        avatarFinishQuery(`5:${hash}`, now),
        f.files.find,
        async () => {
          throw new Error();
        },
      ),
    ).toThrow();
  expect(f.queries).toEqual([]);
  let readers: AvatarGrantReaders | undefined;
  const query = avatarFinishQuery(`5:${hash}`, now);
  await commitAvatarFinish(f.db, 1, "1001", query, f.files.find, async (profile, value) => {
    readers = value;
    query.hash = "b".repeat(64);
    return avatarFinishPlan(profile, avatarFinishQuery(`5:${hash}`, now), false, undefined);
  });
  expect(f.state.completions[0]![2]).toBe(hash);
  const count = f.queries.length;
  await expect(readers!.castleLevel()).rejects.toThrow();
  await expect(readers!.uploadRecord()).rejects.toThrow();
  expect(f.queries).toHaveLength(count);
  for (const patch of [
    { picVer: 6 },
    { effects: "invalid" },
    { pendingEffects: 0 },
    { moderated: true },
  ]) {
    const bad = fixture();
    await expect(
      commitAvatarFinish(
        bad.db,
        1,
        "1001",
        avatarFinishQuery(`5:${hash}`, now),
        bad.files.find,
        async (profile) => ({
          ...avatarFinishPlan(profile, avatarFinishQuery(`5:${hash}`, now), false, undefined),
          ...patch,
        }),
      ),
    ).rejects.toThrow();
    expect(bad.state.completions).toEqual([]);
  }
  const huge = fixture();
  await expect(
    huge.run(rules(), undefined, { ...template, message: "x".repeat(65536) }),
  ).rejects.toThrow();
  expect(huge.state.completions).toEqual([]);
});

test("maximum sequences, absent mail templates and immutable metadata preserve completion intent", async () => {
  const last = fixture();
  last.state.profile![4] = 2999998;
  last.setCandidate({ owner: "1001", sequence: "999999", hash });
  expect(await last.run(rules("0"), `999999:${hash}`)).toMatchObject({
    picVer: 2999999,
    applied: true,
  });
  expect(await last.run(rules("0"), `999999:${hash}`)).toMatchObject({
    picVer: 2999999,
    applied: false,
  });
  expect(last.state.completions).toHaveLength(1);
  const absent = fixture();
  await finishAvatar(absent.store, absent.files, rules(), "1001", `5:${hash}`, now);
  expect(JSON.parse(absent.state.completions[0]![5] as string).mail).toBeNull();
  expect(absent.state.completions[0]![6]).toBe(6);
  const captured = fixture();
  const source = { ...template };
  const request = captured.run(rules(), undefined, source);
  source.message = "changed after request";
  await request;
  expect(JSON.parse(captured.state.completions[0]![5] as string).mail.message).toBe(
    template.message,
  );
  for (const value of [null, "x".repeat(256), "bad\0name", "\ud800"]) {
    const malformed = fixture();
    malformed.state.profile![5] = value;
    await expect(malformed.run()).rejects.toThrow();
    expect(malformed.state.completions).toEqual([]);
  }
});
