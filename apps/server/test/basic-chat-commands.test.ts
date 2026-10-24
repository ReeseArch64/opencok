import { expect, test } from "bun:test";
import type {
  ChatMessage,
  CommandContext,
  Frame,
  MessageInput,
  MessageStore,
  PlayerState,
} from "@opencok/contracts/chat";
import { createRoomAuthorizer } from "@opencok/identity/chat-rooms";
import { createJoinHandler } from "@opencok/controllers/chat-join";
import { createRoomDiscovery } from "@opencok/controllers/chat-rooms";
import { createSendHandler } from "@opencok/controllers/chat-send";
import { createHistoryHandlers } from "@opencok/controllers/chat-history";

const timestamp = Date.UTC(2026, 9, 24, 12);
const state = (): PlayerState => ({
  serverId: 1,
  originalServerId: 2,
  allianceId: "synthetic",
  membershipAllianceId: "synthetic",
  language: "pt_BR",
});
const message = (overrides: Partial<ChatMessage> = {}): ChatMessage => ({
  sequenceId: 9007199254740991,
  roomId: "country_1",
  senderUid: "owner",
  idempotencyKey: "17",
  body: "Olá 世界 🌍",
  createdAt: new Date(timestamp).toISOString(),
  ...overrides,
});

function fixture() {
  const states = new Map<string, PlayerState | null>([["owner", state()]]);
  const authCalls: string[] = [];
  const authorizeRoom = createRoomAuthorizer(async (uid) => {
    authCalls.push(uid);
    return states.get(uid) ?? null;
  });
  const writes: MessageInput[] = [];
  const reads: unknown[][] = [];
  let writeResult = { ...message(), inserted: true };
  let history: ChatMessage[] = [];
  let failure: Error | undefined;
  const messages: MessageStore = {
    async create(input) {
      writes.push(input);
      if (failure) throw failure;
      return writeResult;
    },
    async getAll(...args) {
      reads.push(["recent", ...args]);
      if (failure) throw failure;
      return history;
    },
    async getAllByRange(...args) {
      reads.push(["range", ...args]);
      if (failure) throw failure;
      return history;
    },
  };
  const options = { authorizeRoom, messages };
  const peer = (uid: string, rooms: string[] = []) => {
    const frames: Frame[] = [];
    const context: CommandContext = {
      uid,
      params: {},
      sendTime: 17,
      connection: { joinedRooms: new Set(rooms) },
      peers: new Set(),
      sendFrame(frame) {
        frames.push(structuredClone(frame));
      },
    };
    return { context, frames };
  };
  return {
    states,
    writes,
    reads,
    authCalls,
    peer,
    authorizeRoom,
    join: createJoinHandler(authorizeRoom),
    discovery: createRoomDiscovery(authorizeRoom),
    send: createSendHandler(options),
    handlers: createHistoryHandlers(options),
    result(value: ChatMessage & { inserted: boolean }) {
      writeResult = value;
    },
    history(value: ChatMessage[]) {
      history = value;
    },
    fail(error: Error) {
      failure = error;
    },
  };
}

test("basic chat derives all room identities from the current player and joins only authorized rooms", async () => {
  const app = fixture();
  const owner = app.peer("owner");
  const rooms = [
    { group: "original", id: "original_2" },
    { group: "country", id: "country_1" },
    { group: "alliance", id: "alliance_2_synthetic" },
    { group: "global", id: "global_public" },
    { group: "local", id: "local_pt_BR" },
  ];
  owner.context.params = { rooms, uid: "other", serverId: 99 };
  expect(await app.join(owner.context)).toEqual({
    status: true,
    id: ["global_public", "local_pt_BR"],
    ids: [],
  });
  expect([...owner.context.connection.joinedRooms]).toEqual(rooms.map((room) => room.id));
  expect(app.authCalls).toEqual(Array(5).fill("owner"));
  expect(app.writes).toEqual([]);
  expect(app.reads).toEqual([]);
});

test("chat discovery rejects a caller-selected language or room outside the stored profile", async () => {
  const app = fixture();
  const owner = app.peer("owner");
  expect(await app.discovery["room.getGlobalRoom"]!(owner.context)).toEqual({
    group: "global",
    id: "global_public",
  });
  owner.context.params = { lang: "pt_BR" };
  expect(await app.discovery["room.getLocalRoom"]!(owner.context)).toEqual({
    group: "local",
    id: "local_pt_BR",
  });
  owner.context.params = { lang: "en" };
  await expect(app.discovery["room.getLocalRoom"]!(owner.context)).rejects.toMatchObject({
    code: "invalid_room",
  });
  for (const lang of [null, "", "../../secret", "pt_BR_1", 1]) {
    owner.context.params = { lang };
    await expect(app.discovery["room.getLocalRoom"]!(owner.context)).rejects.toMatchObject({
      code: "invalid_language",
    });
  }
  app.states.set("owner", null);
  await expect(app.discovery["room.getGlobalRoom"]!(owner.context)).rejects.toMatchObject({
    code: "invalid_room",
  });
});

test("room joins preserve previous subscriptions and never partially apply rejected batches", async () => {
  const app = fixture();
  const owner = app.peer("owner", ["global_public"]);
  for (const rooms of [
    null,
    [],
    Array(17).fill({ group: "country", id: "country_1" }),
    [{ group: "unsupported", id: "country_1" }],
    [
      { group: "country", id: "country_1" },
      { group: "country", id: "country_99" },
    ],
    [
      { group: "country", id: "country_1" },
      { group: "global", id: "country_1" },
    ],
    [{ group: "country", id: "country_1" }, null],
  ]) {
    owner.context.params = { rooms };
    await expect(app.join(owner.context)).rejects.toMatchObject({ code: "invalid_room" });
    expect([...owner.context.connection.joinedRooms]).toEqual(["global_public"]);
  }
});

test("send uses authenticated identity and committed message metadata while broadcasting only to authorized subscribers", async () => {
  const app = fixture();
  const owner = app.peer("owner", ["country_1"]);
  const allowed = app.peer("allowed", ["country_1"]);
  const foreign = app.peer("foreign", ["country_1"]);
  const unsubscribed = app.peer("unsubscribed");
  app.states.set("allowed", state());
  app.states.set("foreign", { ...state(), serverId: 99 });
  app.states.set("unsubscribed", state());
  owner.context.peers = new Set([
    owner.context,
    foreign.context,
    unsubscribed.context,
    allowed.context,
  ]);
  owner.context.params = { roomId: "country_1", msg: "Olá 世界 🌍", type: 0, uid: "forged" };
  expect(await app.send(owner.context)).toEqual({
    roomId: "country_1",
    group: "country",
    serverTime: timestamp,
    seqId: 9007199254740991,
  });
  expect(app.writes).toHaveLength(1);
  expect(app.writes[0]).toMatchObject({
    roomId: "country_1",
    senderUid: "owner",
    idempotencyKey: "17",
    body: "Olá 世界 🌍",
  });
  expect(app.writes[0]!.now).toBeInstanceOf(Date);
  expect(owner.frames).toEqual([
    {
      cmd: "push.chat.room",
      data: {
        sender: "owner",
        msg: "Olá 世界 🌍",
        serverTime: timestamp,
        sendTime: 17,
        group: "country",
        roomId: "country_1",
        seqId: 9007199254740991,
        extra: { seqId: 9007199254740991 },
      },
    },
  ]);
  expect(allowed.frames).toEqual(owner.frames);
  expect(foreign.frames).toEqual([]);
  expect(unsubscribed.frames).toEqual([]);
  expect(app.authCalls).not.toContain("unsubscribed");
});

test("replayed sends return persisted metadata without broadcasting the same message again", async () => {
  const app = fixture();
  const owner = app.peer("owner", ["country_1"]);
  owner.context.peers.add(owner.context);
  owner.context.params = { roomId: "country_1", msg: "replacement text", type: 1 };
  app.result({ ...message({ body: "original committed text", sequenceId: 8 }), inserted: false });
  expect(await app.send(owner.context)).toEqual({
    roomId: "country_1",
    group: "country",
    serverTime: timestamp,
    seqId: 8,
  });
  expect(owner.frames).toEqual([]);
  expect(app.authCalls).toEqual(["owner"]);
  expect(app.writes[0]!.idempotencyKey).toBe("17");
});

test("leaving an alliance revokes send and history access even when the connection retains its subscription", async () => {
  const app = fixture();
  const roomId = "alliance_2_synthetic";
  const owner = app.peer("owner", [roomId]);
  app.states.set("owner", { ...state(), membershipAllianceId: "other" });
  owner.context.params = { roomId, msg: "no longer allowed" };
  await expect(app.send(owner.context)).rejects.toMatchObject({ code: "invalid_room" });
  owner.context.params = { rooms: { [roomId]: 0 } };
  await expect(app.handlers["history.roomsv2"]!(owner.context)).rejects.toMatchObject({
    code: "invalid_room",
  });
  owner.context.params = { roomId, start: 0, end: 100 };
  await expect(app.handlers["history.roomv2"]!(owner.context)).rejects.toMatchObject({
    code: "invalid_room",
  });
  expect(app.writes).toEqual([]);
  expect(app.reads).toEqual([]);
});

test("a failed peer push does not suppress later peers or turn a committed send into failure", async () => {
  const app = fixture();
  const owner = app.peer("owner", ["country_1"]);
  const broken = app.peer("broken", ["country_1"]);
  const healthy = app.peer("healthy", ["country_1"]);
  for (const uid of ["broken", "healthy"]) app.states.set(uid, state());
  broken.context.sendFrame = () => {
    throw new Error("synthetic disconnected peer");
  };
  owner.context.peers = new Set([broken.context, healthy.context]);
  owner.context.params = { roomId: "country_1", msg: "message" };
  await expect(app.send(owner.context)).resolves.toMatchObject({ seqId: 9007199254740991 });
  expect(healthy.frames).toHaveLength(1);
  expect(app.writes).toHaveLength(1);
});

test("invalid send envelopes cannot reach message storage and stored validation failures retain the command error", async () => {
  const app = fixture();
  const owner = app.peer("owner", ["country_1"]);
  owner.context.params = { roomId: "country_1", msg: "message" };
  for (const sendTime of [undefined, null, "17", 0, -1, 1.5, NaN, Infinity, 9007199254740992]) {
    owner.context.sendTime = sendTime;
    await expect(app.send(owner.context)).rejects.toMatchObject({ code: "invalid_message" });
  }
  owner.context.sendTime = 17;
  for (const params of [
    { roomId: "country_1", msg: null },
    { roomId: "country_1", msg: "message", type: 2 },
    { roomId: "country_1", msg: "message", type: "0" },
    { roomId: "country_1", msg: "message", type: null },
  ]) {
    owner.context.params = params;
    await expect(app.send(owner.context)).rejects.toMatchObject({ code: "invalid_message" });
  }
  expect(app.writes).toEqual([]);
  app.fail(new TypeError("synthetic invalid stored body"));
  owner.context.params = { roomId: "country_1", msg: "" };
  await expect(app.send(owner.context)).rejects.toMatchObject({ code: "invalid_message" });
  app.fail(new Error("synthetic unavailable store"));
  await expect(app.send(owner.context)).rejects.toThrow("synthetic unavailable store");
  expect(owner.frames).toEqual([]);
});

test("recent history preserves store order and exact public fields across Unicode and large sequence IDs", async () => {
  const app = fixture();
  const owner = app.peer("owner", ["country_1"]);
  const first = message({ sequenceId: 1, idempotencyKey: "invalid", body: "first" });
  const last = message({ createdAt: new Date(timestamp + 1).toISOString() });
  app.history([first, last]);
  owner.context.params = { rooms: { country_1: timestamp - 1 }, uid: "forged" };
  const reply = await app.handlers["history.roomsv2"]!(owner.context);
  expect(app.reads).toEqual([["recent", "country_1", timestamp - 1]]);
  expect(reply).toEqual({
    rooms: [
      {
        roomId: "country_1",
        group: "country",
        firstMsgTime: timestamp,
        lastMsgTime: timestamp + 1,
        firstSeqId: 1,
        lastSeqId: 9007199254740991,
        msgs: [
          {
            sender: "owner",
            msg: "first",
            serverTime: timestamp,
            sendTime: 0,
            group: "country",
            roomId: "country_1",
            seqId: 1,
            extra: { seqId: 1 },
          },
          {
            sender: "owner",
            msg: "Olá 世界 🌍",
            serverTime: timestamp + 1,
            sendTime: 17,
            group: "country",
            roomId: "country_1",
            seqId: 9007199254740991,
            extra: { seqId: 9007199254740991 },
          },
        ],
      },
    ],
  });
  expect(owner.frames).toEqual([]);
  expect(app.writes).toEqual([]);
});

test("recent history returns empty sentinels and ignores unsupported prefixes without querying them", async () => {
  const app = fixture();
  const owner = app.peer("owner", ["country_1", "global_public"]);
  owner.context.params = {
    rooms: { private_other: "invalid ignored time", country_1: 0, global_public: 9 },
  };
  expect(await app.handlers["history.roomsv2"]!(owner.context)).toEqual({
    rooms: [
      {
        roomId: "country_1",
        group: "country",
        firstMsgTime: 0,
        lastMsgTime: 0,
        firstSeqId: 0,
        lastSeqId: 0,
        msgs: [],
      },
      {
        roomId: "global_public",
        group: "global",
        firstMsgTime: 0,
        lastMsgTime: 0,
        firstSeqId: 0,
        lastSeqId: 0,
        msgs: [],
      },
    ],
  });
  expect(app.reads).toEqual([
    ["recent", "country_1", 0],
    ["recent", "global_public", 9],
  ]);
  owner.context.params = { rooms: {} };
  expect(await app.handlers["history.roomsv2"]!(owner.context)).toEqual({ rooms: [] });
});

test("range history passes exact bounds and returns the distinct singular message envelope", async () => {
  const app = fixture();
  const owner = app.peer("owner", ["country_1"]);
  app.history([message({ sequenceId: 7 })]);
  owner.context.params = { roomId: "country_1", start: timestamp - 1, end: timestamp + 1 };
  expect(await app.handlers["history.roomv2"]!(owner.context)).toEqual({
    msg: [
      {
        sender: "owner",
        msg: "Olá 世界 🌍",
        serverTime: timestamp,
        sendTime: 17,
        group: "country",
        roomId: "country_1",
        seqId: 7,
        extra: { seqId: 7 },
      },
    ],
  });
  expect(app.reads).toEqual([["range", "country_1", timestamp - 1, timestamp + 1]]);
  expect(app.writes).toEqual([]);
});

test("history rejects invalid times and oversized room sets without a read", async () => {
  const app = fixture();
  const owner = app.peer("owner", ["country_1"]);
  for (const rooms of [
    null,
    [],
    "country_1",
    Object.fromEntries(Array.from({ length: 17 }, (_, i) => [`country_${i}`, 0])),
  ]) {
    owner.context.params = { rooms };
    await expect(app.handlers["history.roomsv2"]!(owner.context)).rejects.toMatchObject({
      code: "invalid_room",
    });
  }
  for (const after of [null, "0", -1, 0.5, NaN, Infinity, 9007199254740992]) {
    owner.context.params = { rooms: { country_1: after } };
    await expect(app.handlers["history.roomsv2"]!(owner.context)).rejects.toMatchObject({
      code: "invalid_time",
    });
  }
  for (const [start, end] of [
    [0, 0],
    [1, 0],
    [-1, 1],
    ["0", 1],
    [0, "1"],
    [0, Infinity],
    [NaN, 1],
    [0.5, 1],
    [0, 9007199254740992],
  ]) {
    owner.context.params = { roomId: "country_1", start, end };
    await expect(app.handlers["history.roomv2"]!(owner.context)).rejects.toMatchObject({
      code: "invalid_time",
    });
  }
  expect(app.reads).toEqual([]);
});

test("chat commands reject stale or missing subscriptions and propagate reached authorization and storage failures", async () => {
  const app = fixture();
  const owner = app.peer("owner");
  owner.context.params = { roomId: "country_1", msg: "message" };
  await expect(app.send(owner.context)).rejects.toMatchObject({ code: "invalid_room" });
  owner.context.params = { roomId: "country_1", start: 0, end: 1 };
  await expect(app.handlers["history.roomv2"]!(owner.context)).rejects.toMatchObject({
    code: "invalid_room",
  });
  expect(app.authCalls).toEqual([]);
  owner.context.connection.joinedRooms.add("country_1");
  app.fail(new Error("synthetic history unavailable"));
  await expect(app.handlers["history.roomv2"]!(owner.context)).rejects.toThrow(
    "synthetic history unavailable",
  );
  owner.context.params = { rooms: { country_1: 0 } };
  await expect(app.handlers["history.roomsv2"]!(owner.context)).rejects.toThrow(
    "synthetic history unavailable",
  );
  const authorizationFailure = createSendHandler({
    authorizeRoom: async () => {
      throw new Error("synthetic identity unavailable");
    },
    messages: {
      create: async () => {
        throw new Error("must not write");
      },
      getAllByRange: async () => [],
      getAll: async () => [],
    },
  });
  owner.context.params = { roomId: "country_1", msg: "message" };
  await expect(authorizationFailure(owner.context)).rejects.toThrow(
    "synthetic identity unavailable",
  );
  expect(app.writes).toEqual([]);
  expect(owner.frames).toEqual([]);
});
