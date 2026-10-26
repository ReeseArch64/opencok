import { expect, test } from "bun:test";
import type { ChatRepository } from "@opencok/contracts/chat";
import { ChatNativeService } from "@opencok/services/chat-native";

test("native legacy history and sequence polling retain their distinct alliance channel values", async () => {
  const rooms: string[] = [];
  const repository = {
    getPlayerStateById: async () => ({
      serverId: 1,
      originalServerId: 1,
      language: "pt",
      allianceId: "friends",
      membershipAllianceId: "friends",
    }),
    messages: {
      getAllByRange: async (room: string) => {
        rooms.push(room);
        return [];
      },
      page: async (query: { roomId: string }) => {
        rooms.push(query.roomId);
        return { messages: [], cursor: null };
      },
    },
  } as unknown as ChatRepository;
  const native = new ChatNativeService(repository);
  await native.execute("alice", "chat.get", { type: 2 }, "old");
  await native.execute("alice", "chat.get.by.seq", { type: 1 }, "sequence");
  const result = await native.execute(
    "alice",
    "chat.get.new",
    { rooms: [{ id: "0", type: 1, seqid: "0" }] },
    "poll",
  );
  expect(rooms).toEqual(Array(3).fill("alliance_1_friends"));
  expect(result.rooms).toMatchObject([{ type: 1, firstSeqId: "-1", lastSeqId: "-1", msg: [] }]);
});
