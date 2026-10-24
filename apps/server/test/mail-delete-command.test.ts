import { expect, test } from "bun:test";
import type { GameStore } from "@opencok/contracts/game";
import type {
  MailDeletePlanner,
  MailDeleteQuery,
  MailDeleteSnapshot,
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
  const calls: { uid: string; query: MailDeleteQuery; plan: MailDeletePlanner }[] = [];
  const state: MailDeleteSnapshot = {
    profile: { uid: "self", serverId: 1, banTime: 0n, banFlag: 0 },
    deleted: 2,
  };
  let clocks = 0;
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
    mailContents: unused,
    mailConversationSave: unused,
    mailDelete: async (uid, query, plan) => {
      calls.push({ uid, query, plan });
      return state;
    },
  };
  const game = new Game(db, new Rules(new Map(), new Map(), new Map()), { kingdomId: 1 }, () => {
    clocks++;
    return now;
  });
  return { game, db, state, calls, clocks: () => clocks };
}

test("ordinary deletion returns the actual typed count and supplies owned cleanup policy to one transaction", async () => {
  for (const deleted of [0, 2]) {
    const { game, state, calls, clocks } = fixture();
    state.deleted = deleted;
    const result = await game.execute("self", "mail.delete", {
      uids: sfs.string("a,,b,a"),
      num: sfs.int(-123),
      types: sfs.object(),
      toUser: sfs.string("forged"),
      serverId: sfs.int(2),
      _cok_: sfs.string("request"),
      cmdBaseTime: sfs.long(456),
    });
    expect(calls.map(({ uid, query }) => ({ uid, query }))).toEqual([
      { uid: "self", query: { ids: ["a", "b"], now } },
    ]);
    expect(clocks()).toBe(1);
    expect(decode(encode(result.body))).toEqual({
      delete: sfs.int(deleted),
      _cok_: sfs.string("request"),
      cmdBaseTime: sfs.long(456),
    });
    expect(result.pushes).toEqual([]);
    expect(
      calls[0]?.plan([
        {
          uid: "a",
          type: 26,
          fromUser: "host",
          contents: Buffer.from('{"inviterUid":"host","inviteeUid":"self"}'),
          extra: null,
        },
      ]),
    ).toEqual({ groups: [{ groupType: 26, groupIndex: "a", types: [] }], inviters: ["host"] });
  }
  const { game, calls } = fixture();
  await game.execute("self", "mail.delete", { uids: sfs.string("") });
  expect(calls[0]?.query.ids).toEqual([]);
});

test("ordinary deletion rejects malformed wire requests and unauthorized snapshots", async () => {
  const inputs: Fields[] = [
    {},
    { uids: sfs.array() },
    { uids: sfs.string("a"), num: sfs.long(1) },
    { uids: sfs.string("a"), num: sfs.int(1.5) },
    { uids: sfs.string("a"), num: sfs.int(2147483648) },
    { uids: sfs.string("a,".repeat(1001)) },
  ];
  for (const input of inputs) {
    const { game, calls } = fixture();
    await expect(game.execute("self", "mail.delete", input)).rejects.toThrow();
    expect(calls).toEqual([]);
  }
  const profiles: (Row | undefined)[] = [
    undefined,
    { uid: "other", serverId: 1 },
    { uid: "self", serverId: 2 },
    { uid: "self", serverId: 1, banFlag: 1 },
    { uid: "self", serverId: 1, banTime: BigInt(now + 1) },
  ];
  for (const profile of profiles) {
    const { game, state } = fixture();
    state.profile = profile;
    await expect(game.execute("self", "mail.delete", { uids: sfs.string("a") })).rejects.toThrow();
  }
  const { game, db } = fixture();
  db.mailDelete = async () => {
    throw new Error("Synthetic deletion failure");
  };
  await expect(game.execute("self", "mail.delete", { uids: sfs.string("a") })).rejects.toThrow(
    "Synthetic deletion failure",
  );
});
