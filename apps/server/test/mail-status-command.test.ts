import { expect, test } from "bun:test";
import type { GameStore } from "@opencok/contracts/game";
import type { MailStatusQuery, MailStatusSnapshot } from "@opencok/contracts/mail";
import type { Row } from "@opencok/contracts/rows";
import { Game } from "@opencok/controllers/game";
import { Rules } from "@opencok/rules/game";
import { decode, encode, sfs } from "@opencok/messages/sfs";

const now = 1792756800000;
const unused = async (): Promise<never> => {
  throw new Error("Unexpected dependency call");
};
function fixture() {
  let clocks = 0;
  const calls: { uid: string; query: MailStatusQuery }[] = [];
  const state: MailStatusSnapshot = {
    profile: { uid: "self", serverId: 1, banTime: 0n, banFlag: 0 },
    counts: [{ type: 2, status: 0, allianceNotice: false, count: 3n }],
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
    mailGroups: unused,
    mailBatch: unused,
    mailCategory: unused,
    mailContents: unused,
    mailConversationSave: unused,
    mailDelete: unused,
    mailRead: unused,
    mailSave: unused,
    mailStatus: async (uid, query) => {
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

test("mail category status uses authenticated recipient, one snapshot clock and compatible response widths", async () => {
  for (const category of [undefined, 1, 99]) {
    const { game, calls, clocks } = fixture();
    const result = await game.execute("self", "mail.category.status", {
      uid: sfs.string("forged"),
      toUser: sfs.string("other"),
      ...(category === undefined ? {} : { category: sfs.int(category) }),
      _cok_: sfs.string("request"),
      cmdBaseTime: sfs.long(123),
    });
    expect(calls).toEqual([{ uid: "self", query: { category, now } }]);
    expect(clocks()).toBe(1);
    expect(result.pushes).toEqual([]);
    const body =
      category === undefined
        ? Object.fromEntries(
            Array.from({ length: 8 }, (_, i) => [
              String(i + 1),
              sfs.object({ total: sfs.int(i === 0 ? 3 : 0), unread: sfs.int(i === 0 ? 3 : 0) }),
            ]),
          )
        : category === 1
          ? { total: sfs.long(3), unread: sfs.long(3) }
          : { success: sfs.bool(true) };
    expect(decode(encode(result.body))).toEqual({
      ...body,
      _cok_: sfs.string("request"),
      cmdBaseTime: sfs.long(123),
    });
  }
});

test("mail category status rejects forged ownership, banned profiles, malformed wire types and failed providers", async () => {
  const profiles: (Row | undefined)[] = [
    undefined,
    { uid: "self", serverId: 1, banFlag: 1 },
    { uid: "self", serverId: 1, banTime: BigInt(now + 1) },
    { uid: "other", serverId: 1 },
    { uid: "self", serverId: 2 },
  ];
  for (const profile of profiles) {
    const { state, game } = fixture();
    state.profile = profile;
    await expect(game.execute("self", "mail.category.status", {})).rejects.toThrow();
  }
  for (const category of [
    sfs.string("1"),
    sfs.long(1),
    sfs.bool(true),
    sfs.null(),
    sfs.double(1.5),
  ]) {
    const { game, calls } = fixture();
    await expect(game.execute("self", "mail.category.status", { category })).rejects.toThrow();
    expect(calls).toEqual([]);
  }
  const failed = fixture();
  failed.db.mailStatus = async () => {
    throw new Error("Synthetic mailbox failure");
  };
  await expect(failed.game.execute("self", "mail.category.status", {})).rejects.toThrow(
    "Synthetic mailbox failure",
  );
});
