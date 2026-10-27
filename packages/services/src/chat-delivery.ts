import { randomUUID } from "node:crypto";
import type { ChatDeliveryOptions } from "@opencok/contracts/chat-delivery-options";

export class ChatDeliveryService {
  private readonly token = randomUUID();
  private active = false;
  private lastFailure = 0;
  private running: Promise<void> | undefined;
  private readonly timer: ReturnType<typeof setInterval>;

  public constructor(private readonly options: ChatDeliveryOptions) {
    this.timer = setInterval(() => {
      void this.poll();
    }, 250);
    this.timer.unref();
  }

  public readonly isReady = (): boolean => this.active;

  public async close(): Promise<void> {
    clearInterval(this.timer);
    await this.running;

    if (this.active) {await this.options.store.release(this.options.instance, this.token);}
  }

  private async deliver() {
    const { store, instance, peers, authorizeRoom, access } = this.options;

    if (!this.active) {
      await store.acquire(instance, this.token);
      this.active = true;
    }

    const batch = await store.poll(instance, this.token);

    if (batch.resync)
      {for (const peer of peers)
        {peer.sendFrame({ cmd: "chat.resync", data: { reason: "delivery_gap" } });}}

    for (const event of batch.events) {
      const recipients = [...peers];

      for (let index = 0; index < recipients.length; index += 16)
        {await Promise.all(
          recipients.slice(index, index + 16).map(async (peer) => {
            if (event.target && peer.uid !== event.target && peer.uid !== event.owner) {return;}

            if (event.roomId && !peer.connection.joinedRooms.has(event.roomId)) {return;}

            if (peer.authorizeSession && !(await peer.authorizeSession())) {return;}

            if (event.roomId && !(await authorizeRoom(peer.uid, event.roomId))) {
              peer.connection.joinedRooms.delete(event.roomId);

              return;
            }

            const control =
              [100, 101, 102, 103, 105].includes(event.message?.post ?? 0) ||
              (event.frame &&
                [
                  "push.chat.delete",
                  "push.chat.ban",
                  "push.chat.room.quit",
                  "push.chat.room.kick",
                ].includes(String(event.frame.cmd)));

            if (access && !control && !(await access.canReceive(peer.uid, event.owner))) {return;}

            if (event.message) {
              if (access && !(await access.canRead(peer.uid, event.message!))) {return;}

              const item = event.message;
              const room = await authorizeRoom(peer.uid, item.roomId);

              if (!room) {return;}

              if ((item.post ?? 0) >= 100) {
                peer.sendFrame({
                  cmd: "push.chat.room.control",
                  eventId: event.id,
                  data: {
                    roomId: item.roomId,
                    seqId: item.sequenceId,
                    type: item.post! - 100,
                    msg: item.post === 105 ? item.body : JSON.parse(item.body),
                  },
                });

                return;
              }

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
            } else if (event.frame) {peer.sendFrame({ ...event.frame, eventId: event.id });}
          }),
        );}

      await store.acknowledge(instance, this.token, event.sequence);
    }
  }

  public readonly poll = (): Promise<void> => {
    const { log, peers } = this.options;

    return (this.running ??= this.deliver()
      .catch(() => {
        this.active = false;

        if (Date.now() - this.lastFailure < 30_000) {return;}

        this.lastFailure = Date.now();
        log({ operation: "chat.distribution", category: "unavailable" });

        for (const peer of peers)
          {peer.sendFrame({ cmd: "chat.resync", data: { reason: "delivery_unavailable" } });}
      })
      .finally(() => {
        this.running = undefined;
      }));
  };
}

export function createChatDeliveryService(options: ChatDeliveryOptions): ChatDeliveryService {
  return new ChatDeliveryService(options);
}
