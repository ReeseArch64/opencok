import { expect, test } from "bun:test";
import { Effect } from "effect";
import { EnvironmentSource } from "@opencok/env/effect";
import { GameService as Game } from "@opencok/services/game";
import { Rules, type Rule } from "@opencok/rules/game";
import { avatarSequence, avatarMinimumLevel, checkAvatarRecord } from "@opencok/rules/avatar";
import { createAvatarFiles } from "@opencok/connection/avatar-files";
import { createAvatarTickets } from "@opencok/storage/avatar-tickets";
import { s3Client, S3ImageStore } from "@opencok/storage/images";
import { createHandler } from "@opencok/api/files";
import { sfs, decode, encode } from "@opencok/messages/sfs";
import type { GameStore } from "@opencok/contracts/game";
import type { AvatarGrantService, ImageStore } from "@opencok/contracts/files";
import type { Row } from "@opencok/contracts/rows";
import { config } from "../src/config";

const now = 1792756800123;
function ticketFixture(clock = () => now) {
  const records = new Map<string, string>();
  return createAvatarTickets(async (name, ...args) => {
    if (name === "SET") {
      records.set(args[0]!, args[1]!);
      return "OK";
    }
    return records.get(args[0]!) ?? null;
  }, clock);
}
const imageStore = new S3ImageStore(
  s3Client({
    endpoint: "http://s3.internal",
    region: "us-east-1",
    forcePathStyle: true,
    credentials: { accessKeyId: "synthetic", secretAccessKey: "synthetic-secret" },
  }),
  "images",
);
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
  const tickets = ticketFixture();
  const store: ImageStore = {
    image: (key) => imageStore.image(key),
    put: unused,
    removePrevious: unused,
    get: unused,
    find: async (owner, sequence) => {
      calls.push(["find", owner, sequence]);
      return pending ? { owner, sequence, hash } : null;
    },
  };
  const handler = createHandler(store, tickets);
  const files = createAvatarFiles({
    origin,
    tickets,
    timeoutMs: 1000,
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
    tickets,
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
  expect(await f.tickets.verify(wire.grant!.value as string, "upload")).toEqual({
    owner: "1001",
    seq: "5",
  });
  expect(wire.uploadPath).toEqual(
    sfs.string(`/gameservice/www/gateway/json.php?grant=${wire.grant!.value}`),
  );
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
    {await expect(f.game.execute("1001", command, {})).rejects.toMatchObject({ code: "102192" });}
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
    { picVer: -2147483649 },
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
    [-2147483648, 1],
    [-1, 1],
    [999998, 999999],
    [1000000, 1],
    [2000042, 43],
    [2147483647, 483648],
  ])
    {expect(avatarSequence(version)).toBe(next!);}
  for (const version of [-2147483649, null, 1.5, NaN, 999999, 1999999, 2147483648])
    {expect(() => avatarSequence(version)).toThrow();}
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

test("Redis authorization binds purpose, owner, sequence and exact expiry without a signing key", async () => {
  let time = now;
  const tickets = ticketFixture(() => time);
  const token = await tickets.issue("001001", 999999, "upload");
  expect(token).toMatch(/^v2\.[a-f0-9]{64}$/);
  expect(await tickets.verify(token, "upload")).toEqual({ owner: "001001", seq: "999999" });
  await expect(tickets.verify(token, "confirm")).rejects.toThrow();
  await expect(tickets.verify(token + "a", "upload")).rejects.toThrow();
  const confirmation = await tickets.issue("1001", 5, "confirm");
  time += 29999;
  expect(await tickets.verify(confirmation, "confirm")).toEqual({ owner: "1001", seq: "5" });
  time++;
  await expect(tickets.verify(confirmation, "confirm")).rejects.toThrow();
  time = now + 119999;
  expect(await tickets.verify(token, "upload")).toEqual({ owner: "001001", seq: "999999" });
  time++;
  await expect(tickets.verify(token, "upload")).rejects.toThrow();
  for (const owner of ["", "abc", "1".repeat(21), "1\n"])
    {await expect(tickets.issue(owner, 1, "upload")).rejects.toThrow();}
  for (const sequence of [0, 1000000, 1.5])
    {await expect(tickets.issue("1001", sequence, "upload")).rejects.toThrow();}
});

test("private receipt exchange rejects malformed or mismatched replies and bounds streaming/deadlines", async () => {
  const client = (
    fetch: (url: string, options: RequestInit) => Promise<Response>,
    timeoutMs = 1000,
  ) => createAvatarFiles({ origin, tickets: ticketFixture(), timeoutMs, fetch });
  for (const response of [
    new Response("private", { status: 503 }),
    new Response("", { status: 302 }),
    new Response("unknown", { status: 404 }),
    new Response(`v1\nother\n5\n${hash}\n`, { headers: { "content-type": "text/plain" } }),
    new Response(`v1\n1001\n6\n${hash}\n`, { headers: { "content-type": "text/plain" } }),
    new Response(`v1\n1001\n5\n${hash}\nextra`, { headers: { "content-type": "text/plain" } }),
    new Response(`v1\n1001\n5\n${hash}\n`, { headers: { "content-type": "application/json" } }),
  ])
    {await expect(client(async () => response).find("1001", 5)).rejects.toThrow(
      "Avatar files unavailable",
    );}
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
});

test("files configuration needs only a private API origin and no signing-key file", async () => {
  const source = {
    DATABASE_URL: "postgres://synthetic:synthetic@invalid.example/global",
    GAME_SECRET: "synthetic",
  };
  expect(
    (await Effect.runPromise(config.pipe(Effect.provideService(EnvironmentSource, source))))
      .avatarFiles,
  ).toBeUndefined();
  expect(
    (
      await Effect.runPromise(
        config.pipe(Effect.provideService(EnvironmentSource, { ...source, API_URL: origin })),
      )
    ).avatarFiles,
  ).toEqual({ origin });
  for (const value of [
    "invalid",
    "file:///private",
    "http://u:p@files.internal",
    "http://files.internal/path",
    "http://files.internal/?private=x",
  ])
    {expect(() =>
      createAvatarFiles({ origin: value, tickets: ticketFixture(), timeoutMs: 1000 }),
    ).toThrow();}
});

test("authenticated avatar URL renewal signs current realm profiles without upload eligibility checks", async () => {
  const f = fixture();
  const profiles = new Map<string, Row>([
    ["1001", f.profile],
    ["1002", { ...f.profile, uid: "1002", picVer: 2999999 }],
  ]);
  const db = { getProfileById: async (uid: string) => profiles.get(uid) } as GameStore;
  const game = new Game(db, rules(), { kingdomId: 1 }, () => now, { avatar: f.service });
  for (const target of ["1001", "1002"]) {
    const response = await game.execute("1001", "user.avatar.url", { gameuid: sfs.string(target) });
    const url = new URL(response.body.path!.value as string, "http://localhost");
    expect(url.searchParams.get("X-Amz-Algorithm")).toBe("AWS4-HMAC-SHA256");
    expect(response.body.owner).toEqual(sfs.string(target));
    expect(url.pathname).toContain(target.slice(-6));
    expect(url.searchParams.get("X-Amz-Expires")).toBe("300");
  }
  f.profile.picVer = 0;
  expect((await game.execute("1001", "user.avatar.url", {})).body.path).toEqual(sfs.string(""));
  for (const target of [sfs.int(1002), sfs.string("missing")])
    {await expect(game.execute("1001", "user.avatar.url", { gameuid: target })).rejects.toThrow();}
  profiles.get("1002")!.serverId = 2;
  await expect(
    game.execute("1001", "user.avatar.url", { gameuid: sfs.string("1002") }),
  ).rejects.toThrow();
  profiles.get("1001")!.banFlag = 1;
  await expect(game.execute("1001", "user.avatar.url", {})).rejects.toThrow();
  expect(f.calls.some(([name]) => ["read", "castle", "record"].includes(String(name)))).toBe(false);
});
