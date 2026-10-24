import { expect, test } from "bun:test";
import { drizzle, type NodePgClient } from "drizzle-orm/node-postgres";
import * as schema from "@opencok/drizzle/schema/kingdom";
import { deleteMailCategories, deleteMailType } from "@opencok/repositories/mail-batch-delete";
import { mailCategoryDeleteQuery, mailTypeDeleteQuery } from "@opencok/rules/mail-batch-delete";
import type { GameStore } from "@opencok/contracts/game";
import type { MailCategoryDeleteCount } from "@opencok/contracts/mail";
import { GameService as Game } from "@opencok/services/game";
import { Rules } from "@opencok/rules/game";
import { decode, encode, sfs, type Fields } from "@opencok/messages/sfs";

const now = 1792756800000;

function storage() {
  const queries: { text: string; params: unknown[] }[] = [];
  let profile: unknown[][] = [["self", 1, 0n, 0]];
  let counts: unknown[][] = [["7", "3"]];
  let failOn = "";
  let selected: unknown[][] = [];
  class Pool {
    async connect() {
      return { query: this.query.bind(this), release() {} };
    }
    async query(query: { text: string }, params: unknown[] = []) {
      const text = query.text;
      queries.push({ text, params });
      if (failOn && text.startsWith(failOn)) throw new Error("Synthetic mailbox SQL failure");
      if (text.includes('from "opencok_kingdom"."userprofile"')) return { rows: profile };
      if (text.includes('from "opencok_kingdom"."mail_chat_read_intent"')) return { rows: [["0"]] };
      if (text.startsWith("select count(*) filter")) return { rows: counts };
      if (text.includes("octet_length(")) return { rows: selected };
      return { rows: [] };
    }
  }
  return {
    db: drizzle(new Pool() as unknown as NodePgClient, { schema }),
    queries,
    profile(rows: unknown[][]) {
      profile = rows;
    },
    counts(rows: unknown[][]) {
      counts = rows;
    },
    selected(rows: unknown[][]) {
      selected = rows;
    },
    fail(prefix: string) {
      failOn = prefix;
    },
  };
}

test("batch deletion parses Java category labels while retaining raw result keys and duplicate labels", () => {
  expect(mailCategoryDeleteQuery(null, "0,,+0,００,١,-1,2147483647,", now)).toEqual({
    now,
    labels: [
      { raw: "0", category: 0 },
      { raw: "+0", category: 0 },
      { raw: "００", category: 0 },
      { raw: "١", category: 1 },
      { raw: "-1", category: -1 },
      { raw: "2147483647", category: 2147483647 },
    ],
  });
  for (const raw of [undefined, null, "", "\u2000", ",,,"])
    expect(mailCategoryDeleteQuery(raw, raw, now)).toEqual({ now, labels: [] });
  for (const raw of [" 0", "1 ", "2147483648", "0x1", "1,bad", Array(1001).fill("0").join(",")])
    expect(() => mailCategoryDeleteQuery(null, raw, now)).toThrow();
  expect(mailCategoryDeleteQuery("ordinary-id,,other,ordinary-id", "0", now)).toEqual({
    now,
    labels: [{ raw: "0", category: 0 }],
    ids: ["ordinary-id", "other"],
  });
  for (const ids of ["x".repeat(41), "\0", "\ud800", Array(1001).fill("id").join(",")])
    expect(() => mailCategoryDeleteQuery(ids, "0", now)).toThrow();
});

test("category deletes count pending rewards before mutation and preserve the distinct primary and extra predicates", async () => {
  const app = storage();
  const results: MailCategoryDeleteCount[][] = [];
  await deleteMailCategories(
    app.db,
    1,
    "self",
    mailCategoryDeleteQuery(null, "0,+0,1,5,-1,99", now),
    (counts) => {
      expect(app.queries.some((query) => query.text.startsWith("delete "))).toBe(false);
      results.push([...counts]);
    },
  );
  expect(results[0]).toEqual(
    ["0", "+0", "1", "5", "-1", "99"].map((raw) => ({ raw, total: 7, unread: 3 })),
  );
  const reads = app.queries.filter((query) => query.text.startsWith("select count(*) filter"));
  expect(reads).toHaveLength(4);
  for (const read of reads) {
    expect(read.text).toContain('"rewardStatus" = 0');
    expect(read.text).toContain('coalesce("status", 0) = 0');
    expect(read.params[0]).toBe("self");
    expect(read.text).not.toContain('"saveFlag"');
  }
  const deletes = app.queries.filter((query) => query.text.startsWith("delete "));
  expect(deletes).toHaveLength(2);
  expect(deletes[0]!.text).toContain('delete from "opencok_kingdom"."mail_contents"');
  expect(deletes[0]!.text).toContain('in (select "uid" from "opencok_kingdom"."mail"');
  expect(deletes[0]!.text).not.toContain('"saveFlag"');
  expect(deletes[0]!.text).not.toContain('"rewardStatus"');
  expect(deletes[0]!.text).toContain('"toUser" is null');
  expect(deletes[1]!.text).toContain('"saveFlag" =');
  expect(deletes[1]!.text).toContain('"rewardStatus" <>');
  expect(
    app.queries.some((query) =>
      /mail_group|mail_update|mail_chat_read_intent|alliance_invite_move/.test(query.text),
    ),
  ).toBe(false);
  expect(app.queries.at(-1)!.text).toBe("commit");
});

test("all six category selectors and the unknown-label fallback retain the legacy stored type sets", async () => {
  const expected = [
    [0, ["self", 13, 16]],
    [1, ["self", 14, 16]],
    [2, ["self", 13]],
    [3, ["self", 6, 7, 8, 9, 30]],
    [4, ["self", 22, 25]],
    [5, ["self", 32]],
    [-1, ["self", 13, 16]],
  ] as const;
  for (const [category, params] of expected) {
    const app = storage();
    await deleteMailCategories(
      app.db,
      1,
      "self",
      mailCategoryDeleteQuery(null, String(category), now),
      () => {},
    );
    const query = app.queries.find((query) => query.text.startsWith("select count(*) filter"))!;
    expect(query.params).toEqual([...params]);
  }
});

test("empty deletion batches still authorize the owner while failed authorization never inspects or deletes", async () => {
  const empty = storage();
  let result: readonly MailCategoryDeleteCount[] | undefined;
  await deleteMailCategories(empty.db, 1, "self", { labels: [], now }, (counts) => {
    result = counts;
  });
  expect(result).toEqual([]);
  expect(empty.queries.map((query) => query.text.split(" ")[0])).toEqual([
    "begin",
    "select",
    "commit",
  ]);
  for (const profile of [
    [],
    [["other", 1, 0n, 0]],
    [["self", 2, 0n, 0]],
    [["self", 1, 0n, 1]],
    [["self", 1, BigInt(now + 1), 0]],
  ]) {
    const app = storage();
    app.profile(profile);
    let inspected = false;
    await deleteMailCategories(app.db, 1, "self", mailCategoryDeleteQuery(null, "0", now), () => {
      inspected = true;
    });
    expect(inspected).toBe(false);
    expect(app.queries.some((query) => query.text.startsWith("delete "))).toBe(false);
  }
});

test("category deletion rolls back SQL failures and cannot mutate after invalid counts or response inspection", async () => {
  for (const stage of [
    'delete from "opencok_kingdom"."mail_contents"',
    'delete from "opencok_kingdom"."mail"',
    "commit",
  ]) {
    const app = storage();
    app.fail(stage);
    await expect(
      deleteMailCategories(app.db, 1, "self", mailCategoryDeleteQuery(null, "0", now), () => {}),
    ).rejects.toThrow();
    expect(app.queries.at(-1)!.text).toBe("rollback");
  }
  for (const counts of [[], [["bad", "0"]], [["1", "2"]]]) {
    const app = storage();
    app.counts(counts);
    await expect(
      deleteMailCategories(app.db, 1, "self", mailCategoryDeleteQuery(null, "0", now), () => {}),
    ).rejects.toThrow();
    expect(app.queries.some((query) => query.text.startsWith("delete "))).toBe(false);
  }
  const app = storage();
  await expect(
    deleteMailCategories(app.db, 1, "self", mailCategoryDeleteQuery(null, "0", now), () => {
      throw new Error("Synthetic response failure");
    }),
  ).rejects.toThrow("Synthetic response failure");
  expect(app.queries.some((query) => query.text.startsWith("delete "))).toBe(false);
});

test("scalar conversation deletion ignores save flags and removes only the mapped type group", async () => {
  for (const [input, type, group] of [
    [5, 5, 200],
    [21, 10, 400],
    [18, 18, 300],
    [0, 21, undefined],
  ] as const) {
    const app = storage();
    await deleteMailType(app.db, 1, "self", mailTypeDeleteQuery(input, now));
    const deletes = app.queries.filter((query) => query.text.startsWith("delete "));
    expect(deletes[0]!.params).toEqual(["self", type, 0]);
    expect(deletes[0]!.text).not.toContain('"saveFlag"');
    expect(deletes).toHaveLength(group === undefined ? 1 : 2);
    if (group !== undefined) expect(deletes[1]!.params).toEqual(["self", group, ""]);
    expect(
      app.queries.some((query) =>
        /mail_contents|mail_update|mail_chat_read_intent/.test(query.text),
      ),
    ).toBe(false);
  }
});

function command() {
  const unused = async (): Promise<never> => {
    throw new Error("Unexpected dependency");
  };
  const app = storage();
  const db: GameStore = {
    getProfileById: unused,
    getAccountsByPlayerId: unused,
    getCityByPlayerId: unused,
    getWorldByPointIds: unused,
    getConfigurationByPlayerId: unused,
    getPowerByPlayerId: unused,
    getPlayerSummariesByIds: unused,
    publicProfile: unused,
    playerRanking: unused,
    allianceRanking: unused,
    mailStatus: unused,
    mailSave: unused,
    mailRead: unused,
    mailDelete: unused,
    mailGroups: unused,
    mailBatch: unused,
    mailCategory: unused,
    mailContents: unused,
    mailConversationSave: unused,
    mailCategoryDelete: (owner, query, inspect, invitations) =>
      deleteMailCategories(app.db, 1, owner, query, inspect, invitations),
    mailTypeDelete: (owner, query) => deleteMailType(app.db, 1, owner, query),
  };
  return {
    app,
    game: new Game(db, new Rules(new Map(), new Map(), new Map()), { kingdomId: 1 }, () => now),
  };
}

test("mail.delete.batch emits exact nested RetObj keys and correlation through the real adapter contract", async () => {
  const { app, game } = command();
  const result = await game.execute("self", "mail.delete.batch", {
    types: sfs.string("+0,００"),
    uids: sfs.string(""),
    uid: sfs.string("forged"),
    _cok_: sfs.string("token"),
    cmdBaseTime: sfs.long(9007199254740993n),
  });
  expect(decode(encode(result.body))).toEqual({
    RetObj: sfs.object({
      "+0": sfs.int(3),
      "total+0": sfs.int(7),
      "００": sfs.int(3),
      "total００": sfs.int(7),
    }),
    _cok_: sfs.string("token"),
    cmdBaseTime: sfs.long(9007199254740993n),
  });
  expect(result.pushes).toEqual([]);
  expect(app.queries.every((query) => !query.params.includes("forged"))).toBe(true);
  const empty = await game.execute("self", "mail.delete.batch", {});
  expect(empty.body).toEqual({ RetObj: sfs.object({}) });
});

test("unsupported sender deletion scopes reject before all persistence and malformed acknowledgments cannot delete", async () => {
  for (const [name, params] of [
    ["chatMail.delete", { fromUser: sfs.string("peer"), type: sfs.int(5) }],
    ["chatMail.delete", { fromUser: sfs.null() }],
    ["chatMail.delete.batch", { users: sfs.string("peer") }],
  ] as [string, Fields][]) {
    const { app, game } = command();
    await expect(game.execute("self", name, params)).rejects.toMatchObject({ code: "102192" });
    expect(app.queries).toEqual([]);
  }
  for (const name of ["mail.delete.batch", "chatMail.delete"]) {
    const { app, game } = command();
    await expect(
      game.execute("self", name, {
        type: sfs.int(5),
        types: sfs.string("0"),
        _cok_: sfs.string("x".repeat(65536)),
      }),
    ).rejects.toThrow();
    expect(app.queries.some((query) => query.text.startsWith("delete "))).toBe(false);
  }
});

test("chatMail.delete type-only replies acknowledge mapped deletions without unrelated effects", async () => {
  const { app, game } = command();
  const result = await game.execute("self", "chatMail.delete", {
    type: sfs.int(21),
    mod: sfs.int(1),
    _cok_: sfs.string("request"),
  });
  expect(result).toEqual({
    body: { success: sfs.bool(true), _cok_: sfs.string("request") },
    pushes: [],
  });
  expect(
    app.queries.find((query) => query.text.startsWith('delete from "opencok_kingdom"."mail"'))!
      .params,
  ).toEqual(["self", 10, 0]);
});

test("explicit ID deletion reaches the owned adapter selection and records deduplicated invalidations", async () => {
  const { app, game } = command();
  app.selected([["selected", 1, 1, "system", 0, 0]]);
  const result = await game.execute("self", "mail.delete.batch", {
    uids: sfs.string("selected,missing,selected"),
    uid: sfs.string("forged"),
    _cok_: sfs.string("request"),
  });
  expect(decode(encode(result.body))).toEqual({
    RetObj: sfs.object({}),
    _cok_: sfs.string("request"),
  });
  expect(result.pushes).toEqual([]);
  const selection = app.queries.find((query) => query.text.includes("octet_length("))!;
  expect(selection.params).toEqual(["self", "", "self", "selected", "missing"]);
  expect(selection.text).toContain('"opencok_kingdom"."mail"."toUser" =');
  const deletes = app.queries.filter((query) => query.text.startsWith("delete "));
  expect(deletes).toHaveLength(2);
  expect(deletes[0]!.params).toEqual(["self", "selected", "missing", 0, 0]);
  expect(deletes[0]!.text).toContain('"saveFlag" =');
  expect(deletes[0]!.text).toContain('"rewardStatus" <>');
  expect(deletes[1]!.params).toEqual(["selected", "self", ""]);
  const invalidation = app.queries.find((query) => query.text.startsWith("insert into"))!;
  expect(invalidation.text).toContain('"mail_update"');
  expect(invalidation.params).toEqual([
    "self",
    "selected",
    BigInt(now),
    "self",
    "missing",
    BigInt(now),
  ]);
  expect(app.queries.every((query) => !query.params.includes("forged"))).toBe(true);
  expect(app.queries.at(-1)!.text).toBe("commit");
});

test("explicit chat IDs reject and roll back before deletion or invalidation", async () => {
  const { app, game } = command();
  app.selected([["selected", 20, 1, "peer", 0, 0]]);
  await expect(
    game.execute("self", "mail.delete.batch", { uids: sfs.string("selected") }),
  ).rejects.toMatchObject({ code: "102192" });
  expect(app.queries.some((query) => /^(delete|insert|update) /.test(query.text))).toBe(false);
  expect(app.queries.at(-1)!.text).toBe("rollback");
});

test("mixed chat ID deletion enqueues the source cross-product while scoping local conversations independently", async () => {
  const app = storage();
  app.selected([
    ["personal", 20, 1, "peer-a", 0, 0],
    ["moderator", 23, 1, "peer-b", 0, 0],
  ]);
  await deleteMailCategories(
    app.db,
    1,
    "self",
    mailCategoryDeleteQuery("personal,moderator", null, now),
    () => {},
    () => [],
    true,
  );
  const outbox = app.queries.find((query) =>
    query.text.includes('insert into "opencok_kingdom"."mail_chat_read_intent"'),
  )!;
  expect(outbox.params).toContain("peer-a");
  expect(outbox.params).toContain("peer-b");
  expect(outbox.params.filter((value) => value === "1,2,20")).toHaveLength(2);
  const deletions = app.queries.filter((query) =>
    query.text.startsWith('delete from "opencok_kingdom"."mail"'),
  );
  expect(deletions[0]!.params).toEqual(["self", "peer-a", 20, 21, 22]);
  expect(deletions[1]!.params).toEqual(["self", "peer-b", 23, 24]);
  expect(app.queries.at(-1)!.text).toBe("commit");
});
