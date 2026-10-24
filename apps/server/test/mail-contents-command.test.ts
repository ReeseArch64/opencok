import { expect, test } from "bun:test";
import type { GameStore } from "@opencok/contracts/game";
import type {
  MailContentsEntry,
  MailContentsQuery,
  MailContentsSnapshot,
} from "@opencok/contracts/mail";
import type { Row } from "@opencok/contracts/rows";
import { Game } from "@opencok/controllers/game";
import { Rules } from "@opencok/rules/game";
import { decode, encode, sfs, type Fields } from "@opencok/messages/sfs";

const now = 1792756800000;
const unused = async (): Promise<never> => {
  throw new Error("Unexpected dependency");
};
function fixture() {
  const calls: { uid: string; query: MailContentsQuery }[] = [];
  const state: MailContentsSnapshot = {
    profile: { uid: "self", serverId: 1, banTime: 0n, banFlag: 0 },
  };
  const entries: MailContentsEntry[] = [];
  let clocks = 0;
  const db: GameStore = {
    profile: unused,
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
    mailDelete: unused,
    mailConversationSave: unused,
    mailCategory: unused,
    mailContents: async (uid, query, inspect) => {
      calls.push({ uid, query });
      inspect(entries);
      return state;
    },
  };
  const game = new Game(db, new Rules(new Map(), new Map(), new Map()), { kingdomId: 1 }, () => {
    clocks++;
    return now;
  });
  return { game, state, db, calls, entries, clocks: () => clocks };
}

test("mail.read binds the recipient, decodes stored types and preserves correlation without status writes", async () => {
  const { game, calls, clocks, entries } = fixture();
  entries.push({
    uid: "one",
    type: 2,
    createTime: 12n,
    contents: Buffer.from("message"),
    extra: null,
  });
  const result = await game.execute("self", "mail.read", {
    uid: sfs.string("|one||two|one|"),
    type: sfs.string("ignored"),
    toUser: sfs.string("foreign"),
    serverId: sfs.int(2),
    _cok_: sfs.int(7),
    cmdBaseTime: sfs.long(8),
  });
  expect(calls).toEqual([{ uid: "self", query: { ids: ["one", "two"], now } }]);
  expect(clocks()).toBe(1);
  expect(result.pushes).toEqual([]);
  expect(decode(encode(result.body))).toEqual({
    result: sfs.array([
      sfs.object({
        contents: sfs.string("message"),
        createTime: sfs.long(12),
        u: sfs.string("one"),
        contentStr: sfs.string(""),
        contentsArr: sfs.array([sfs.string("message")]),
      }),
    ]),
    _cok_: sfs.int(7),
    cmdBaseTime: sfs.long(8),
  });
  entries.length = 0;
  expect(
    (await game.execute("self", "mail.read", { uid: sfs.string("missing"), type: sfs.string("") }))
      .body,
  ).toEqual({ result: sfs.array() });
});

test("mail.read validates consumed wire fields and owner snapshots, propagating storage and projection failures", async () => {
  const invalidParams: Fields[] = [
    {},
    { uid: sfs.int(1), type: sfs.string("") },
    { uid: sfs.string("id") },
    { uid: sfs.string("id"), type: sfs.int(1) },
    { uid: sfs.string("id"), type: sfs.string(undefined as never) },
    { uid: sfs.string("||"), type: sfs.string("") },
  ];
  for (const params of invalidParams) {
    const { game, calls } = fixture();
    await expect(game.execute("self", "mail.read", params)).rejects.toThrow();
    expect(calls).toEqual([]);
  }
  const invalidProfiles: (Row | undefined)[] = [
    undefined,
    { uid: "foreign", serverId: 1 },
    { uid: "self", serverId: 2 },
    { uid: "self", serverId: 1, banFlag: 1 },
    { uid: "self", serverId: 1, banTime: BigInt(now + 1) },
  ];
  for (const profile of invalidProfiles) {
    const { game, state } = fixture();
    state.profile = profile;
    await expect(
      game.execute("self", "mail.read", { uid: sfs.string("id"), type: sfs.string("") }),
    ).rejects.toThrow();
  }
  const { game, db, entries } = fixture();
  entries.push({ uid: "id", type: 2, createTime: 1n, contents: Buffer.from("extra"), extra: null });
  await expect(
    game.execute("self", "mail.read", { uid: sfs.string("id"), type: sfs.string("") }),
  ).rejects.toThrow("Missing persisted mail contents");
  db.mailContents = async () => {
    throw new Error("Synthetic content failure");
  };
  await expect(
    game.execute("self", "mail.read", { uid: sfs.string("id"), type: sfs.string("") }),
  ).rejects.toThrow("Synthetic content failure");
});

test("mail.read validates the correlated response before submitting malformed-message removals", async () => {
  const { game, db } = fixture();
  const plans: string[][] = [];
  db.mailContents = async (_uid, _query, inspect) => {
    plans.push([
      ...inspect([
        { uid: "bad", type: 5, createTime: 1n, contents: Buffer.from("invalid"), extra: null },
      ]),
    ]);
    return { profile: { uid: "self", serverId: 1 } };
  };
  expect(
    (await game.execute("self", "mail.read", { uid: sfs.string("bad"), type: sfs.string("") }))
      .body,
  ).toEqual({ result: sfs.array() });
  expect(plans).toEqual([["bad"]]);
  plans.length = 0;
  await expect(
    game.execute("self", "mail.read", {
      uid: sfs.string("bad"),
      type: sfs.string(""),
      _cok_: sfs.string("x".repeat(32768)),
    }),
  ).rejects.toThrow();
  expect(plans).toEqual([]);
});
