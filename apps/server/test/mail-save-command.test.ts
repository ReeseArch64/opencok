import { expect, test } from "bun:test";
import type { GameStore } from "@opencok/contracts/game";
import type { MailSaveQuery, MailSaveSnapshot } from "@opencok/contracts/mail";
import type { Row } from "@opencok/contracts/rows";
import { Game } from "@opencok/controllers/game";
import { Rules } from "@opencok/rules/game";
import { decode, encode, sfs, type Fields } from "@opencok/messages/sfs";

const now = 1792756800000;
const unused = async (): Promise<never> => {
  throw new Error("Unexpected dependency call");
};
function fixture() {
  let clocks = 0;
  const calls: { uid: string; query: MailSaveQuery }[] = [];
  const state: MailSaveSnapshot = {
    profile: { uid: "self", serverId: 1, banTime: 0n, banFlag: 0 },
    result: "save",
  };
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
    mailGroups: unused,
    mailBatch: unused,
    mailCategory: unused,
    mailContents: unused,
    mailConversationSave: unused,
    mailDelete: unused,
    mailRead: unused,
    mailSave: async (uid, query) => {
      calls.push({ uid, query });
      return state;
    },
  };
  const game = new Game(db, new Rules(new Map(), new Map(), new Map()), { kingdomId: 1 }, () => {
    clocks++;
    return now;
  });
  return { db, state, calls, game, clocks: () => clocks };
}

test("save commands distinguish recipient from mail IDs, use one timestamp and encode legacy result strings", async () => {
  const cases: { command: string; params: Fields; query: MailSaveQuery }[] = [
    {
      command: "mail.save",
      params: { uid: sfs.string("a"), type: sfs.int(99) },
      query: { mode: "save", ids: ["a"], flag: 1, now },
    },
    {
      command: "mail.cancel.save",
      params: { uid: sfs.string("a"), type: sfs.int(-1) },
      query: { mode: "cancel", ids: ["a"], flag: 0, now },
    },
    {
      command: "mail.save.batch",
      params: { uids: sfs.string("a,,b,a"), flag: sfs.int(2) },
      query: { mode: "batch", ids: ["a", "b"], flag: 0, now },
    },
  ];
  for (const entry of cases) {
    for (const result of [
      entry.command === "mail.cancel.save" ? ("cancel" as const) : ("save" as const),
      "unchanged" as const,
    ]) {
      const { state, game, calls, clocks } = fixture();
      state.result = result;
      const response = await game.execute("self", entry.command, {
        ...entry.params,
        toUser: sfs.string("other"),
        owner: sfs.string("other"),
        serverId: sfs.int(2),
        _cok_: sfs.string("request"),
        cmdBaseTime: sfs.long(123),
      });
      expect(calls).toEqual([{ uid: "self", query: entry.query }]);
      expect(clocks()).toBe(1);
      expect(response.pushes).toEqual([]);
      expect(decode(encode(response.body))).toEqual({
        ...(result === "unchanged"
          ? { success: sfs.bool(true) }
          : { [result]: sfs.string("success") }),
        _cok_: sfs.string("request"),
        cmdBaseTime: sfs.long(123),
      });
    }
  }
});

test("save commands reject malformed wire types and batches before invoking persistence", async () => {
  const cases: { command: string; params: Fields }[] = [
    { command: "mail.save", params: {} },
    { command: "mail.save", params: { uid: sfs.string("a"), type: sfs.long(1) } },
    { command: "mail.cancel.save", params: { uid: sfs.int(1), type: sfs.int(1) } },
    { command: "mail.save.batch", params: { uids: sfs.string("a"), flag: sfs.bool(true) } },
    { command: "mail.save.batch", params: { uids: sfs.array(), flag: sfs.int(1) } },
    { command: "mail.save.batch", params: { uids: sfs.string("a"), flag: sfs.int(1.5) } },
    { command: "mail.save", params: { uid: sfs.string("x".repeat(41)), type: sfs.int(1) } },
    {
      command: "mail.save.batch",
      params: {
        uids: sfs.string(Array.from({ length: 1001 }, () => "a").join(",")),
        flag: sfs.int(1),
      },
    },
  ];
  for (const { command, params } of cases) {
    const { game, calls } = fixture();
    await expect(game.execute("self", command, params)).rejects.toThrow();
    expect(calls).toEqual([]);
  }
});

test("save commands reject invalid owner snapshots and dependency failures without success responses", async () => {
  const profiles: (Row | undefined)[] = [
    undefined,
    { uid: "other", serverId: 1 },
    { uid: "self", serverId: 2 },
    { uid: "self", serverId: 1, banFlag: 1 },
    { uid: "self", serverId: 1, banTime: BigInt(now + 1) },
  ];
  for (const profile of profiles) {
    const { state, game } = fixture();
    state.profile = profile;
    await expect(
      game.execute("self", "mail.save", { uid: sfs.string("a"), type: sfs.int(1) }),
    ).rejects.toThrow();
  }
  const { db, game } = fixture();
  db.mailSave = async () => {
    throw new Error("Synthetic mailbox failure");
  };
  await expect(
    game.execute("self", "mail.save.batch", { uids: sfs.string("a"), flag: sfs.int(1) }),
  ).rejects.toThrow("Synthetic mailbox failure");
});
