import { expect, test } from "bun:test";
import { drizzle, type NodePgClient } from "drizzle-orm/node-postgres";
import * as schema from "@opencok/drizzle/schema/kingdom";
import { deleteMail } from "@opencok/repositories/mail-delete";
import { mailDeleteQuery } from "@opencok/rules/mail";
import { planMailDeletion } from "@opencok/controllers/mail-delete";

const now = 1792756800000;
const plan = (entries: Parameters<typeof planMailDeletion>[1]) => planMailDeletion("self", entries);
interface MailRow {
  uid: string;
  owner: string;
  type: number;
  from: string | null;
  saved: number | null;
  reward: number;
  time: bigint;
  contents: Buffer;
}
function row(uid: string, patch: Partial<MailRow> = {}): MailRow {
  return {
    uid,
    owner: "self",
    type: 2,
    from: "sender",
    saved: 0,
    reward: 1,
    time: 1n,
    contents: Buffer.from("synthetic"),
    ...patch,
  };
}
function database(options: { profile?: unknown[] | null; fail?: string } = {}) {
  const queries: { text: string; params: unknown[] }[] = [];
  let rows = [
    row("system"),
    row("saved", { saved: 1 }),
    row("pending", { reward: 0 }),
    row("null", { saved: null }),
    row("negative", { saved: -1 }),
    row("nonstandard", { saved: 2 }),
    row("foreign", { owner: "other" }),
    row("aux-foreign"),
    row("invite", { type: 26, contents: Buffer.from('{"inviterUid":"host","inviteeUid":"self"}') }),
    row("extra-invite", { type: 26, contents: Buffer.from("extra") }),
    row("wrong-invite", {
      type: 26,
      contents: Buffer.from('{"inviterUid":"host","inviteeUid":"other"}'),
    }),
    row("old", { type: 21, from: "alice", time: 9007199254740993n }),
    row("new", { type: 22, from: "alice", time: 9007199254740994n }),
    row("mod-text", { type: 23, from: "mod", time: 10n }),
    row("mod-media", { type: 39, from: "mod", time: 20n }),
    row("resource", { type: 5 }),
    row("trade", { type: 10 }),
    row("monster", { type: 18 }),
  ];
  let extra = rows.map((entry) => ({
    uid: entry.uid,
    owner: entry.uid === "extra-invite" ? "" : entry.uid === "aux-foreign" ? "other" : entry.owner,
    contents:
      entry.uid === "extra-invite"
        ? Buffer.from('{"inviterUid":"extra-host","inviteeUid":"self"}')
        : Buffer.from("auxiliary"),
  }));
  let markers = new Map<string, bigint>();
  let groups = new Map<string, bigint>([
    ["self:2:system", 1n],
    ["self:2:saved", 1n],
    ["self:2:pending", 1n],
    ["self:2:null", 1n],
    ["self:2:negative", 1n],
    ["self:2:nonstandard", 1n],
    ["other:2:foreign", 1n],
    ["self:100:alice", 9007199254740994n],
    ["self:500:mod", 20n],
    ["self:200:", 1n],
    ["self:300:", 1n],
    ["self:400:", 1n],
    ["self:26:invite", 1n],
    ["self:26:extra-invite", 1n],
    ["self:26:wrong-invite", 1n],
  ]);
  let invites = [
    { inviter: "host", invitee: "self" },
    { inviter: "extra-host", invitee: "self" },
    { inviter: "host", invitee: "other" },
  ];
  const state = () => ({ rows, extra, markers, groups, invites });
  let before: ReturnType<typeof state> | undefined;
  const client = {
    query: async (statement: { text: string }, params: unknown[] = []) => {
      const text = statement.text;
      queries.push({ text, params });
      if (text.startsWith("begin"))
        before = {
          rows: [...rows],
          extra: [...extra],
          markers: new Map(markers),
          groups: new Map(groups),
          invites: [...invites],
        };
      if (text === "rollback" && before) {
        rows = before.rows;
        extra = before.extra;
        markers = before.markers;
        groups = before.groups;
        invites = before.invites;
      }
      const fail = (stage: string) => {
        if (options.fail === stage) throw new Error(`Synthetic ${stage} failure`);
      };
      if (text.includes('from "opencok_kingdom"."userprofile"')) {
        fail("profile");
        return { rows: options.profile === null ? [] : [options.profile ?? ["self", 1, "0", 0]] };
      }
      if (text.startsWith('delete from "opencok_kingdom"."mail"')) {
        fail("delete");
        const owner = params[0];
        const ids = params.slice(1, -2);
        const selected = rows.filter(
          (entry) =>
            entry.owner === owner &&
            ids.includes(entry.uid) &&
            entry.saved === 0 &&
            entry.reward !== 0,
        );
        rows = rows.filter((entry) => !selected.includes(entry));
        return {
          rows: selected.map((entry) => [
            entry.uid,
            entry.type,
            entry.from,
            entry.type === 26 ? entry.contents : null,
          ]),
        };
      }
      if (text.includes('from "opencok_kingdom"."mail_contents"')) {
        const ids = params.slice(0, -2);
        const owner = params.at(-2);
        const selected = extra.filter(
          (entry) => ids.includes(entry.uid) && (entry.owner === owner || entry.owner === ""),
        );
        if (text.startsWith("select")) {
          fail("extra");
          return {
            rows: selected.map((entry) => [
              entry.uid,
              entry.contents.length <= 65535 ? entry.contents : null,
            ]),
          };
        }
        fail("contents");
        extra = extra.filter((entry) => !selected.includes(entry));
      }
      if (text.startsWith('insert into "opencok_kingdom"."mail_update"')) {
        fail("marker");
        for (let i = 0; i < params.length; i += 3) {
          const key = `${params[i]}:${params[i + 1]}`;
          const time = BigInt(params[i + 2] as bigint);
          const previous = markers.get(key) ?? 0n;
          markers.set(key, time > previous ? time : previous);
        }
      }
      if (text.includes('from "opencok_kingdom"."mail"') && text.startsWith("select")) {
        fail("group-read");
        const sender = text.includes('"mail"."fromUser" =');
        const types = params.slice(1, sender ? -2 : -1);
        const selected = rows
          .filter(
            (entry) =>
              entry.owner === params[0] &&
              types.includes(entry.type) &&
              (!sender || entry.from === params.at(-2)),
          )
          .sort((a, b) => (a.time > b.time ? -1 : a.time < b.time ? 1 : 0));
        return { rows: selected.slice(0, 1).map((entry) => [String(entry.time)]) };
      }
      if (text.startsWith('delete from "opencok_kingdom"."mail_group"')) {
        fail("group-delete");
        groups.delete(`${params[0]}:${params[1]}:${params[2]}`);
      }
      if (text.startsWith('update "opencok_kingdom"."mail_group"')) {
        fail("group-update");
        const key = `${params[1]}:${params[2]}:${params[3]}`;
        if (groups.has(key)) groups.set(key, BigInt(params[0] as bigint));
      }
      if (text.startsWith('delete from "opencok_kingdom"."alliance_invite_move"')) {
        fail("invite");
        invites = invites.filter(
          (entry) => entry.invitee !== params[0] || !params.slice(1).includes(entry.inviter),
        );
      }
      if (text === "commit") fail("commit");
      return { rows: [] };
    },
  };
  return { db: drizzle(client as unknown as NodePgClient, { schema }), queries, state };
}

test("ordinary deletion protects saved/pending/foreign rows and only cleans up actual deletions", async () => {
  const { db, queries, state } = database();
  const ids = "system,saved,pending,null,negative,nonstandard,foreign,missing,system,aux-foreign";
  expect((await deleteMail(db, 1, "self", mailDeleteQuery(ids, now), plan)).deleted).toBe(2);
  const retained = ["saved", "pending", "null", "negative", "nonstandard", "foreign"];
  for (const uid of retained) {
    expect(state().rows.some((entry) => entry.uid === uid)).toBe(true);
    expect(state().extra.some((entry) => entry.uid === uid)).toBe(true);
  }
  expect(state().extra.some((entry) => entry.uid === "system")).toBe(false);
  expect(state().extra.find((entry) => entry.uid === "aux-foreign")?.owner).toBe("other");
  expect([...state().markers.keys()]).toEqual(["self:system", "self:aux-foreign"]);
  expect(state().groups.has("self:2:system")).toBe(false);
  expect(state().groups.has("self:2:saved")).toBe(true);
  expect(queries[0]?.text).toBe("begin isolation level read committed read write");
  expect(queries[1]?.text).toEndWith("limit $2 for update");
  expect(queries[2]?.text).toContain('"mail"."toUser" = $1');
  expect(queries[2]?.text).toContain('"mail"."saveFlag" =');
  expect(queries[2]?.text).toContain('"mail"."rewardStatus" <>');
  expect(queries[2]?.text).not.toContain("coalesce");
  expect(queries[2]?.params.at(-2)).toBe(0);
  expect(queries[2]?.params.at(-1)).toBe(0);
  const contents = queries.find((entry) =>
    entry.text.startsWith('delete from "opencok_kingdom"."mail_contents"'),
  )!;
  expect(contents.params).toEqual(["system", "aux-foreign", "self", ""]);
  expect(contents.text).toContain('"mail_contents"."toUser" is null');
  expect(queries.at(-1)?.text).toBe("commit");
  const before = queries.length;
  expect((await deleteMail(db, 1, "self", mailDeleteQuery(ids, now + 1), plan)).deleted).toBe(0);
  expect(queries.slice(before)).toHaveLength(4);
  expect([...state().markers.values()]).toEqual([BigInt(now), BigInt(now)]);
  expect(queries.map((entry) => entry.text).join("\n")).not.toMatch(
    /mail_gift_opening|mail_gift_log|rewardId|user_resource|opencok_global/,
  );
});

test("deletion refreshes latest sender timestamps exactly and removes exhausted type/direct groups", async () => {
  const { db, queries, state } = database();
  await deleteMail(
    db,
    1,
    "self",
    mailDeleteQuery("new,mod-media,resource,trade,monster", now),
    plan,
  );
  expect(state().groups.get("self:100:alice")).toBe(9007199254740993n);
  expect(state().groups.get("self:500:mod")).toBe(10n);
  for (const group of [200, 300, 400]) expect(state().groups.has(`self:${group}:`)).toBe(false);
  const reads = queries.filter(
    (entry) =>
      entry.text.startsWith("select") && entry.text.includes('from "opencok_kingdom"."mail"'),
  );
  expect(reads.map((entry) => entry.params)).toContainEqual(["self", 20, 21, 22, "alice", 1]);
  expect(reads.map((entry) => entry.params)).toContainEqual(["self", 23, 24, "mod", 1]);
  for (const read of reads)
    expect(read.text).toContain('order by "opencok_kingdom"."mail"."createTime" desc limit');
  await deleteMail(db, 1, "self", mailDeleteQuery("old,mod-text", now), plan);
  expect(state().groups.has("self:100:alice")).toBe(false);
  expect(state().groups.has("self:500:mod")).toBe(false);
});

test("deletion invalidates only owned inline/extra move invitations and leaves unrelated invitees untouched", async () => {
  const { db, queries, state } = database();
  expect(
    (
      await deleteMail(
        db,
        1,
        "self",
        mailDeleteQuery("invite,extra-invite,wrong-invite", now),
        plan,
      )
    ).deleted,
  ).toBe(3);
  expect(state().invites).toEqual([{ inviter: "host", invitee: "other" }]);
  expect(state().extra.some((entry) => entry.uid === "extra-invite")).toBe(false);
  const extra = queries.find((entry) => entry.text.includes("octet_length"))!;
  expect(extra.text).toContain("<= 65535");
  expect(extra.params).toEqual(["invite", "extra-invite", "wrong-invite", "self", ""]);
  const invitation = queries.find((entry) =>
    entry.text.startsWith('delete from "opencok_kingdom"."alliance_invite_move"'),
  )!;
  expect(invitation.params).toEqual(["self", "host", "extra-host"]);
  expect(invitation.text).toContain('"alliance_invite_move"."invitee" = $1');
});

test("owner checks and empty input prevent deletions; every later failure restores all affected state", async () => {
  for (const profile of [
    null,
    ["other", 1, "0", 0],
    ["self", 2, "0", 0],
    ["self", 1, "0", 1],
    ["self", 1, String(now + 1), 0],
  ]) {
    const { db, queries } = database({ profile });
    expect((await deleteMail(db, 1, "self", mailDeleteQuery("system", now), plan)).deleted).toBe(0);
    expect(queries.some((entry) => /^(delete|insert|update)/.test(entry.text))).toBe(false);
  }
  const empty = database();
  expect((await deleteMail(empty.db, 1, "self", mailDeleteQuery("", now), plan)).deleted).toBe(0);
  expect(empty.queries).toHaveLength(3);
  for (const fail of [
    "profile",
    "delete",
    "extra",
    "contents",
    "marker",
    "group-read",
    "group-update",
    "group-delete",
    "invite",
    "commit",
    "plan",
  ]) {
    const { db, queries, state } = database({ fail });
    const before = {
      ...state(),
      markers: new Map(state().markers),
      groups: new Map(state().groups),
    };
    await expect(
      deleteMail(
        db,
        1,
        "self",
        mailDeleteQuery("system,new,extra-invite", now),
        fail === "plan"
          ? () => {
              throw new Error("Synthetic plan failure");
            }
          : plan,
      ),
    ).rejects.toThrow();
    expect(state()).toEqual(before);
    expect(queries.at(-1)?.text).toBe("rollback");
  }
});

test("deletion bounds metadata and direct inputs without leaving partial state", async () => {
  const { db, queries, state } = database();
  const query = mailDeleteQuery("system", now);
  for (const owner of ["", " ", "\0", "\ud800", "x".repeat(41)])
    expect(() => deleteMail(db, 1, owner, query, plan)).toThrow();
  for (const realm of [0, 1.5, 2147483648])
    expect(() => deleteMail(db, realm, "self", query, plan)).toThrow();
  for (const patch of [
    { now: -1 },
    { now: NaN },
    { ids: [""] },
    { ids: ["a", "a"] },
    { ids: ["\0"] },
    { ids: ["\ud800"] },
  ])
    expect(() => deleteMail(db, 1, "self", { ...query, ...patch }, plan)).toThrow();
  expect(queries).toEqual([]);
  const ids = Array.from({ length: 130 }, (_, i) => `large-${i}`);
  for (const uid of ids)
    state().rows.push(row(uid, { type: 26, contents: Buffer.alloc(65535, 32) }));
  const count = state().rows.length;
  await expect(
    deleteMail(db, 1, "self", mailDeleteQuery(ids.join(","), now), plan),
  ).rejects.toThrow("Mail deletion metadata exceeds limit");
  expect(state().rows).toHaveLength(count);
  expect(state().markers.size).toBe(0);
  expect(queries.at(-1)?.text).toBe("rollback");
});
