import { expect, test } from "bun:test";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Effect } from "effect";
import { EnvironmentSource } from "@opencok/env/effect";
import { GameService as Game } from "@opencok/services/game";
import { Rules, type Rule } from "@opencok/rules/game";
import { avatarSequence, avatarMinimumLevel, checkAvatarRecord } from "@opencok/rules/avatar";
import { createAvatarFiles, loadAvatarFiles } from "@opencok/connection/avatar-files";
import {
  issueAvatarGrant,
  issueAvatarConfirmation,
  verifyGrant,
  verifyConfirmation,
} from "@opencok/identity/avatar";
import { createHandler } from "@opencok/api/files";
import { sfs, decode, encode } from "@opencok/messages/sfs";
import type { GameStore } from "@opencok/contracts/game";
import type { AvatarGrantService, ImageStore } from "@opencok/contracts/files";
import type { Row } from "@opencok/contracts/rows";
import { config } from "../src/config";

const now = 1792756800123;
const seconds = Math.floor(now / 1000);
const key = Buffer.alloc(32, 19);
const hash = "a".repeat(64);
const origin = "http://files.internal:8084";
const unused = async (): Promise<never> => {
  throw new Error("Unexpected dependency call");
};
function rules(mode = "1", minimum = "10", interval = "60") {
  return new Rules(
    new Map(),
    new Map(),
    new Map(),
    undefined,
    new Map<string, Rule>([
      ["function_on5", { k2: mode }],
      ["hero", { k9: minimum, k7: interval }],
    ]),
  );
}
function fixture() {
  const profile: Row = { uid: "1001", serverId: 1, banFlag: 0, banTime: 0n, picVer: 1000004 };
  let record: Row | undefined;
  let level = 10;
  let pending = false;
  const calls: unknown[][] = [];
  const imageStore: ImageStore = {
    put: unused,
    get: unused,
    find: async (owner, sequence) => {
      calls.push(["find", owner, sequence]);
      return pending ? { owner, sequence, hash } : null;
    },
  };
  const handler = createHandler(imageStore, key, () => now);
  const files = createAvatarFiles({
    origin,
    key,
    timeoutMs: 1000,
    now: () => now,
    fetch: async (url, options) => {
      calls.push(["http", url, options.method, options.redirect]);
      return handler(new Request(url, options));
    },
  });
  const service: AvatarGrantService = {
    ...files,
    read: async (owner, time, inspect) => {
      calls.push(["read", owner, time]);
      return {
        profile,
        grant: await inspect(profile, {
          castleLevel: async () => {
            calls.push(["castle"]);
            return level;
          },
          uploadRecord: async () => {
            calls.push(["record"]);
            return record;
          },
        }),
      };
    },
  };
  const db = new Proxy({}, { get: () => unused }) as GameStore;
  const game = new Game(db, rules(), { kingdomId: 1 }, () => now, { avatar: service });
  return {
    game,
    service,
    profile,
    calls,
    setLevel: (value: number) => {
      level = value;
    },
    setRecord: (value: Row | undefined) => {
      record = value;
    },
    setPending: () => {
      pending = true;
    },
  };
}

test("avatar grant binds durable version and identity to the existing files confirmation/grant protocol", async () => {
  const f = fixture();
  const before = structuredClone(f.profile);
  const params = {
    gameuid: sfs.string("1001"),
    sequence: sfs.int(999),
    picVer: sfs.int(999),
    grant: sfs.string("forged"),
    _cok_: sfs.string("correlation"),
    cmdBaseTime: sfs.long(9007199254740999n),
  };
  const first = await f.game.execute("1001", "user.avatar.grant", params);
  const wire = decode(encode(first.body));
  expect(wire.owner).toEqual(sfs.string("1001"));
  expect(wire.sequence).toEqual(sfs.int(5));
  expect(wire.pendingHash).toEqual(sfs.string(""));
  expect(wire._cok_).toEqual(params._cok_);
  expect(wire.cmdBaseTime).toEqual(params.cmdBaseTime);
  expect(verifyGrant(wire.grant!.value as string, key, seconds)).toEqual({
    owner: "1001",
    seq: "5",
  });
  expect(first.pushes).toEqual([]);
  expect(f.profile).toEqual(before);
  expect(f.calls).toEqual([
    ["read", "1001", now],
    ["castle"],
    ["record"],
    ["http", `${origin}/_internal/avatars/1001/5`, "GET", "error"],
    ["find", "1001", "5"],
  ]);
  f.setPending();
  const second = await f.game.execute("1001", "user.avatar.grant", {});
  expect(second.body.pendingHash).toEqual(sfs.string(hash));
  expect(second.body.grant!.value).not.toBe(wire.grant!.value);
  expect(second.body.sequence).toEqual(sfs.int(5));
  expect(f.profile).toEqual(before);
  for (const command of ["user.avatar.finish", "user.update.picVer"])
    await expect(f.game.execute("1001", command, {})).rejects.toMatchObject({ code: "102192" });
});

test("eligibility preserves sequence, castle, cooldown and report-ban error precedence before HTTP", async () => {
  for (const [setup, expected, readers] of [
    [
      (f: ReturnType<typeof fixture>) => {
        f.profile.picVer = 1999999;
      },
      "E000000",
      [],
    ],
    [
      (f: ReturnType<typeof fixture>) => {
        f.setLevel(9);
        f.setRecord({ uid: "1001", updateTime: BigInt(now), banTime: BigInt(now + 1) });
      },
      "105775",
      ["castle"],
    ],
    [
      (f: ReturnType<typeof fixture>) => {
        f.setRecord({ uid: "1001", updateTime: BigInt(now), banTime: BigInt(now + 1) });
      },
      "105769",
      ["castle", "record"],
    ],
    [
      (f: ReturnType<typeof fixture>) => {
        f.setRecord({ uid: "1001", updateTime: BigInt(now - 60000), banTime: BigInt(now + 1) });
      },
      "105770",
      ["castle", "record"],
    ],
  ] as const) {
    const f = fixture();
    setup(f);
    await expect(f.game.execute("1001", "user.avatar.grant", {})).rejects.toMatchObject({
      code: expected,
    });
    expect(f.calls.slice(1).map((call) => call[0])).toEqual([...readers]);
  }
  const boundary = fixture();
  boundary.setRecord({ uid: "1001", updateTime: BigInt(now - 60000), banTime: BigInt(now) });
  expect((await boundary.game.execute("1001", "user.avatar.grant", {})).body.sequence).toEqual(
    sfs.int(5),
  );
  const bypass = fixture();
  bypass.game.rules.items.set("function_on5", { k2: "0" });
  bypass.game.rules.items.delete("hero");
  bypass.setLevel(0);
  bypass.setRecord({ uid: "1001", updateTime: BigInt(now), banTime: BigInt(now + 10000) });
  await bypass.game.execute("1001", "user.avatar.grant", {});
  expect(bypass.calls.some(([kind]) => kind === "castle" || kind === "record")).toBe(false);
});

test("authorization and invalid configuration cannot issue or inspect an avatar", async () => {
  for (const claimed of [sfs.string("other"), sfs.int(1001), sfs.null()]) {
    const f = fixture();
    await expect(
      f.game.execute("1001", "user.avatar.grant", { gameuid: claimed }),
    ).rejects.toMatchObject({ code: "E000000" });
    expect(f.calls).toEqual([]);
  }
  for (const patch of [
    { uid: "other" },
    { serverId: 2 },
    { banFlag: 1 },
    { banTime: BigInt(now + 1) },
    { picVer: null },
    { picVer: -1 },
  ]) {
    const f = fixture();
    Object.assign(f.profile, patch);
    await expect(f.game.execute("1001", "user.avatar.grant", {})).rejects.toMatchObject({
      code: "E000000",
    });
    expect(f.calls).toHaveLength(1);
  }
  const unavailable = fixture();
  unavailable.game.services.avatar = undefined;
  await expect(unavailable.game.execute("1001", "user.avatar.grant", {})).rejects.toMatchObject({
    code: "102192",
  });
  const missing = fixture();
  missing.service.read = async () => ({ profile: undefined });
  await expect(missing.game.execute("1001", "user.avatar.grant", {})).rejects.toMatchObject({
    code: "E100169",
  });
  const wrong = fixture();
  wrong.setRecord({ uid: "other", updateTime: 0n, banTime: 0n });
  await expect(wrong.game.execute("1001", "user.avatar.grant", {})).rejects.toMatchObject({
    code: "E000000",
  });
  for (const receipt of [
    { owner: "other", sequence: "5", hash },
    { owner: "1001", sequence: "6", hash },
    { owner: "1001", sequence: "5", hash: "invalid" },
  ]) {
    const f = fixture();
    f.service.find = async () => receipt;
    await expect(f.game.execute("1001", "user.avatar.grant", {})).rejects.toMatchObject({
      code: "E000000",
    });
  }
});

test("avatar rules retain encoded sequences, lazy config parsing and Java long arithmetic", () => {
  for (const [version, next] of [
    [0, 1],
    [999998, 999999],
    [1000000, 1],
    [2000042, 43],
    [2147483647, 483648],
  ])
    expect(avatarSequence(version)).toBe(next!);
  for (const version of [-1, null, 1.5, NaN, 999999, 1999999, 2147483648])
    expect(() => avatarSequence(version)).toThrow();
  expect(avatarMinimumLevel(rules("0", "invalid"))).toBeUndefined();
  expect(() => avatarMinimumLevel(rules("1", "＋1"))).toThrow();
  expect(avatarMinimumLevel(rules("1", "+１０"))).toBe(10);
  const missingFlag = rules();
  missingFlag.items.set("function_on5", {});
  expect(avatarMinimumLevel(missingFlag)).toBe(10);
  expect(() => avatarMinimumLevel(rules("1", "2147483648"))).toThrow();
  expect(() => avatarMinimumLevel(rules("1", " 10"))).toThrow();
  expect(() => checkAvatarRecord(rules("1", "10", "invalid"), undefined, now)).not.toThrow();
  const record = { uid: "1001", updateTime: BigInt(now - 60000), banTime: BigInt(now) };
  expect(() => checkAvatarRecord(rules("1", "10", "６０"), record, now)).not.toThrow();
  expect(() =>
    checkAvatarRecord(
      rules("1", "10", "9223372036854775807"),
      { ...record, updateTime: BigInt(now) },
      now,
    ),
  ).not.toThrow();
  expect(() => checkAvatarRecord(rules("1", "10", "9223372036854775808"), record, now)).toThrow();
  expect(() =>
    checkAvatarRecord(rules("1", "10", "0"), { ...record, updateTime: -9223372036854775808n }, now),
  ).toThrow("105769");
  expect(() =>
    checkAvatarRecord(rules(), { uid: "1001", updateTime: null, banTime: null }, now),
  ).not.toThrow();
});

test("grant and confirmation domains bind owner, sequence, secret and exact expiry", () => {
  const grant = issueAvatarGrant("001001", 999999, key, seconds);
  expect(verifyGrant(grant, key, seconds + 119)).toEqual({ owner: "001001", seq: "999999" });
  expect(() => verifyGrant(grant, key, seconds + 120)).toThrow();
  expect(() => verifyGrant(grant, key, seconds - 1)).toThrow();
  expect(() => verifyGrant(grant, Buffer.alloc(32, 3), seconds)).toThrow();
  expect(() => verifyGrant(grant.replace(".001001.", ".001002."), key, seconds)).toThrow();
  const confirmation = issueAvatarConfirmation("001001", 999999, key, seconds);
  expect(() =>
    verifyConfirmation(confirmation, "001001", "999999", key, seconds + 29),
  ).not.toThrow();
  for (const time of [seconds - 1, seconds + 30])
    expect(() => verifyConfirmation(confirmation, "001001", "999999", key, time)).toThrow();
  expect(() => verifyConfirmation(confirmation, "1001", "999999", key, seconds)).toThrow();
  expect(() => verifyConfirmation(confirmation, "001001", "999998", key, seconds)).toThrow();
  expect(() => verifyConfirmation(grant, "001001", "999999", key, seconds)).toThrow();
  expect(() => verifyGrant(confirmation, key, seconds)).toThrow();
  for (const owner of ["", "abc", "1".repeat(21), "1\n"])
    expect(() => issueAvatarGrant(owner, 1, key, seconds)).toThrow();
  for (const sequence of [0, 1000000, 1.5])
    expect(() => issueAvatarGrant("1001", sequence, key, seconds)).toThrow();
  expect(() => issueAvatarGrant("1001", 1, Buffer.alloc(31), seconds)).toThrow();
});

test("private receipt exchange rejects malformed or mismatched replies and bounds streaming/deadlines", async () => {
  const client = (
    fetch: (url: string, options: RequestInit) => Promise<Response>,
    timeoutMs = 1000,
  ) => createAvatarFiles({ origin, key, timeoutMs, now: () => now, fetch });
  for (const response of [
    new Response("private", { status: 503 }),
    new Response("", { status: 302 }),
    new Response("unknown", { status: 404 }),
    new Response(`v1\nother\n5\n${hash}\n`, { headers: { "content-type": "text/plain" } }),
    new Response(`v1\n1001\n6\n${hash}\n`, { headers: { "content-type": "text/plain" } }),
    new Response(`v1\n1001\n5\n${hash}\nextra`, { headers: { "content-type": "text/plain" } }),
    new Response(`v1\n1001\n5\n${hash}\n`, { headers: { "content-type": "application/json" } }),
  ])
    await expect(client(async () => response).find("1001", 5)).rejects.toThrow(
      "Avatar confirmation unavailable",
    );
  let cancelled = false;
  const oversized = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(Buffer.alloc(129));
    },
    cancel() {
      cancelled = true;
    },
  });
  await expect(
    client(async () => new Response(oversized, { headers: { "content-type": "text/plain" } })).find(
      "1001",
      5,
    ),
  ).rejects.toThrow();
  expect(cancelled).toBe(true);
  let signal: AbortSignal | null | undefined;
  await expect(
    client(async (_url, options) => {
      signal = options.signal;
      return new Promise(() => {});
    }, 100).find("1001", 5),
  ).rejects.toThrow();
  expect(signal?.aborted).toBe(true);
  let bodyCancelled = false;
  const stalled = new ReadableStream<Uint8Array>({
    cancel() {
      bodyCancelled = true;
    },
  });
  await expect(
    client(
      async () => new Response(stalled, { headers: { "content-type": "text/plain" } }),
      100,
    ).find("1001", 5),
  ).rejects.toThrow();
  expect(bodyCancelled).toBe(true);
  const copiedKey = Buffer.from(key);
  const stable = createAvatarFiles({ origin, key: copiedKey, timeoutMs: 1000, now: () => now });
  copiedKey.fill(0);
  expect(verifyGrant(stable.issue("1001", 1), key, seconds).owner).toBe("1001");
});

test("files configuration and protected key loading are optional, explicit and sanitized", async () => {
  const source = {
    DATABASE_URL: "postgres://synthetic:synthetic@invalid.example/global",
    GAME_LOGIN_SECRET: "synthetic",
    GAME_RESOURCES: "synthetic",
  };
  expect(
    (await Effect.runPromise(config.pipe(Effect.provideService(EnvironmentSource, source))))
      .avatarFiles,
  ).toBeUndefined();
  const folder = await mkdtemp(join(tmpdir(), "opencok-avatar-unit-"));
  const file = join(folder, "synthetic-key");
  try {
    await writeFile(file, key.toString("hex") + "\n", { mode: 0o600 });
    const loaded = await Effect.runPromise(
      config.pipe(
        Effect.provideService(EnvironmentSource, {
          ...source,
          GAME_FILES_URL: origin,
          FILES_SIGNING_KEY_FILE: file,
        }),
      ),
    );
    expect(loaded.avatarFiles).toEqual({ origin, keyFile: file });
    const files = await loadAvatarFiles({ origin, keyFile: file, timeoutMs: 1000 });
    expect(verifyGrant(files.issue("1001", 1), key).owner).toBe("1001");
    await writeFile(file, "synthetic-private-invalid");
    await expect(loadAvatarFiles({ origin, keyFile: file, timeoutMs: 1000 })).rejects.toThrow(
      "Avatar files unavailable",
    );
    await expect(
      loadAvatarFiles({ origin, keyFile: join(folder, "missing"), timeoutMs: 1000 }),
    ).rejects.toThrow("Avatar files unavailable");
  } finally {
    await rm(folder, { recursive: true, force: true });
  }
  for (const value of [
    "invalid",
    "file:///private",
    "http://u:p@files.internal",
    "http://files.internal/path",
    "http://files.internal/?private=x",
  ])
    expect(() => createAvatarFiles({ origin: value, key, timeoutMs: 1000 })).toThrow();
});
