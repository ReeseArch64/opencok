import type {
  ChatMessage,
  CommandHandlers,
  Connection,
  RoomAuthorizer,
  RoomGroup,
  RoomHandlerOptions,
} from "@opencok/contracts/chat";
import { isSafeInteger } from "@opencok/contracts/chat";
import { ChatCommandError } from "@opencok/controllers/chat-rooms";

const supportedPrefix = /^(original_|country_|alliance_|global_|local_|private_[a-f0-9-]{36}$)/;

function messageFrame(item: ChatMessage, group: RoomGroup) {
  return {
    sender: item.senderUid,
    msg: item.body,
    serverTime: Date.parse(item.createdAt),
    sendTime: Number(item.idempotencyKey) || 0,
    group,
    roomId: item.roomId,
    seqId: item.sequenceId,
    extra: { seqId: item.sequenceId },
  };
}

async function requireRoom({
  uid,
  roomId,
  connection,
  authorizeRoom,
}: {
  uid: string;
  roomId: unknown;
  connection: Connection;
  authorizeRoom: RoomAuthorizer;
}) {
  if (typeof roomId !== "string" || !connection.joinedRooms.has(roomId))
    throw new ChatCommandError("invalid_room");
  const room = await authorizeRoom(uid, roomId);
  if (!room) throw new ChatCommandError("invalid_room");
  return room;
}

export function createHistoryHandlers({
  authorizeRoom,
  messages,
  access,
}: RoomHandlerOptions): CommandHandlers {
  return {
    "history.cursor": async ({ uid, params, connection }) => {
      const room = await requireRoom({ uid, roomId: params.roomId, connection, authorizeRoom });
      if (
        !messages.page ||
        !isSafeInteger(params.before) ||
        params.before < 0 ||
        typeof params.archive !== "boolean"
      )
        throw new ChatCommandError("invalid_cursor");
      const page = await messages.page({
        roomId: room.roomId,
        before: params.before,
        limit: 100,
        archive: params.archive,
      });
      const items = [];
      for (const item of page.messages)
        if (!access || (await access.canRead(uid, item))) items.push(item);
      return { msgs: items.map((item) => messageFrame(item, room.group)), cursor: page.cursor };
    },
    "history.roomsv2": async ({ uid, params, connection }) => {
      const requested = params.rooms;
      if (
        !requested ||
        typeof requested !== "object" ||
        Array.isArray(requested) ||
        Object.keys(requested).length > 16
      )
        throw new ChatCommandError("invalid_room");
      const rooms = [];
      for (const [roomId, afterMs] of Object.entries(requested)) {
        if (!supportedPrefix.test(roomId)) continue;
        if (!isSafeInteger(afterMs) || afterMs < 0) throw new ChatCommandError("invalid_time");
        const room = await requireRoom({ uid, roomId, connection, authorizeRoom });
        const raw = await messages.getAll(roomId, afterMs);
        const items = [];
        for (const item of raw) if (!access || (await access.canRead(uid, item))) items.push(item);
        const first = items[0];
        const last = items.at(-1);
        rooms.push({
          roomId,
          group: room.group,
          firstMsgTime: first ? Date.parse(first.createdAt) : 0,
          lastMsgTime: last ? Date.parse(last.createdAt) : 0,
          firstSeqId: first?.sequenceId ?? 0,
          lastSeqId: last?.sequenceId ?? 0,
          msgs: items.map((item) => messageFrame(item, room.group)),
        });
      }
      return { rooms };
    },

    "history.roomv2": async ({ uid, params, connection }) => {
      const { roomId, start, end } = params;
      if (!isSafeInteger(start) || start < 0 || !isSafeInteger(end) || end <= start)
        throw new ChatCommandError("invalid_time");
      const room = await requireRoom({ uid, roomId, connection, authorizeRoom });
      const raw = await messages.getAllByRange(room.roomId, start, end);
      const items = [];
      for (const item of raw) if (!access || (await access.canRead(uid, item))) items.push(item);
      return { msg: items.map((item) => messageFrame(item, room.group)) };
    },
  };
}
