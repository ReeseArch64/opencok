import { expect, test } from "bun:test";
import { drizzle, type NodePgClient } from "drizzle-orm/node-postgres";
import * as schema from "@opencok/drizzle/schema/kingdom";
import { Rules, type Rule } from "@opencok/rules/game";
import { GameService as Game } from "@opencok/services/game";
import type { GameStore } from "@opencok/contracts/game";
import type { AvatarProfileUpdate } from "@opencok/contracts/files";
import { sfs, encode, decode, type Fields } from "@opencok/messages/sfs";
import { createRealmNotifications } from "@opencok/connection/notifications";
import { createChatAvatarProfileHandler } from "@opencok/controllers/chat-avatar-profile";
import {
  checkAvatarCompletionStore,
  nextAvatarDelivery,
} from "@opencok/repositories/avatar-delivery";
import type { IncomingMessage, ServerResponse } from "node:http";
import { createAvatarRuntime } from "../src/avatar.ts";
import { Effect } from "effect";
import { EnvironmentSource } from "@opencok/env/effect";
import { config } from "../src/config.ts";

const now = 1792756800123,
  hash = "a".repeat(64),
  secret = "synthetic-chat-secret";
const template = {
  id: "10111",
  sender: "Synthetic sender",
  title: "Synthetic title",
  message: "Synthetic message",
  type: "2",
};
function fixture(mode = "1", chatEnabled = true) {
  let state = {
    profile: ["1001", 1, "0", 0, 1000004, "Synthetic Name", "synthetic"] as unknown[] | null,
    record: null as unknown[] | null,
    completions: [] as unknown[][],
    mail: [] as unknown[][],
    groups: [] as unknown[][],
    extra: [] as unknown[][],
  };
  let working = structuredClone(state),
    transaction = false;
  let failure = "";
  const queries: { text: string; params: unknown[] }[] = [];
  const reports: string[] = [],
    markers: string[] = [],
    chat: AvatarProfileUpdate[] = [],
    pushes: { owner: string; command: string; body: Fields }[] = [];
  const client = {
    query: async (query: { text: string }, params: unknown[] = []) => {
      const text = query.text;
      queries.push({ text, params });
      if (text.includes("insert into opencok_kingdom.avatar_publication"))
        return { rows: [{ revision: "1" }] };
      if (text.startsWith("begin")) {
        expect(transaction).toBe(false);
        working = structuredClone(state);
        transaction = true;
        return { rows: [] };
      }
      if (text === "rollback") {
        transaction = false;
        return { rows: [] };
      }
      if (text === "commit") {
        transaction = false;
        if (failure === "commit") throw new Error("Synthetic failure");
        state = working;
        if (failure === "lost-completion" && state.completions.length) {
          failure = "";
          throw new Error("Synthetic lost commit reply");
        }
        return { rows: [] };
      }
      const source = transaction ? working : state;
      if (text.startsWith("select")) {
        if (params.length === 1 && params[0] === 0) return { rows: [] };
        if (text.includes("inner join")) {
          expect(text).toContain('"pendingEffects" > $1');
          expect(params[0]).toBe(0);
          expect(params[1]).toBe(1);
          expect(text).toContain(
            'order by "opencok_kingdom"."avatar_completion"."ownerUid" asc, "opencok_kingdom"."avatar_completion"."sequence" asc limit',
          );
          const rows = source.completions.filter(
            (r) => Number(r[6]) > 0 && source.profile?.[1] === 1,
          );
          return {
            rows: rows
              .filter(
                (r) =>
                  params.length === 3 ||
                  String(r[0]) > String(params[2]) ||
                  (r[0] === params[3] && Number(r[1]) > Number(params[4])),
              )
              .slice(0, 1)
              .map((r) => r.slice(0, 2)),
          };
        }
        if (text.includes('"userprofile"'))
          return {
            rows: source.profile
              ? [text.includes('"banTime"') ? source.profile : source.profile.slice(0, 2)]
              : [],
          };
        if (text.includes('"user_building"')) return { rows: [["1001", 10]] };
        if (text.includes('"pic_upload_record"'))
          return {
            rows: source.record ? [[source.record[0], source.record[2], source.record[5]]] : [],
          };
        if (text.includes('"pendingEffects" >'))
          return { rows: source.completions.filter((r) => Number(r[6]) > 0).map((r) => [r[1]]) };
        const rows = source.completions.filter((r) => r[0] === params[0] && r[1] === params[1]);
        return { rows: text.includes('"effects"') ? rows : rows.map((r) => r.slice(0, 3)) };
      }
      if (text.startsWith('update "opencok_kingdom"."userprofile"')) {
        expect(params.slice(1)).toEqual(["1001", 1, source.profile![4]]);
        source.profile![4] = params[0];
        return { rows: [["1001"]] };
      }
      if (text.startsWith('update "opencok_kingdom"."avatar_completion"')) {
        const row = source.completions.find((r) => r[0] === params[1] && r[1] === params[2])!;
        expect(params[3]).toBe(row[6]);
        row[6] = params[0];
        return { rows: [["1001"]] };
      }
      expect(text.startsWith("insert")).toBe(true);
      if (text.includes('"avatar_completion"'))
        source.completions.push(
          params.length >= 8 ? params.slice(0, 8) : [...params.slice(0, 7), "0"],
        );
      else if (text.includes('"pic_upload_record"')) source.record = params.slice(0, 7);
      else if (text.includes('"mail_group"')) source.groups.push(params);
      else if (text.includes('"mail_contents"')) source.extra.push(params);
      else if (text.includes('"mail"')) {
        if (failure === "mail") throw new Error("private mail failure");
        source.mail.push(params);
      } else throw new Error("Unexpected write");
      return { rows: [] };
    },
  };
  const db = drizzle(client as unknown as NodePgClient, { schema });
  const rules = new Rules(
    new Map(),
    new Map(),
    new Map(),
    undefined,
    new Map<string, Rule>([
      ["function_on5", { k2: mode }],
      ["hero", { k9: "10", k7: "60" }],
      ["chat_switch", { k3: "0|1|2" }],
    ]),
  );
  rules.mail.set("10111", { ...template });
  const notifications = createRealmNotifications();
  notifications.subscribe("1001", async (command, body) => {
    pushes.push({ owner: "1001", command, body: decode(encode(body)) });
    return true;
  });
  const receiver = createChatAvatarProfileHandler({
    signingSecret: secret,
    now: () => now,
    profiles: {
      find: async () => null,
      publish: async (update) => {
        chat.push({ ...update });
        return "applied";
      },
    },
  });
  let candidate = { owner: "1001", sequence: "5", hash };
  const runtime = createAvatarRuntime({
    db: { kingdom: { db } },
    rules,
    files: { issue: () => "unused", image: () => "unused", find: async () => candidate },
    config: {
      kingdomId: 1,
      timeoutMs: 1000,
      avatarChat: chatEnabled
        ? { url: "http://chat.internal/_internal/avatar-profile", signingSecret: secret }
        : undefined,
    },
    cache: {
      publishPlayerUpdateTime: async (owner, time) => {
        expect(owner).toBe("1001");
        if (failure === "cache") throw new Error("private cache failure");
        markers.push(time);
      },
    },
    notifications,
    report: (effect) => reports.push(effect),
    now: () => now,
    fetch: async (_, options) => {
      if (failure === "chat") throw new Error("private chat failure");
      let status = 0,
        body = "";
      await receiver(
        {
          headers: options.headers,
          async *[Symbol.asyncIterator]() {
            yield Buffer.from(String(options.body));
          },
        } as unknown as IncomingMessage,
        {
          writeHead(code: number) {
            status = code;
          },
          end(value: string) {
            body = value;
          },
        } as unknown as ServerResponse,
      );
      return new Response(body, { status, headers: { "content-type": "application/json" } });
    },
  });
  const game = new Game({} as GameStore, rules, { kingdomId: 1 }, () => now, {
    avatarFinish: runtime.service,
  });
  return {
    db,
    game,
    runtime,
    rules,
    markers,
    chat,
    reports,
    pushes,
    queries,
    notifications,
    get state() {
      return state;
    },
    fail(value: string) {
      failure = value;
    },
    setCandidate(value: typeof candidate) {
      candidate = value;
    },
    run: (params: Fields = {}) =>
      game.execute("1001", "user.avatar.finish", { receipt: sfs.string(`5:${hash}`), ...params }),
  };
}

test("finish without configured chat delivers local effects and retains pending chat publication", async () => {
  const f = fixture("1", false);
  const result = await f.run();
  expect(result.body.picVer).toEqual(sfs.int(5));
  expect(f.state.completions[0]![6]).toBe(4);
  expect(f.markers).toHaveLength(1);
  expect(f.state.mail).toHaveLength(1);
  expect(f.chat).toHaveLength(0);
  expect(f.reports).toEqual([]);
  await f.runtime.service.deliver("1001", 5);
  expect(f.state.completions[0]![6]).toBe(4);
  expect(f.markers).toHaveLength(1);
  expect(f.state.mail).toHaveLength(1);
});

test("finish command commits and delivers mail, cache and chat through production composition", async () => {
  const f = fixture();
  const result = await f.run({ _cok_: sfs.int(9), cmdBaseTime: sfs.string("client-time") });
  expect(decode(encode(result.body))).toEqual({
    uid: sfs.string("1001"),
    picVer: sfs.int(5),
    superseded: sfs.bool(false),
    _cok_: sfs.int(9),
    cmdBaseTime: sfs.string("client-time"),
  });
  expect(result.pushes).toEqual([
    {
      command: "push.picVer.update",
      body: { uid: sfs.string("1001"), picVer: sfs.int(5), superseded: sfs.bool(false) },
    },
  ]);
  expect(f.state.profile![4]).toBe(5);
  expect(f.state.completions[0]![6]).toBe(0);
  expect(f.state.mail).toHaveLength(1);
  expect(f.state.groups).toHaveLength(1);
  expect(f.markers).toEqual(["1792756800"]);
  expect(f.chat[0]?.userName).toBe("Synthetic Name");
  expect(f.pushes).toHaveLength(1);
  expect(f.pushes[0]!.command).toBe("push.mail");
  expect(f.pushes[0]!.body.contentsLocal).toEqual(sfs.string("Synthetic message"));
  expect(f.pushes[0]!.body._cok_).toBeUndefined();
  expect(f.reports).toEqual([]);
  await f.run();
  expect(f.state.mail).toHaveLength(1);
  expect(f.pushes).toHaveLength(1);
  expect(f.chat).toHaveLength(1);
  expect(await f.runtime.next()).toBeUndefined();
});

test("committed completion succeeds despite each independent delivery failure and the relay can retry", async () => {
  for (const [failure, pending] of [
    ["mail", 1],
    ["cache", 2],
    ["chat", 4],
  ] as const) {
    const f = fixture();
    f.fail(failure);
    const result = await f.run();
    expect(result.body.picVer).toEqual(sfs.int(5));
    expect(result.pushes[0]!.command).toBe("push.picVer.update");
    expect(f.state.completions[0]![6]).toBe(pending);
    expect(f.reports).toEqual([failure === "cache" ? "profile" : failure]);
    const key = await f.runtime.next();
    expect(key).toEqual({ owner: "1001", sequence: 5 });
    expect(await f.runtime.next(key)).toBeUndefined();
    f.fail("");
    await f.runtime.service.deliver(key!.owner, key!.sequence);
    expect(f.state.completions[0]![6]).toBe(0);
    expect(f.state.mail).toHaveLength(1);
    expect(f.pushes).toHaveLength(1);
  }
});

test("invalid owner, receipt, profile and unmaterializable mail never commit an avatar", async () => {
  for (const params of [
    { receipt: sfs.int(5) },
    { receipt: sfs.string(`05:${hash}`) },
    { gameuid: sfs.string("1002") },
    { receipt: sfs.string(`5:${"b".repeat(64)}`) },
  ] as Fields[]) {
    const f = fixture();
    await expect(f.run(params)).rejects.toThrow();
    expect(f.state.profile![4]).toBe(1000004);
    expect(f.state.completions).toEqual([]);
    expect(f.pushes).toEqual([]);
  }
  for (const [column, value] of [
    [0, "other"],
    [1, 2],
    [2, String(now + 1)],
    [3, 1],
  ] as const) {
    const f = fixture();
    f.state.profile![column] = value;
    await expect(f.run()).rejects.toThrow();
    expect(f.state.completions).toEqual([]);
  }
  for (const patch of [
    { reward: "symbolic-id" },
    { message: "" },
    { share: "invalid" },
  ] as Rule[]) {
    const f = fixture();
    f.rules.mail.set("10111", { ...template, ...patch });
    await expect(f.run()).rejects.toThrow();
    expect(f.state.profile![4]).toBe(1000004);
    expect(f.state.completions).toEqual([]);
  }
});

test("bypass and verified superseded receipts preserve typed legacy responses without duplicate mail", async () => {
  const bypass = fixture("0");
  expect((await bypass.run()).body.picVer).toEqual(sfs.int(2000005));
  expect(bypass.state.mail).toEqual([]);
  expect(bypass.markers).toHaveLength(1);
  expect(bypass.chat).toHaveLength(1);
  const older = fixture();
  await older.run();
  older.state.profile![4] = 3000006;
  const result = await older.run();
  expect(result.body.picVer).toEqual(sfs.int(3000006));
  expect(result.body.superseded).toEqual(sfs.bool(true));
  expect(older.state.mail).toHaveLength(1);
  const observed = fixture();
  observed.state.profile![4] = 3000005;
  expect((await observed.run()).body.picVer).toEqual(sfs.int(3000005));
  expect(observed.state.completions[0]![6]).toBe(0);
  expect(observed.state.mail).toEqual([]);
});

test("mail notifications are best effort and the exact full-field switch is honored", async () => {
  for (const [flag, full] of [
    ["1", true],
    ["0|1|2", true],
    [" 1", false],
    ["10", false],
    ["", false],
  ] as const) {
    const f = fixture();
    f.rules.items.set("chat_switch", { k3: flag });
    await f.run();
    expect(f.pushes[0]!.body.contentsLocal !== undefined).toBe(full);
  }
  const f = fixture();
  f.notifications.subscribe("1001", async () => {
    throw new Error("Synthetic disconnect");
  });
  await f.run();
  expect(f.state.mail).toHaveLength(1);
  expect(f.state.completions[0]![6]).toBe(0);
  await f.runtime.service.deliver("1001", 5);
  expect(f.state.mail).toHaveLength(1);
});

test("readiness only inspects maintained tables and the pending selector rejects invalid routing", async () => {
  const f = fixture();
  await checkAvatarCompletionStore(f.db);
  expect(f.queries).toHaveLength(4);
  expect(f.queries.every((q) => q.text.startsWith("select") && q.params[0] === 0)).toBe(true);
  for (const cursor of [
    { owner: "other", sequence: 5 },
    { owner: "1001", sequence: 0 },
    { owner: "1001", sequence: 1000000 },
  ])
    await expect(nextAvatarDelivery(f.db, 1, cursor)).rejects.toThrow();
  await expect(nextAvatarDelivery(f.db, 0)).rejects.toThrow();
  expect(f.queries).toHaveLength(4);
});

test("runtime configuration loads media independently of optional avatar chat", async () => {
  const base = {
    DATABASE_URL: "postgres://synthetic:synthetic@invalid.example/global",
    GAME_SECRET: "synthetic",
    GAME_RESOURCES: "synthetic",
    GAME_FILES_URL: "http://files.internal",
    GAME_AVATAR_CHAT_URL: "http://chat.internal/_internal/avatar-profile",
    CHAT_SECRET: secret,
  };
  const result = await Effect.runPromise(
    config.pipe(Effect.provideService(EnvironmentSource, base)),
  );
  expect(result.avatarChat).toEqual({ url: base.GAME_AVATAR_CHAT_URL, signingSecret: secret });
  expect(result.avatarFiles).toEqual({
    origin: base.GAME_FILES_URL,
  });
  const withoutChat = await Effect.runPromise(
    config.pipe(
      Effect.provideService(EnvironmentSource, {
        ...base,
        GAME_AVATAR_CHAT_URL: "",
        CHAT_SECRET: "",
      }),
    ),
  );
  expect(withoutChat.avatarFiles).toEqual(result.avatarFiles);
  expect(withoutChat.avatarChat).toBeUndefined();
});

test("uncertain completion commit recovers existing receipt without repeating mutation", async () => {
  const f = fixture();
  f.fail("lost-completion");
  expect((await f.run()).body.picVer).toEqual(sfs.int(5));
  expect(f.state.completions).toHaveLength(1);
  expect(f.state.completions[0]![6]).toBe(0);
  expect(
    f.queries.filter((q) => q.text.startsWith('update "opencok_kingdom"."userprofile"')),
  ).toHaveLength(1);
  expect(f.state.mail).toHaveLength(1);
  expect(f.pushes).toHaveLength(1);
  const failed = fixture();
  failed.fail("commit");
  await expect(failed.run()).rejects.toThrow();
  expect(failed.state.completions).toEqual([]);
  expect(failed.state.profile![4]).toBe(1000004);
  expect(
    failed.queries.filter((q) => q.text.startsWith('update "opencok_kingdom"."userprofile"')),
  ).toHaveLength(1);
});
