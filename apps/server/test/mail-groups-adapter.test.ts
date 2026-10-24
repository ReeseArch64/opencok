import { expect, test } from "bun:test";
import { drizzle, type NodePgClient } from "drizzle-orm/node-postgres";
import * as schema from "@opencok/drizzle/schema/kingdom";
import * as globalSchema from "@opencok/drizzle/schema/global";
import { readMailGroups } from "@opencok/repositories/mail-groups";
import { Database } from "@opencok/repositories/game";
import { Game } from "@opencok/controllers/game";
import { Rules } from "@opencok/rules/game";
import { mailGroupQuery, mailGroupRule } from "@opencok/rules/mail-groups";
import type { MailGroupEntry, MailGroupPreview, MailListEntry } from "@opencok/contracts/mail";
import type { GameServices } from "@opencok/contracts/game";
import { decode, encode, fields, sfs, type Fields, type Value } from "@opencok/messages/sfs";
import { mailListEntry, mailCategoryNow as now } from "./fixtures/mail-category.ts";

const columns = [
  "uid",
  "toUser",
  "fromUser",
  "fromName",
  "title",
  "rewardId",
  "rewardStatus",
  "status",
  "itemIdFlag",
  "saveFlag",
  "reply",
  "translationId",
  "type",
  "createTime",
  "contents",
  "extra",
] as const;
const query = (type = 1000, begin = 0, limit = 1000) => mailGroupQuery(type, begin, limit, now);
const group = (
  groupType: number,
  groupIndex: string,
  updateTime = 1000n,
  uid = "self",
): MailGroupEntry => ({ uid, groupType, groupIndex, updateTime });
const params = (type = 1000, begin = 0, limit = 1000): Fields => ({
  type: sfs.int(type),
  num: sfs.int(begin),
  offset: sfs.int(limit),
});
const messages = (body: Fields) => (body.result!.value as Value[]).map(fields);
const items = (body: Fields, field: string) => (body[field]!.value as Value[]).map(fields);

function fixture(
  options: {
    profile?: unknown[] | null;
    fail?: string;
    size?: number;
    counts?: string[];
    mismatch?: boolean;
    duplicateMetadata?: boolean;
    foreignGroup?: boolean;
  } = {},
) {
  let rows: MailListEntry[] = [];
  for (const [type, prefix] of [
    [22, "chat"],
    [24, "mod"],
    [5, "resource"],
    [10, "trade"],
    [18, "monster"],
  ] as const)
    rows.push(
      ...Array.from({ length: 10 }, (_, index) =>
        mailListEntry({
          uid: `${prefix}${index}`,
          type,
          createTime: BigInt(900 - index),
          status: index % 2,
          contents: Buffer.from(type === 22 || type === 24 ? `text ${index}` : `{n:${index}}`),
        }),
      ),
    );
  rows.push(mailListEntry({ uid: "single", type: 12, contents: Buffer.from("{n:1}") }));
  rows.push(
    mailListEntry({
      uid: "bad",
      type: 12,
      contents: Buffer.from("broken"),
      saveFlag: 1,
      rewardStatus: 0,
    }),
  );
  rows.push(
    mailListEntry({
      uid: "foreign",
      type: 12,
      toUser: "other",
      contents: Buffer.from("{secret:1}"),
    }),
  );
  rows.push(mailListEntry({ uid: "media", type: 40, contents: Buffer.from("media") }));
  rows.push(mailListEntry({ uid: "other-sender", type: 22, fromUser: "other-sender" }));
  let groups = [
    group(100, "sender", 900n),
    group(200, "5", 800n),
    group(400, "10", 700n),
    group(300, "18", 600n),
    group(2, "single", 500n),
    group(12, "bad", 400n),
    group(17, "empty", 300n),
    group(100, "later", 200n),
    group(500, "sender", 1000n),
    group(100, "foreign-sender", 2000n, "other"),
  ];
  const extras = new Map<string, { owner: string | null; contents: Buffer }>([
    ["bad", { owner: "self", contents: Buffer.from("retained extra") }],
  ]);
  const senders = new Map<string, unknown[]>([
    ["sender", ["sender", 1, "Current", "portrait", 2, "pt", "TAG"]],
    ["later", ["later", 1, "Later", "portrait", 0, "en", null]],
  ]);
  const translations = new Map<string, Buffer>();
  const calls: { text: string; params: unknown[] }[] = [];
  const routes: unknown[][] = [];
  let beforeRows = rows;
  let beforeGroups = groups;
  const client = {
    query: async (statement: { text: string }, values: unknown[] = []) => {
      const text = statement.text;
      calls.push({ text, params: values });
      const fail = (step: string) => {
        if (options.fail === step) throw new Error(`Synthetic ${step} failure`);
      };
      const equal = (table: string, column: string) => {
        const position = text.match(
          new RegExp('"' + table + '"\\."' + column + '" = \\$(\\d+)'),
        )?.[1];
        return position ? values[Number(position) - 1] : undefined;
      };
      const set = (table: string, column: string) => {
        const list = text.match(
          new RegExp('"' + table + '"\\."' + column + '" in \\(([^)]+)\\)'),
        )?.[1];
        return list?.match(/\$\d+/g)?.map((token) => values[Number(token.slice(1)) - 1]);
      };
      const pagination = <T>(rows: T[]) => {
        const start = Number(values[Number(text.match(/offset \$(\d+)/)?.[1]) - 1] ?? 0);
        const limit = Number(values[Number(text.match(/limit \$(\d+)/)?.[1]) - 1] ?? rows.length);
        return rows.slice(start, start + limit);
      };
      if (text.startsWith("begin")) {
        beforeRows = rows.map((row) => ({ ...row }));
        beforeGroups = groups.map((group) => ({ ...group }));
        return { rows: [] };
      }
      if (text === "rollback") {
        rows = beforeRows;
        groups = beforeGroups;
        return { rows: [] };
      }
      if (text === "commit") {
        fail("commit");
        return { rows: [] };
      }
      if (text.includes('from "opencok_kingdom"."userprofile"')) {
        if (text.includes('"name"')) {
          fail("senders");
          return {
            rows: [...(set("userprofile", "uid") ?? [])].flatMap((id) =>
              senders.has(String(id)) ? [senders.get(String(id))!] : [],
            ),
          };
        }
        fail("profile");
        expect(text).toContain('"userprofile"."uid" = $1');
        return { rows: options.profile === null ? [] : [options.profile ?? ["self", 1, "0", 0]] };
      }
      if (text.startsWith("select") && text.includes('from "opencok_kingdom"."mail_group"')) {
        fail("groups");
        const selected = groups
          .filter(
            (group) =>
              group.uid === equal("mail_group", "uid") &&
              (text.includes('"groupType" <')
                ? group.groupType < 500
                : group.groupType === equal("mail_group", "groupType")),
          )
          .sort((a, b) =>
            a.updateTime !== b.updateTime
              ? a.updateTime > b.updateTime
                ? -1
                : 1
              : a.groupType - b.groupType ||
                Buffer.compare(Buffer.from(a.groupIndex), Buffer.from(b.groupIndex)),
          );
        return {
          rows: pagination(selected).map((group) => [
            options.foreignGroup ? "other" : group.uid,
            group.groupType,
            group.groupIndex,
            String(group.updateTime),
          ]),
        };
      }
      if (text.startsWith("select") && text.includes('from "opencok_kingdom"."mail"')) {
        const owner = equal("group_mail", "toUser");
        const types = set("group_mail", "type");
        const uid = equal("group_mail", "uid");
        const from = equal("group_mail", "fromUser");
        const ids = set("group_mail", "uid");
        expect(owner).toBe("self");
        expect(types?.length).toBeGreaterThan(0);
        const selected = rows
          .filter(
            (row) =>
              row.toUser === owner &&
              types!.includes(row.type) &&
              (uid === undefined || uid === row.uid) &&
              (from === undefined || from === row.fromUser) &&
              (!ids || ids.includes(row.uid)),
          )
          .sort((a, b) =>
            a.createTime !== b.createTime
              ? a.createTime > b.createTime
                ? -1
                : 1
              : Buffer.compare(Buffer.from(a.uid), Buffer.from(b.uid)),
          );
        if (text.includes("count(*)")) {
          fail("counts");
          expect(text).toContain('coalesce("status", 0) = 0');
          expect(text).not.toContain("join");
          expect(text).not.toContain("limit");
          return {
            rows: [
              options.counts ?? [
                String(selected.length),
                String(selected.filter((row) => (row.status ?? 0) === 0).length),
              ],
            ],
          };
        }
        const extra = (row: MailListEntry) => {
          const entry = extras.get(row.uid);
          return entry && [owner, "", null].includes(entry.owner) ? entry.contents : null;
        };
        expect(text).toContain('"mail_contents"."toUser" is null');
        if (text.includes("octet_length")) {
          fail("metadata");
          expect(text).toContain('for update of "group_mail"');
          const metadata = pagination(selected).map((row) => [
            row.uid,
            options.size ??
              (row.contents?.length ?? 0) +
                (extra(row)?.length ?? 0) +
                Buffer.byteLength(row.rewardId ?? ""),
          ]);
          if (options.duplicateMetadata && metadata.length > 1) metadata[1] = metadata[0]!;
          return { rows: metadata };
        }
        fail("bodies");
        expect(ids!.length).toBeLessThanOrEqual(7);
        return {
          rows: selected.map((row) =>
            columns.map((column) =>
              column === "uid" && options.mismatch
                ? "wrong"
                : column === "createTime"
                  ? String(row.createTime)
                  : column === "rewardId"
                    ? row.rewardId === null
                      ? null
                      : Buffer.from(row.rewardId)
                    : column === "extra"
                      ? extra(row)
                      : row[column],
            ),
          ),
        };
      }
      if (text.startsWith("select") && text.includes('from "opencok_kingdom"."translationv2"')) {
        fail("translation");
        const ids = set("translationv2", "id")!;
        return {
          rows: ids.flatMap((id) =>
            translations.has(String(id))
              ? [
                  [
                    id,
                    text.includes("octet_length")
                      ? translations.get(String(id))!.length
                      : translations.get(String(id))!,
                  ],
                ]
              : [],
          ),
        };
      }
      if (text.startsWith('delete from "opencok_kingdom"."mail"')) {
        fail("delete-mail");
        const owner = equal("mail", "toUser");
        const ids = set("mail", "uid")!;
        rows = rows.filter((row) => row.toUser !== owner || !ids.includes(row.uid));
        return { rows: [] };
      }
      if (text.startsWith('delete from "opencok_kingdom"."mail_group"')) {
        fail("delete-groups");
        expect(text).toContain('"mail_group"."uid" = $1');
        const [owner, ...keys] = values;
        groups = groups.filter(
          (group) =>
            group.uid !== owner ||
            !keys.some(
              (value, index) =>
                index % 2 === 0 &&
                value === group.groupType &&
                keys[index + 1] === group.groupIndex,
            ),
        );
        return { rows: [] };
      }
      throw new Error("Unexpected synthetic SQL: " + text);
    },
  };
  const db = drizzle(client as unknown as NodePgClient, { schema });
  const global = drizzle(
    {
      query: async (statement: { text: string }, values: unknown[]) => {
        routes.push(values);
        if (options.fail === "routing") throw new Error("Synthetic routing failure");
        expect(statement.text).toContain('from "opencok_global"."account_new"');
        return { rows: [] };
      },
    } as unknown as NodePgClient,
    { schema: globalSchema },
  );
  const databases = {
    getKingdom: (realm: number) => {
      expect(realm).toBe(1);
      return { db };
    },
    kingdoms: new Map([[1, { db }]]),
    global: { db: global },
  } as unknown as Parameters<typeof readMailGroups>[0];
  const repository: Database = Object.assign(Object.create(Database.prototype), {
    databases,
    config: { kingdomId: 1 },
  });
  const config = { kingdomId: 1, mailTranslationEnabled: true };
  const markers: unknown[][] = [];
  const services: GameServices = {
    playerUpdateTimes: async (realm, ids) => {
      markers.push([realm, ids]);
      if (options.fail === "marker") throw new Error("Synthetic marker failure");
      return new Map([["self", "marker"]]);
    },
  };
  let clocks = 0;
  const game = new Game(
    repository,
    new Rules(new Map(), new Map(), new Map()),
    config,
    () => {
      clocks++;
      return now;
    },
    services,
  );
  return {
    game,
    config,
    databases,
    calls,
    routes,
    senders,
    translations,
    extras,
    markers,
    rows: () => rows,
    groups: () => groups,
    clocks: () => clocks,
  };
}

test("production group command reads complete counts, bounded previews and the full page sender set in the owner transaction", async () => {
  const f = fixture();
  f.rows().find((row) => row.uid === "chat9")!.contents = Buffer.from("extra");
  const result = await f.game.execute("self", "mread.batch", {
    ...params(),
    _cok_: sfs.string("trace"),
    cmdBaseTime: sfs.long(8),
    toUser: sfs.string("other"),
    serverId: sfs.int(2),
    fromUser: sfs.null(),
  });
  expect(f.clocks()).toBe(1);
  expect(result.body._cok_).toEqual(sfs.string("trace"));
  expect(result.body.cmdBaseTime).toEqual(sfs.long(8));
  expect(decode(encode(result.body))).toEqual(result.body);
  expect(result.pushes).toEqual([]);
  expect(f.calls[0]!.text).toBe("begin isolation level repeatable read read write");
  expect(f.calls[1]!.text).toEndWith("for update");
  expect(f.calls[2]!.params).toEqual(["self", 500, 1000]);
  expect(f.calls[2]!.text).toContain(
    'order by "opencok_kingdom"."mail_group"."updateTime" desc, "opencok_kingdom"."mail_group"."groupType" asc, "opencok_kingdom"."mail_group"."groupIndex" collate "C" asc',
  );
  expect(f.routes).toEqual([["sender", "later", 3]]);
  expect(f.markers).toEqual([[1, ["self"]]]);
  const output = messages(result.body);
  expect(output).toHaveLength(6);
  expect(items(output[0]!, "chats").map((row) => row.uid)).toEqual(
    [6, 5, 4, 3, 2, 1, 0].map((index) => sfs.string(`chat${index}`)),
  );
  for (let index = 0; index < 4; index++) {
    expect(output[index]!.totalNum).toEqual(sfs.int(10));
    expect(output[index]!.unread).toEqual(sfs.int(5));
  }
  expect(items(output[1]!, "collect").map((row) => row.uid)).toEqual(
    Array.from({ length: 7 }, (_, index) => sfs.string(`resource${index}`)),
  );
  expect(output[2]!.pic).toEqual(sfs.string("portrait"));
  expect(items(output[2]!, "collect")[0]!.pic).toEqual(sfs.string("portrait"));
  expect(items(output[3]!, "monster")[0]!.uid).toEqual(sfs.string("monster0"));
  expect(output[4]!.detail).toEqual(sfs.object({ n: sfs.int(1) }));
  expect(output[4]!.totalNum).toEqual(sfs.int(0));
  expect(output[5]!.uid).toEqual(sfs.string("bad"));
  expect(output[5]!.detail).toBeUndefined();
  expect(f.rows().some((row) => row.uid === "bad")).toBe(false);
  expect(f.rows().some((row) => row.uid === "foreign")).toBe(true);
  expect(f.extras.get("bad")!.contents).toEqual(Buffer.from("retained extra"));
  expect(f.groups().some((group) => group.groupIndex === "empty")).toBe(false);
  expect(f.groups().some((group) => group.groupIndex === "bad")).toBe(true);
  expect(f.groups().some((group) => group.groupIndex === "later")).toBe(true);
  expect(f.calls.at(-1)!.text).toBe("commit");
  const metadata = f.calls.filter(
    (call) =>
      call.text.includes('from "opencok_kingdom"."mail"') && call.text.includes("octet_length"),
  );
  expect(metadata.map((call) => call.params.at(-1))).toEqual([7, 7, 7, 7, 1, 1]);
});

test("moderator groups exclude media and use translations without category-only preview fields", async () => {
  const f = fixture();
  f.rows().find((row) => row.uid === "mod0")!.translationId = "en|translated";
  f.translations.set("translated", Buffer.from(" traduzido "));
  const result = await f.game.execute("self", "mread.batch", params(10));
  expect(f.calls[2]!.params).toEqual(["self", 500, 1000]);
  expect(f.calls[2]!.text).toContain('"mail_group"."groupType" = $2');
  const [root] = messages(result.body);
  expect(root!.totalNum).toEqual(sfs.int(10));
  const chat = items(root!, "chats").at(-1)!;
  expect(chat.uid).toEqual(sfs.string("mod0"));
  expect(chat.translationMsg).toEqual(sfs.string(" traduzido "));
  expect(chat.originalLang).toEqual(sfs.string("en"));
  expect(chat.lastUpdateTime).toEqual(sfs.string("marker"));
  for (const key of ["status", "fromUser", "fromName", "pic"]) expect(chat[key]).toBeUndefined();
  expect(f.calls.some((call) => call.text.startsWith("delete"))).toBe(false);
  const disabled = fixture();
  disabled.config.mailTranslationEnabled = false;
  disabled.rows().find((row) => row.uid === "mod0")!.translationId = "en|translated";
  await disabled.game.execute("self", "mread.batch", params(10));
  expect(disabled.calls.some((call) => call.text.includes('"translationv2"'))).toBe(false);
});

test("group pagination happens before seven-slot processing, ties are deterministic and empty pages do not fetch bodies", async () => {
  const f = fixture();
  const result = await f.game.execute("self", "mread.batch", params(1000, 4, 2));
  expect(messages(result.body).map((row) => row.uid)).toEqual([
    sfs.string("single"),
    sfs.string("bad"),
  ]);
  expect(f.calls[2]!.params).toEqual(["self", 500, 2, 4]);
  expect(f.routes).toEqual([]);
  expect(f.markers).toEqual([]);
  for (const [begin, limit] of [
    [0, 0],
    [100, 10],
  ]) {
    const empty = fixture();
    expect(
      (await empty.game.execute("self", "mread.batch", params(1000, begin, limit))).body,
    ).toEqual({ result: sfs.array() });
    expect(empty.calls.some((call) => call.text.includes('from "opencok_kingdom"."mail"'))).toBe(
      false,
    );
    expect(empty.routes).toEqual([]);
    expect(empty.markers).toEqual([]);
  }
  const tie = fixture();
  tie
    .groups()
    .splice(0, tie.groups().length, group(12, "single"), group(2, "single"), group(12, "bad"));
  const resultTie = await tie.game.execute("self", "mread.batch", params());
  expect(messages(resultTie.body).map((row) => row.uid)).toEqual([
    sfs.string("single"),
    sfs.string("bad"),
    sfs.string("single"),
  ]);
});

test("missing sender profiles retain legacy failure and missing individual senders only remove selected empty groups", async () => {
  const absent = fixture();
  absent.senders.clear();
  const original = structuredClone(absent.groups());
  await expect(absent.game.execute("self", "mread.batch", params())).rejects.toThrow();
  expect(absent.groups()).toEqual(original);
  expect(absent.calls.some((call) => call.text.startsWith("delete"))).toBe(false);
  expect(absent.calls.at(-1)!.text).toBe("rollback");
  const missing = fixture();
  missing.senders.delete("sender");
  const result = await missing.game.execute("self", "mread.batch", params());
  expect(messages(result.body)).toHaveLength(5);
  expect(
    missing.groups().some((group) => group.groupType === 100 && group.groupIndex === "sender"),
  ).toBe(false);
  expect(missing.groups().some((group) => group.groupIndex === "later")).toBe(true);
  expect(missing.rows().filter((row) => row.type === 22)).toHaveLength(11);
});

test("group authorization, malformed requests and bad snapshots cannot authorize reads or cleanup", async () => {
  for (const profile of [
    null,
    ["other", 1, "0", 0],
    ["self", 2, "0", 0],
    ["self", 1, "0", 1],
    ["self", 1, String(now + 1), 0],
  ]) {
    const f = fixture({ profile });
    await expect(f.game.execute("self", "mread.batch", params())).rejects.toThrow();
    expect(f.calls).toHaveLength(3);
    expect(f.routes).toEqual([]);
  }
  for (const input of [
    { ...params(), num: sfs.int(-1) },
    { ...params(10), offset: sfs.int(-1) },
    { ...params(), type: sfs.long(1000) },
    { ...params(), fromUser: sfs.int(1) },
    { ...params(), fromUser: sfs.string(undefined as never) },
  ]) {
    const f = fixture();
    await expect(f.game.execute("self", "mread.batch", input)).rejects.toThrow();
    expect(f.calls).toEqual([]);
  }
  const foreign = fixture({ foreignGroup: true });
  await expect(foreign.game.execute("self", "mread.batch", params())).rejects.toThrow();
  expect(foreign.routes).toEqual([]);
  expect(foreign.calls.at(-1)!.text).toBe("rollback");
  const owned = fixture();
  owned.groups().splice(0, owned.groups().length, group(12, "foreign"));
  expect((await owned.game.execute("self", "mread.batch", params())).body).toEqual({
    result: sfs.array(),
  });
  expect(owned.rows().some((row) => row.uid === "foreign")).toBe(true);
});

test("all failure stages roll back planned primary and group changes without touching auxiliaries", async () => {
  for (const fail of [
    "profile",
    "groups",
    "routing",
    "senders",
    "counts",
    "metadata",
    "bodies",
    "translation",
    "marker",
    "delete-mail",
    "delete-groups",
    "commit",
  ]) {
    const f = fixture({ fail });
    f.rows().find((row) => row.uid === "chat0")!.translationId = "en|translated";
    const beforeRows = structuredClone(f.rows());
    const beforeGroups = structuredClone(f.groups());
    const beforeExtras = structuredClone(f.extras);
    let caught: unknown;
    try {
      await f.game.execute("self", "mread.batch", params());
    } catch (error) {
      caught = error;
    }
    while (caught instanceof Error && caught.cause) caught = caught.cause;
    expect(caught).toBeInstanceOf(Error);
    expect((caught as Error).message).toBe(`Synthetic ${fail} failure`);
    expect(structuredClone(f.rows())).toEqual(beforeRows);
    expect(structuredClone(f.groups())).toEqual(beforeGroups);
    expect(structuredClone(f.extras)).toEqual(beforeExtras);
    expect(f.calls.at(-1)!.text).toBe("rollback");
  }
  for (const invalid of ["broken", "extra", "{[]:1}"]) {
    const f = fixture();
    f.rows().find((row) => row.uid === "resource0")!.contents = Buffer.from(invalid);
    await expect(f.game.execute("self", "mread.batch", params())).rejects.toThrow();
    expect(f.calls.some((call) => call.text.startsWith("delete"))).toBe(false);
  }
  const correlation = fixture();
  await expect(
    correlation.game.execute("self", "mread.batch", {
      ...params(),
      _cok_: sfs.string("x".repeat(32768)),
    }),
  ).rejects.toThrow();
  expect(correlation.calls.some((call) => call.text.startsWith("delete"))).toBe(false);
});

test("metadata bounds and inconsistent counts or body snapshots reject before cleanup", async () => {
  for (const option of [
    { size: -1 },
    { size: 4 * 1024 * 1024 },
    { mismatch: true },
    { duplicateMetadata: true },
    { counts: ["2147483648", "0"] },
    { counts: ["10", "11"] },
    { counts: ["0", "1"] },
    { counts: ["1.5", "0"] },
  ]) {
    const f = fixture(option);
    await expect(f.game.execute("self", "mread.batch", params())).rejects.toThrow();
    expect(f.calls.some((call) => call.text.startsWith("delete"))).toBe(false);
    if ("size" in option || "counts" in option || "duplicateMetadata" in option)
      expect(
        f.calls.some((call) =>
          call.text.startsWith('select "group_mail"."uid", "group_mail"."toUser"'),
        ),
      ).toBe(false);
  }
  const huge = fixture();
  huge
    .groups()
    .splice(
      0,
      huge.groups().length,
      ...Array.from({ length: 1001 }, (_, index) => group(-1, String(index))),
    );
  await expect(
    huge.game.execute("self", "mread.batch", params(1000, 0, 2147483647)),
  ).rejects.toThrow();
  expect(huge.calls[2]!.params.at(-1)).toBe(1001);
  expect(huge.routes).toEqual([]);
});

test("repository preview and cleanup capabilities cannot escape the processed page or delete conversation mail", async () => {
  for (const invalid of [
    "group",
    "later",
    "duplicate-group",
    "mail",
    "conversation",
    "duplicate-mail",
    "repeat-preview",
    "foreign-preview",
    "sender",
  ] as const) {
    const f = fixture();
    const before = structuredClone([f.rows(), f.groups()]);
    await expect(
      readMailGroups(f.databases, 1, "self", query(), async (groups, readers) => {
        if (invalid === "sender") await readers.senders(["unrequested"]);
        if (invalid === "foreign-preview")
          await readers.preview(group(12, "foreign"), mailGroupRule(12)!);
        const single = groups.find((group) => group.groupIndex === "single")!;
        await readers.preview(single, mailGroupRule(single.groupType)!);
        if (invalid === "repeat-preview")
          await readers.preview(single, mailGroupRule(single.groupType)!);
        if (invalid === "conversation") await readers.preview(groups[0]!, mailGroupRule(100)!);
        return {
          groups:
            invalid === "group"
              ? [group(12, "foreign")]
              : invalid === "later"
                ? [group(100, "later")]
                : invalid === "duplicate-group"
                  ? [single, single]
                  : [],
          mailIds:
            invalid === "mail"
              ? ["foreign"]
              : invalid === "conversation"
                ? ["chat0"]
                : invalid === "duplicate-mail"
                  ? ["single", "single"]
                  : [],
        };
      }),
    ).rejects.toThrow();
    expect(structuredClone([f.rows(), f.groups()])).toEqual(before);
    expect(f.calls.at(-1)!.text).toBe("rollback");
  }
});

test("preview extra-body ownership and count-only historical rows preserve boundaries", async () => {
  for (const owner of ["self", "", null, "other"]) {
    const f = fixture();
    f.groups().splice(0, f.groups().length, group(12, "single"));
    f.rows().find((row) => row.uid === "single")!.contents = Buffer.from("extra");
    f.extras.set("single", { owner, contents: Buffer.from("{n:9}") });
    if (owner === "other") {
      await expect(f.game.execute("self", "mread.batch", params())).rejects.toThrow(
        "Missing persisted mail contents",
      );
      expect(f.calls.some((call) => call.text.startsWith("delete"))).toBe(false);
    } else
      expect(
        messages((await f.game.execute("self", "mread.batch", params())).body)[0]!.detail,
      ).toEqual(sfs.object({ n: sfs.int(9) }));
  }
  const f = fixture();
  f.groups().splice(0, f.groups().length, group(200, "5"));
  f.rows().find((row) => row.uid === "resource9")!.contents = Buffer.from("broken");
  let snapshot: MailGroupPreview | undefined;
  await readMailGroups(f.databases, 1, "self", query(), async (groups, readers) => {
    snapshot = await readers.preview(groups[0]!, mailGroupRule(200)!);
    return { groups: [], mailIds: [] };
  });
  expect(snapshot!.total).toBe(10n);
  expect(snapshot!.entries).toHaveLength(7);
  expect(snapshot!.entries.some((row) => row.uid === "resource9")).toBe(false);
});

test("unknown groups consume only seven slots and cleanup preserves later and foreign groups", async () => {
  const f = fixture();
  const unknowns = Array.from({ length: 8 }, (_, index) =>
    group(-1, `unknown${index}`, BigInt(100 - index)),
  );
  const foreign = group(-1, "unknown0", 100n, "other");
  f.groups().splice(0, f.groups().length, ...unknowns, foreign);
  const before = structuredClone(f.rows());
  expect((await f.game.execute("self", "mread.batch", params())).body).toEqual({
    result: sfs.array(),
  });
  expect(f.groups()).toEqual([unknowns[7]!, foreign]);
  expect(structuredClone(f.rows())).toEqual(before);
  expect(f.calls.some((call) => call.text.includes('from "opencok_kingdom"."mail"'))).toBe(false);
});

test("aggregate group bytes are bounded before loading the next preview and reject without cleanup", async () => {
  const f = fixture();
  f.groups().splice(0, f.groups().length, group(12, "single"), group(12, "bad"));
  const large = Buffer.from("broken".padEnd(2 * 1024 * 1024, " "));
  for (const uid of ["single", "bad"]) {
    f.rows().find((row) => row.uid === uid)!.contents = Buffer.from("extra");
    f.extras.set(uid, { owner: "self", contents: large });
  }
  await expect(f.game.execute("self", "mread.batch", params())).rejects.toThrow(
    "Mail group content capacity exceeded",
  );
  expect(
    f.calls.filter((call) =>
      call.text.startsWith('select "group_mail"."uid", "group_mail"."toUser"'),
    ),
  ).toHaveLength(1);
  expect(f.calls.some((call) => call.text.startsWith("delete"))).toBe(false);
});

test("repository query and selector validation reject invalid capabilities before reading group messages", async () => {
  const f = fixture();
  for (const invalid of [
    { ...query(), begin: -1 },
    { ...query(), limit: 2147483648 },
    { ...query(), now: NaN },
    { ...query(), moderation: 1 as never },
  ])
    expect(() =>
      readMailGroups(f.databases, 1, "self", invalid, async () => ({ groups: [], mailIds: [] })),
    ).toThrow("Invalid mail group query");
  for (const [realm, uid] of [
    [0, "self"],
    [2.5, "self"],
    [1, ""],
    [1, "\0"],
    [1, "\ud800"],
  ] as const)
    expect(() =>
      readMailGroups(f.databases, realm, uid, query(), async () => ({ groups: [], mailIds: [] })),
    ).toThrow("Invalid mail group query");
  expect(f.calls).toEqual([]);
  for (const selection of [
    { kind: "uid", types: [] },
    { kind: "sender", types: [22, 22] },
    { kind: "type", types: [5, 10] },
    { kind: "type", types: [50] },
    { kind: "other", types: [5] },
  ]) {
    const g = fixture();
    await expect(
      readMailGroups(g.databases, 1, "self", query(), async (groups, readers) => {
        await readers.preview(groups[0]!, selection as never);
        return { groups: [], mailIds: [] };
      }),
    ).rejects.toThrow("Invalid mail group selection");
    expect(g.calls.some((call) => call.text.includes('from "opencok_kingdom"."mail"'))).toBe(false);
  }
});

test("mread.chat explicit group selectors preserve group output, sender resolution and cleanup", async () => {
  for (const selector of [10, 1000]) {
    const f = fixture();
    const batch = fixture();
    const request = { ...params(selector), _cok_: sfs.string("chat-group") };
    expect(await f.game.execute("self", "mread.chat", request)).toEqual(
      await batch.game.execute("self", "mread.batch", request),
    );
    expect(f.calls).toEqual(batch.calls);
    expect(f.routes).toEqual(batch.routes);
    expect(f.groups()).toEqual(batch.groups());
    expect(f.rows()).toEqual(batch.rows());
    const failure = fixture({ fail: "delete-groups" });
    const before = structuredClone([failure.rows(), failure.groups()]);
    if (selector === 1000) {
      await expect(failure.game.execute("self", "mread.chat", request)).rejects.toThrow();
      expect(structuredClone([failure.rows(), failure.groups()])).toEqual(before);
      expect(failure.calls.at(-1)!.text).toBe("rollback");
    }
  }
});
