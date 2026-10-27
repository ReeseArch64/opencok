import { expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { drizzle, type NodePgClient } from "drizzle-orm/node-postgres";
import * as schema from "@opencok/drizzle/schema/kingdom";
import { avatarSystemMail, javaMailBytes } from "@opencok/rules/avatar-mail";
import { avatarMailPush } from "@opencok/mappings/avatar-mail";
import { deliverAvatarMail } from "@opencok/repositories/avatar-mail";
import type { AvatarCompletionRecord, AvatarMailPlanner } from "@opencok/contracts/files";
import { decode, encode, sfs } from "@opencok/messages/sfs";
import vectors from "./fixtures/avatar-mail-encoding.json";

const time = 1792756800123n;
const hash = "a".repeat(64);
const stem = "b".repeat(32);
function completion(mail: Record<string, string> = {}): AvatarCompletionRecord {
  return {
    ownerUid: "1001",
    sequence: 5,
    hash,
    picVer: 5,
    committedAt: time,
    pendingEffects: 7,
    effects: JSON.stringify({
      version: 1,
      mail: {
        id: "10111",
        sender: " synthetic sender ",
        title: " synthetic title ",
        message: "first\\nsecond",
        type: "2",
        ...mail,
      },
      profile: { userName: "Synthetic", platform: "test", updatedAt: "1792756800" },
    }),
  };
}
function fixture(entry = completion()) {
  let state = {
    profile: ["1001", 1] as unknown[] | null,
    entry: { ...entry } as AvatarCompletionRecord | null,
    mails: new Map<string, Record<string, unknown>>(),
    extras: new Map<string, Record<string, unknown>>(),
    groups: new Map<string, Record<string, unknown>>(),
  };
  let working = structuredClone(state);
  const queries: { text: string; params: unknown[] }[] = [];
  let failure = "";
  const client = {
    query: async (statement: { text: string }, params: unknown[] = []) => {
      const text = statement.text;
      queries.push({ text, params });
      if (text.startsWith("begin")) {
        working = structuredClone(state);
        return { rows: [] };
      }
      if (text === "rollback") {return { rows: [] };}
      if (text === "commit") {
        if (failure === "commit") {throw new Error("Synthetic commit failure");}
        state = working;
        if (failure === "lost") {throw new Error("Synthetic lost response");}
        return { rows: [] };
      }
      const table = text.match(/(?:from|into|update) "opencok_kingdom"\."([^"]+)"/)?.[1];
      const op = `${text.split(" ")[0]}:${table}`;
      if (op === failure) {throw new Error("Synthetic database failure");}
      if (text.startsWith("select")) {
        if (table === "userprofile") {return { rows: working.profile ? [working.profile] : [] };}
        const e = working.entry;
        return {
          rows: e
            ? [
                [
                  e.ownerUid,
                  e.sequence,
                  e.hash,
                  e.picVer,
                  e.committedAt,
                  e.effects,
                  e.pendingEffects,
                  e.revision ?? 0n,
                ],
              ]
            : [],
        };
      }
      if (text.startsWith("insert")) {
        const columns = text
          .match(/\((.*?)\) values/)![1]!
          .split(", ")
          .map((name) => name.slice(1, -1));
        const row = Object.fromEntries(columns.map((name, index) => [name, params[index]]));
        const target =
          table === "mail"
            ? working.mails
            : table === "mail_contents"
              ? working.extras
              : working.groups;
        const id =
          String(row.uid) + (table === "mail_group" ? `:${row.groupType}:${row.groupIndex}` : "");
        if (target.has(id)) {throw new Error("Synthetic duplicate key");}
        target.set(id, row);
      }
      if (text.startsWith("update")) {
        expect(table).toBe("avatar_completion");
        expect(params.slice(1)).toEqual(["1001", 5, working.entry!.pendingEffects]);
        if (failure === "cas") {return { rows: [] };}
        working.entry!.pendingEffects = Number(params[0]);
        return { rows: [["1001"]] };
      }
      return { rows: [] };
    },
  };
  const db = drizzle(client as unknown as NodePgClient, { schema });
  return {
    db,
    queries,
    get state() {
      return state;
    },
    fail: (value: string) => {
      failure = value;
    },
    run: (plan: AvatarMailPlanner = avatarSystemMail) => deliverAvatarMail(db, 1, "1001", 5, plan),
  };
}

test("mail UTF-8 backing buffers match frozen synthetic Java 8 lengths and hashes", () => {
  expect(vectors).toHaveLength(57);
  for (const v of vectors) {
    const bytes = javaMailBytes(v.unit.repeat(v.count));
    expect(bytes?.length).toBe(v.length);
    expect(createHash("sha256").update(bytes!).digest("hex")).toBe(v.sha256);
  }
  for (const value of [undefined, "", " \t\n", "\u2003"]) {expect(javaMailBytes(value)).toBeNull();}
  expect(() => javaMailBytes("\ud800")).toThrow();
});

test("captured templates preserve notice selection, category, share wrapping and attachment handling", () => {
  const mail = avatarSystemMail(completion(), stem);
  expect(mail).toMatchObject({
    uid: stem + "00",
    owner: "1001",
    title: "synthetic title",
    fromName: "synthetic sender",
    type: 2,
    rewardStatus: 1,
    rewardId: null,
    reply: 0,
    createTime: time,
  });
  for (const type of ["", "0", "\t"])
    {expect(avatarSystemMail(completion({ type }), stem).type).toBe(15);}
  expect(avatarSystemMail(completion({ type: " 0 " }), stem).type).toBe(2);
  for (const [category, suffix] of [
    ["AB", "AB"],
    ["A ", "A"],
    [" ", "00"],
    ["long", "00"],
    ["😀", "😀"],
  ])
    {expect(avatarSystemMail(completion({ category: category! }), stem).uid).toBe(stem + suffix);}
  expect(avatarSystemMail(completion({ share: "2147483647" }), stem).reply).toBe(-2);
  expect(avatarSystemMail(completion({ share: "-2147483648" }), stem).reply).toBe(0);
  expect(() => avatarSystemMail(completion({ share: "＋1" }), stem)).toThrow();
  expect(avatarSystemMail(completion({ share: "+１" }), stem).reply).toBe(2);
});

test("literal rewards retain their bytes and symbolic reward IDs require an explicit resolver", () => {
  const literal = avatarSystemMail(completion({ reward: " wood,0,10 " }), stem);
  expect(literal.rewardStatus).toBe(0);
  expect(literal.rewardId).toBe(new TextDecoder().decode(javaMailBytes(" wood,0,10 ")!));
  expect(() => avatarSystemMail(completion({ reward: "symbolic" }), stem)).toThrow();
  let requested: unknown;
  const resolved = avatarSystemMail(completion({ reward: "symbolic" }), stem, (id, owner) => {
    requested = [id, owner];
    return "food,0,5";
  });
  expect(requested).toEqual(["symbolic", "1001"]);
  expect(resolved.rewardStatus).toBe(0);
  expect(avatarSystemMail(completion({ reward: "symbolic" }), stem, () => null).rewardStatus).toBe(
    1,
  );
  expect(() => avatarSystemMail(completion({ share: "2147483648" }), stem)).toThrow();
});

test("extra content follows encoded capacity rather than UTF-8 payload length", () => {
  expect(avatarSystemMail(completion({ message: "x".repeat(36363) }), stem).extra).toBeNull();
  const extra = avatarSystemMail(completion({ message: "x".repeat(36364) }), stem);
  expect(extra.extra).toBeNull();
  expect(extra.contents.length).toBe(40000);
  expect(
    avatarSystemMail(completion({ message: "x".repeat(36365) }), stem).extra?.length,
  ).toBeGreaterThan(40000);
  expect(avatarSystemMail(completion({ message: "MAILTEST" }), stem).extra).not.toBeNull();
  expect(avatarSystemMail(completion({ message: " MAILTEST " }), stem).extra).toBeNull();
});

test("mail push projection preserves exact fields and optional full metadata", () => {
  const mail = avatarSystemMail(completion({ share: "2" }), stem);
  const minimal = decode(encode(avatarMailPush(mail, false)));
  expect(minimal).toEqual({
    title: sfs.string("synthetic title"),
    rewardId: sfs.string(""),
    uid: sfs.string(stem + "00"),
    type: sfs.int(2),
    createTime: sfs.long(time),
    itemIdFlag: sfs.int(1),
    fromUid: sfs.string(""),
    fromName: sfs.string("synthetic sender"),
    oldName: sfs.string("synthetic sender"),
    unread: sfs.int(1),
    totalNum: sfs.int(1),
  });
  const full = decode(encode(avatarMailPush(mail, true)));
  expect(full.contentsLocal).toEqual(sfs.string("first\nsecond"));
  expect(full.reply).toEqual(sfs.int(4));
  expect(full.rewardStatus).toEqual(sfs.int(1));
  expect(full.status).toEqual(sfs.int(0));
  expect(full.toUser).toEqual(sfs.string("1001"));
  expect(full.contents).toBeUndefined();
  const notice = avatarMailPush(avatarSystemMail(completion({ type: "0" }), stem), true);
  expect(notice.unread).toBeUndefined();
  expect(notice.totalNum).toBeUndefined();
});

test("owned delivery commits message and UID group with only the mail bit acknowledged", async () => {
  const f = fixture();
  const original = structuredClone(f.state.entry!);
  const result = await f.run();
  expect(result.mail?.uid).toMatch(/^[a-f0-9]{32}00$/);
  expect(f.state.mails.size).toBe(1);
  expect(f.state.groups.size).toBe(1);
  expect(f.state.extras.size).toBe(0);
  expect(f.state.entry).toEqual({ ...original, pendingEffects: 6 });
  const stored = [...f.state.mails.values()][0]!;
  expect(stored).toMatchObject({
    uid: result.mail!.uid,
    toUser: "1001",
    fromUser: null,
    itemIdFlag: 1,
    status: 0,
    saveFlag: 0,
    createTime: time,
    rewardStatus: 1,
    translationId: null,
  });
  expect([...f.state.groups.values()][0]).toEqual({
    uid: "1001",
    groupType: 2,
    groupIndex: result.mail!.uid,
    updateTime: time,
  });
  expect(f.queries[0]!.text).toBe("begin isolation level read committed read write");
  expect(f.queries[1]!.text).toEndWith("limit $2 for update");
  expect(f.queries[1]!.params).toEqual(["1001", 1]);
  expect(f.queries[2]!.text).toEndWith("limit $3 for update");
  expect(f.queries[2]!.params).toEqual(["1001", 5, 1]);
  expect(f.queries.map((q) => q.text).join("\n")).not.toMatch(
    /delete |mail_update|reward_log|"gold"/,
  );
});

test("notice mail skips groups, extra content remains owned, and all other effect bits survive", async () => {
  const f = fixture(completion({ type: "0", message: "MAILTEST" }));
  f.state.entry!.pendingEffects = 5;
  const result = await f.run();
  expect(f.state.groups.size).toBe(0);
  expect(f.state.extras.size).toBe(1);
  expect(f.state.entry!.pendingEffects).toBe(4);
  expect([...f.state.extras.values()][0]).toMatchObject({ uid: result.mail!.uid, toUser: "1001" });
  expect(Buffer.from([...f.state.mails.values()][0]!.contents as Uint8Array).toString()).toBe(
    "extra",
  );
});

test("retries, lost commit responses and deletion after delivery never duplicate or resurrect mail", async () => {
  const f = fixture();
  f.fail("lost");
  await expect(f.run()).rejects.toThrow();
  expect(f.state.mails.size).toBe(1);
  expect(f.state.entry!.pendingEffects).toBe(6);
  f.fail("");
  expect((await f.run()).mail).toBeUndefined();
  expect(f.state.mails.size).toBe(1);
  f.state.mails.clear();
  f.state.groups.clear();
  expect((await f.run()).mail).toBeUndefined();
  expect(f.state.mails.size).toBe(0);
  expect(f.state.entry).not.toBeNull();
});

test("all local failures and collisions roll back mail, extra data, groups and acknowledgment", async () => {
  for (const failure of [
    "select:userprofile",
    "select:avatar_completion",
    "insert:mail_contents",
    "insert:mail",
    "insert:mail_group",
    "update:avatar_completion",
    "cas",
    "commit",
  ]) {
    const f = fixture(completion({ message: "MAILTEST" }));
    const before = structuredClone(f.state);
    f.fail(failure);
    await expect(f.run()).rejects.toThrow();
    expect(f.state).toEqual(before);
    expect(f.queries.at(-1)!.text).toBe("rollback");
  }
  const collision = fixture();
  const id =
    createHash("sha256").update(`avatar-mail\n1001\n5\n${hash}`).digest("hex").slice(0, 32) + "00";
  collision.state.mails.set(id, { uid: id, toUser: "another-owner" });
  await expect(collision.run()).rejects.toThrow();
  expect(collision.state.mails.get(id)!.toUser).toBe("another-owner");
  expect(collision.state.entry!.pendingEffects).toBe(7);
});

test("foreign or missing owners and invalid intents cannot deliver messages", async () => {
  for (const profile of [null, ["other", 1], ["1001", 2]]) {
    const f = fixture();
    f.state.profile = profile;
    expect((await f.run()).mail).toBeUndefined();
    expect(f.queries).toHaveLength(3);
    expect(f.state.entry!.pendingEffects).toBe(7);
  }
  for (const patch of [
    { ownerUid: "other" },
    { sequence: 6 },
    { hash: "invalid" },
    { pendingEffects: 8 },
    { effects: "invalid" },
    { picVer: 2000005 },
  ]) {
    const f = fixture();
    Object.assign(f.state.entry!, patch);
    await expect(f.run()).rejects.toThrow();
    expect(f.state.mails.size).toBe(0);
  }
  const f = fixture();
  for (const owner of ["", "other", "1".repeat(21)])
    {expect(() => deliverAvatarMail(f.db, 1, owner, 5, avatarSystemMail)).toThrow();}
  expect(f.queries).toEqual([]);
  for (const template of [
    { title: "x".repeat(256) },
    { sender: "x".repeat(101) },
    { message: "\ud800" },
    { message: "" },
    { share: "invalid" },
  ] as Record<string, string>[])
    {expect(() => avatarSystemMail(completion(template), stem)).toThrow();}
});

test("delivery validates plans and clears exactly bit one for every pending combination", async () => {
  for (const bits of [1, 3, 5, 7]) {
    const f = fixture();
    f.state.entry!.pendingEffects = bits;
    await f.run();
    expect(f.state.entry!.pendingEffects).toBe(bits & ~1);
  }
  for (const patch of [
    { owner: "other" },
    { uid: "wrong" },
    { type: 3 },
    { createTime: time + 1n },
    { reply: 2147483648 },
  ]) {
    const f = fixture();
    await expect(
      f.run(
        (entry, id) =>
          ({ ...avatarSystemMail(entry, id), ...patch }) as ReturnType<typeof avatarSystemMail>,
      ),
    ).rejects.toThrow();
    expect(f.state.mails.size).toBe(0);
    expect(f.state.entry!.pendingEffects).toBe(7);
  }
});
