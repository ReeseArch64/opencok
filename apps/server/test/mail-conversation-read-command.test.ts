import { expect, test } from "bun:test";
import type { GameStore } from "@opencok/contracts/game";
import type { Row } from "@opencok/contracts/rows";
import type {
  MailConversationReadQuery,
  MailConversationReadSnapshot,
} from "@opencok/contracts/mail";
import { GameService as Game } from "@opencok/services/game";
import { Database } from "@opencok/repositories/game";
import { Rules } from "@opencok/rules/game";
import { decode, encode, sfs, type Fields } from "@opencok/messages/sfs";

const now = 1792756800000;
const unused = async (): Promise<never> => {
  throw new Error("Unexpected dependency");
};

function fixture() {
  const calls: { uid: string; query: MailConversationReadQuery }[] = [];
  const state: MailConversationReadSnapshot = {
    profile: { uid: "self", serverId: 1, banTime: 0n, banFlag: 0 },
  };
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
    mailConversationRead: async (uid, query) => {
      calls.push({ uid, query });
      return state;
    },
  };
  const game = new Game(
    db,
    new Rules(new Map(), new Map(), new Map()),
    { kingdomId: 1 },
    () => now,
  );
  return { game, state, db, calls };
}

test("chatMail.read connects scalar and list-only read assignments with owner identity and correlation", async () => {
  const cases: [Fields, number[]][] = [
    [{ type: sfs.int(0) }, [21]],
    [{ type: sfs.int(-2147483648) }, [-2147483648]],
    [{ types: sfs.string("0,,1,20,") }, [21, 22, 20]],
    [{ type: sfs.int(14), types: sfs.string("+4,１０,4") }, [12, 7, 14, 7]],
    [{ types: sfs.string("20,1,0") }, [20, 22, 21]],
    [{ types: sfs.string(",,,") }, []],
    [{ driftingBottle: sfs.string("unused") }, []],
  ];
  for (const [params, types] of cases) {
    const app = fixture();
    const reply = await app.game.execute("self", "chatMail.read", {
      ...params,
      uid: sfs.string("forged"),
      toUser: sfs.string("other"),
      serverId: sfs.int(99),
      _cok_: sfs.string("correlation"),
      cmdBaseTime: sfs.long(9007199254740993n),
    });
    expect(app.calls).toEqual([
      {
        uid: "self",
        query: {
          now,
          effects: types.map((type) => ({ kind: "mail", types: [type], unreadOnly: true })),
        },
      },
    ]);
    expect(decode(encode(reply.body))).toEqual({
      success: sfs.bool(true),
      _cok_: sfs.string("correlation"),
      cmdBaseTime: sfs.long(9007199254740993n),
    });
    expect(reply.pushes).toEqual([]);
  }
});

test("chat-dependent conversation reads remain unavailable before any owned mailbox assignment", async () => {
  const cases: Fields[] = [
    { fromUser: sfs.string("peer") },
    { fromUser: sfs.string(""), mod: sfs.int(1) },
    { fromUser: sfs.null(), driftingBottle: sfs.int(1) },
    { fromUser: sfs.string("peer,other"), type: sfs.string("ignored") },
    { types: sfs.string("0,1,20") },
    { type: sfs.int(4), types: sfs.string("0,1,20") },
  ];
  for (const params of cases) {
    const app = fixture();
    await expect(app.game.execute("self", "chatMail.read", params)).rejects.toMatchObject({
      code: "102192",
    });
    expect(app.calls).toEqual([]);
  }
  const context = {
    config: {},
    get kingdom(): never {
      throw new Error("Must not enter persistence");
    },
  } as unknown as Database;
  expect(() =>
    Database.prototype.mailConversationRead.call(context, "self", {
      now,
      effects: [{ kind: "chat", others: "", types: ["1", "20"] }],
    }),
  ).toThrow("chat read delivery unavailable");
});

test("malformed consumed request fields or acknowledgment encoding reject before writes", async () => {
  const inputs: Fields[] = [
    { mod: sfs.string("0") },
    { type: sfs.string("0") },
    { types: sfs.int(0) },
    { types: sfs.string("4,bad") },
    { type: sfs.int(4), _cok_: sfs.string("x".repeat(65536)) },
  ];
  for (const params of inputs) {
    const app = fixture();
    await expect(app.game.execute("self", "chatMail.read", params)).rejects.toThrow();
    expect(app.calls).toEqual([]);
  }
});

test("mail read type commands reject missing foreign or banned owner snapshots", async () => {
  const profiles: (Row | undefined)[] = [
    undefined,
    { uid: "other", serverId: 1 },
    { uid: "self", serverId: 2 },
    { uid: "self", serverId: 1, banFlag: 1 },
    { uid: "self", serverId: 1, banTime: BigInt(now + 1) },
  ];
  for (const profile of profiles) {
    const app = fixture();
    app.state.profile = profile;
    await expect(app.game.execute("self", "chatMail.read", { type: sfs.int(4) })).rejects.toThrow();
    expect(app.calls).toHaveLength(1);
  }
});

test("missing mail read adapters and persistence failures cannot return a success acknowledgment", async () => {
  const missing = fixture();
  delete missing.db.mailConversationRead;
  await expect(
    missing.game.execute("self", "chatMail.read", { type: sfs.int(4) }),
  ).rejects.toMatchObject({ code: "102192" });
  expect(missing.calls).toEqual([]);
  const failed = fixture();
  failed.db.mailConversationRead = async () => {
    throw new Error("Synthetic persistence failure");
  };
  await expect(failed.game.execute("self", "chatMail.read", { type: sfs.int(4) })).rejects.toThrow(
    "Synthetic persistence failure",
  );
});
