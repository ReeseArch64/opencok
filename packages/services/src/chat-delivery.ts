import { randomUUID } from "node:crypto";
import type { Log, Peer, RoomAuthorizer } from "@opencok/contracts/chat";
import type { ChatAccessStore, ChatDeliveryStore } from "@opencok/contracts/chat-delivery";
export function createChatDeliveryService(options: {
  store: ChatDeliveryStore;
  instance: string;
  peers: Set<Peer>;
  authorizeRoom: RoomAuthorizer;
  access?: ChatAccessStore;
  log: Log;
}) {
  const token = randomUUID();
  let active = false;
  let lastFailure = 0;
  let running: Promise<void> | undefined;
  const { store, instance, peers, authorizeRoom, access, log } = options;
  async function deliver() {
    if (!active) {
      await store.acquire(instance, token);
      active = true;
    }
    const batch = await store.poll(instance, token);
    if (batch.resync)
      for (const peer of peers)
        peer.sendFrame({ cmd: "chat.resync", data: { reason: "delivery_gap" } });
    for (const event of batch.events) {
      const recipients = [...peers];
      for (let index = 0; index < recipients.length; index += 16)
        await Promise.all(
          recipients.slice(index, index + 16).map(async (peer) => {
            if (event.target && peer.uid !== event.target && peer.uid !== event.owner) return;
            if (event.roomId && !peer.connection.joinedRooms.has(event.roomId)) return;
            if (peer.authorizeSession && !(await peer.authorizeSession())) return;
            if (event.roomId && !(await authorizeRoom(peer.uid, event.roomId))) {
              peer.connection.joinedRooms.delete(event.roomId);
              return;
            }
            const control =
              event.frame &&
              [
                "push.chat.delete",
                "push.chat.ban",
                "push.chat.room.quit",
                "push.chat.room.kick",
              ].includes(String(event.frame.cmd));
            if (access && !control && !(await access.canReceive(peer.uid, event.owner))) return;
            if (event.message) {
              if (access && !(await access.canRead(peer.uid, event.message!))) return;
              const item = event.message;
              const room = await authorizeRoom(peer.uid, item.roomId);
              if (!room) return;
              peer.sendFrame({
                cmd: "push.chat.room",
                eventId: event.id,
                data: {
                  sender: item.senderUid,
                  msg: item.body,
                  post: item.post ?? 0,
                  serverTime: Date.parse(item.createdAt),
                  sendTime: Number(item.idempotencyKey) || 0,
                  group: room.group,
                  roomId: item.roomId,
                  seqId: item.sequenceId,
                  extra: { seqId: item.sequenceId },
                },
              });
            } else if (event.frame) peer.sendFrame({ ...event.frame, eventId: event.id });
          }),
        );
      await store.acknowledge(instance, token, event.sequence);
    }
  }
  function poll(): Promise<void> {
    return (running ??= deliver()
      .catch(() => {
        active = false;
        if (Date.now() - lastFailure < 30_000) return;
        lastFailure = Date.now();
        log({ operation: "chat.distribution", category: "unavailable" });
        for (const peer of peers)
          peer.sendFrame({ cmd: "chat.resync", data: { reason: "delivery_unavailable" } });
      })
      .finally(() => {
        running = undefined;
      }));
  }
  const timer = setInterval(() => {
    void poll();
  }, 250);
  timer.unref();
  return {
    isReady: () => active,
    poll,
    async close() {
      clearInterval(timer);
      await running;
      if (active) await store.release(instance, token);
    },
  };
}
