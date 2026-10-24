import { expect, test } from "bun:test";
import { drizzle, type NodePgClient } from "drizzle-orm/node-postgres";
import * as schema from "@opencok/drizzle/schema/kingdom";
import type { GameStore } from "@opencok/contracts/game";
import type { MailUpdateEntry } from "@opencok/contracts/mail-updates";
import { Game } from "@opencok/controllers/game";
import { mailUpdateCursor, mailUpdatesProjection } from "@opencok/controllers/mail-updates";
import { readMailUpdates } from "@opencok/repositories/mail-updates";
import { Rules } from "@opencok/rules/game";
import { decode, encode, sfs, type Fields } from "@opencok/messages/sfs";

const now = 1792756800000;
const profile = { uid: "self", serverId: 1, banTime: 0n, banFlag: 0 };
const entry = (uid: string, updateTime = 10n): MailUpdateEntry => ({
  uid,
  updateTime,
  flags: { status: 1, rewardStatus: -1, saveFlag: 0 },
});

function fixture() {
  let markers = [
    { owner: "self", uid: "owned", time: 10n },
    { owner: "self", uid: "absent", time: 11n },
    { owner: "self", uid: "foreign", time: 12n },
    { owner: "self", uid: "older", time: 1n },
    { owner: "self", uid: "boundary", time: 2n },
    { owner: "other", uid: "private-marker", time: 1n },
  ];
  const mails = new Map([
    ["owned", { owner: "self", status: null, rewardStatus: -1, saveFlag: 1 }],
    ["foreign", { owner: "other", status: 99, rewardStatus: 99, saveFlag: 99 }],
  ]);
  const queries: { text: string; params: unknown[] }[] = [];
  let before = structuredClone(markers);
  let savedProfile: unknown[] | null = ["self", 1, "0", 0];
  let failure = "";
  const client = {
    query: async (query: { text: string }, params: unknown[] = []) => {
      const text = query.text;
      queries.push({ text, params });
      if (text.startsWith("begin")) before = structuredClone(markers);
      if (text === "rollback") markers = before;
      if (text.includes('from "opencok_kingdom"."userprofile"')) {
        expect(text).toEndWith("for update");
        return { rows: savedProfile ? [savedProfile] : [] };
      }
      if (text.startsWith("select") && text.includes('"mail_update"')) {
        if (failure === "select") throw new Error("synthetic marker read failure");
        expect(text).toContain("left join");
        expect(text).toContain('"mail_update"."toUser" = $1');
        expect(text).toContain('"mail_update"."updateTime" >= $2');
        expect(text).not.toContain('"contents"');
        const [owner, after, limit] = params as [string, string, number];
        return {
          rows: markers
            .filter((marker) => marker.owner === owner && marker.time >= BigInt(after))
            .toSorted((a, b) => a.uid.localeCompare(b.uid))
            .slice(0, limit)
            .map((marker) => {
              const mail = mails.get(marker.uid);
              return [
                marker.uid,
                String(marker.time),
                mail?.owner ?? null,
                mail?.status ?? null,
                mail?.rewardStatus ?? null,
                mail?.saveFlag ?? null,
              ];
            }),
        };
      }
      if (text.startsWith("delete")) {
        if (failure === "delete") throw new Error("synthetic marker cleanup failure");
        expect(text).toStartWith('delete from "opencok_kingdom"."mail_update"');
        const owner = params[0];
        if (text.includes(" < ")) {
          const after = BigInt(params[1] as string),
            cutoff = BigInt(params[2] as string);
          markers = markers.filter(
            (row) => !(row.owner === owner && row.time < after && row.time < cutoff),
          );
        } else {
          expect(params.length).toBeLessThanOrEqual(1001);
          markers = markers.filter((row) => {
            if (row.owner !== owner) return true;
            for (let index = 1; index < params.length; index += 2)
              if (row.uid === params[index] && row.time === BigInt(params[index + 1] as string))
                return false;
            return true;
          });
        }
      }
      if (text === "commit" && failure === "commit") throw new Error("synthetic commit failure");
      return { rows: [] };
    },
  };
  return {
    db: drizzle(client as unknown as NodePgClient, { schema }),
    queries,
    markers: () => structuredClone(markers),
    setMarkers: (rows: typeof markers) => {
      markers = rows;
    },
    setProfile: (row: unknown[] | null) => {
      savedProfile = row;
    },
    fail: (stage: string) => {
      failure = stage;
    },
  };
}

test("mail cursor preserves Java signed Long parsing and uses zero on reached parse failure", () => {
  for (const [raw, expected] of [
    ["+１２", 12n],
    ["-1", -1n],
    ["9223372036854775807", 9223372036854775807n],
    ["-9223372036854775808", -9223372036854775808n],
  ] as const)
    expect(mailUpdateCursor(raw)).toBe(expected);
  for (const raw of [
    null,
    "",
    " 1",
    "1 ",
    "0x10",
    "1.0",
    "9223372036854775808",
    "-9223372036854775809",
  ])
    expect(mailUpdateCursor(raw)).toBe(0n);
});

test("mail update JSON preserves long precision and never includes absent or foreign flags", () => {
  const body = mailUpdatesProjection([
    entry('a"\\', 9007199254740993n),
    { uid: "gone", updateTime: 12n, flags: null },
  ]);
  expect(decode(encode(body))).toEqual(body);
  expect(body).toEqual({
    data: sfs.string(
      '{"update":[{"uid":"a\\\"\\\\","status":1,"rewardStatus":-1,"saveFlag":0,"mailLastUpdateTime":9007199254740993}],"delete":["gone"]}',
    ),
  });
  expect(mailUpdatesProjection([])).toEqual({ data: sfs.string('{"update":[],"delete":[]}') });
});

test("mail updates switch to the original chunk envelope at exactly 32767 UTF-16 units", () => {
  for (const length of [32766, 32767, 40000]) {
    const empty = '{"update":[],"delete":[]}';
    const count = Math.ceil((length - empty.length + 1) / 43);
    const rows: MailUpdateEntry[] = Array.from({ length: count }, (_, index) => ({
      uid: String(index).padStart(6, "0").padEnd(40, "x"),
      updateTime: 1n,
      flags: null,
    }));
    const raw = () =>
      `{"update":[],"delete":[${rows.map((row) => JSON.stringify(row.uid)).join(",")}]}`;
    let excess = raw().length - length;
    for (let index = rows.length - 1; excess > 0; index--) {
      const row = rows[index]!;
      const remove = Math.min(excess, row.uid.length - 6);
      row.uid = row.uid.slice(0, row.uid.length - remove);
      excess -= remove;
    }
    expect(raw()).toHaveLength(length);
    const body = mailUpdatesProjection(rows);
    if (length < 32767) expect(body).toEqual({ data: sfs.string(raw()) });
    else {
      expect(body.data).toEqual(sfs.string(""));
      const chunks = body.updatemailArr!.value as { value: string }[];
      expect(chunks.map((chunk) => chunk.value).join("")).toBe(raw());
      expect(chunks.every((chunk) => chunk.value.length <= 5000)).toBe(true);
    }
  }
});

test("mail marker reader selects inclusive deltas and removes only foreign markers after inspection", async () => {
  const app = fixture();
  let inspected = false;
  const result = await readMailUpdates(app.db, 1, "self", { after: 10n, now }, (rows) => {
    expect(app.queries.some((query) => query.text.startsWith("delete"))).toBe(false);
    expect(rows).toEqual([
      { uid: "absent", updateTime: 11n, flags: null },
      { uid: "foreign", updateTime: 12n, flags: null },
      { uid: "owned", updateTime: 10n, flags: { status: 0, rewardStatus: -1, saveFlag: 1 } },
    ]);
    mailUpdatesProjection(rows);
    inspected = true;
  });
  expect(inspected).toBe(true);
  expect(result.profile).toEqual(profile);
  expect(app.markers().map((row) => row.uid)).toEqual([
    "owned",
    "absent",
    "older",
    "boundary",
    "private-marker",
  ]);
  expect(app.queries[0]!.text).toBe("begin isolation level repeatable read read write");
  expect(app.queries.at(-1)!.text).toBe("commit");
});

test("mail marker aging retains the exact five-day cutoff and signed cursor extremes", async () => {
  const app = fixture();
  await readMailUpdates(app.db, 1, "self", { after: 432000002n, now }, () => {});
  expect(app.markers().some((row) => row.uid === "older")).toBe(false);
  expect(app.markers().some((row) => row.uid === "boundary")).toBe(true);
  expect(app.markers().some((row) => row.owner === "other")).toBe(true);
  for (const after of [-9223372036854775808n, -1n, 0n]) {
    const instance = fixture();
    await readMailUpdates(instance.db, 1, "self", { after, now }, () => {});
    expect(instance.markers().some((row) => row.uid === "older")).toBe(true);
  }
});

test("mail marker reads reject unauthorized owners and roll back cleanup after reached failures", async () => {
  for (const row of [
    null,
    ["other", 1, "0", 0],
    ["self", 2, "0", 0],
    ["self", 1, "0", 1],
    ["self", 1, String(now + 1), 0],
  ]) {
    const app = fixture();
    app.setProfile(row);
    let inspected = false;
    await readMailUpdates(app.db, 1, "self", { after: 0n, now }, () => {
      inspected = true;
    });
    expect(inspected).toBe(false);
    expect(app.queries).toHaveLength(3);
  }
  for (const stage of ["select", "delete", "commit", "inspect"]) {
    const app = fixture();
    const before = app.markers();
    app.fail(stage);
    await expect(
      readMailUpdates(app.db, 1, "self", { after: 0n, now }, async () => {
        if (stage === "inspect") throw new Error("synthetic projection failure");
      }),
    ).rejects.toThrow();
    expect(app.markers()).toEqual(before);
    expect(app.queries.at(-1)!.text).toBe("rollback");
  }
});

test("foreign cleanup matches the observed timestamp and complete deltas reject overflow", async () => {
  const app = fixture();
  await readMailUpdates(app.db, 1, "self", { after: 0n, now }, () => {
    app.setMarkers(
      app.markers().map((row) => (row.uid === "foreign" ? { ...row, time: 13n } : row)),
    );
  });
  expect(app.markers().find((row) => row.uid === "foreign")?.time).toBe(13n);
  const large = fixture();
  large.setMarkers(
    Array.from({ length: 10001 }, (_, index) => ({ owner: "self", uid: `m${index}`, time: 1n })),
  );
  let inspected = false;
  await expect(
    readMailUpdates(large.db, 1, "self", { after: 0n, now }, () => {
      inspected = true;
    }),
  ).rejects.toThrow("mail updates limit");
  expect(inspected).toBe(false);
  expect(large.queries.some((query) => query.text.startsWith("delete"))).toBe(false);
});

test("authenticated mail update command preserves optional time correlation and unsupported dependencies", async () => {
  const calls: unknown[] = [];
  const unused = async (): Promise<never> => {
    throw new Error("Unexpected mail update dependency");
  };
  const db: GameStore = {
    profile: async () => profile,
    accounts: unused,
    city: unused,
    world: unused,
    configuration: unused,
    power: unused,
    playerSummaries: unused,
    publicProfile: unused,
    playerRanking: unused,
    allianceRanking: unused,
    mailStatus: unused,
    mailSave: unused,
    mailRead: unused,
    mailGroups: unused,
    mailBatch: unused,
    mailCategory: unused,
    mailContents: unused,
    mailConversationSave: unused,
    mailDelete: unused,
    mailUpdates: async (uid, query, inspect) => {
      calls.push({ uid, query });
      await inspect([entry("owned")]);
      return { profile };
    },
  };
  const game = new Game(
    db,
    new Rules(new Map(), new Map(), new Map()),
    { kingdomId: 1 },
    () => now,
  );
  await game.execute("self", "chat.get.update.mails", {});
  expect(calls).toEqual([]);
  for (const time of [sfs.string("bad"), sfs.string(""), sfs.null()]) {
    const reply = await game.execute("self", "chat.get.update.mails", {
      time,
      _cok_: sfs.string("request"),
      cmdBaseTime: sfs.long(42),
    });
    expect(calls.at(-1)).toEqual({ uid: "self", query: { after: 0n, now } });
    expect(reply.body._cok_).toEqual(sfs.string("request"));
    expect(reply.body.cmdBaseTime).toEqual(sfs.long(42));
    expect(reply.pushes).toEqual([]);
  }
  for (const time of [sfs.int(1), sfs.long(1), sfs.array()])
    await expect(game.execute("self", "chat.get.update.mails", { time })).rejects.toThrow();
  db.mailUpdates = undefined;
  await expect(
    game.execute("self", "chat.get.update.mails", { time: sfs.string("0") }),
  ).rejects.toThrow();
  db.profile = async () => ({ ...profile, uid: "other" });
  await expect(game.execute("self", "chat.get.update.mails", {} as Fields)).rejects.toThrow();
});
