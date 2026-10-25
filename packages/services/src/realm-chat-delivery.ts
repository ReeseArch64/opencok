import type { ChatRepository, ChatMessage } from "@opencok/contracts/chat";
import { createRoomAuthorizer } from "@opencok/identity/chat-rooms";
import { ChatCommandError } from "@opencok/errors/chat";
export async function realmChatDeliveries(
  repository: ChatRepository,
  realm: number,
  owners: string[],
  events: import("@opencok/contracts/chat-delivery").ChatDeliveryEvent[],
) {
  const deliveries: { id: string; owner: string; cmd: string; data: unknown }[] = [];
  for (let index = 0; index < owners.length; index += 8)
    await Promise.all(
      owners.slice(index, index + 8).map(async (owner) => {
        const state = await repository.getPlayerStateById(owner);
        if (
          !state ||
          state.serverId !== realm ||
          state.banned ||
          (state.banUntil ?? 0) > Date.now()
        )
          return;
        const messages = events.flatMap((event) => (event.message ? [event.message] : []));
        const visible = new Set(
          (repository.access?.filter
            ? await repository.access.filter(owner, messages)
            : messages
          ).map((message) => message.sequenceId),
        );
        const authorize = createRoomAuthorizer(async () => state);
        for (const event of events) {
          if (event.target && event.target !== owner && event.owner !== owner) continue;
          if (event.message) {
            const item: ChatMessage = event.message;
            if (!visible.has(item.sequenceId)) continue;
            if (!item.roomId.startsWith("private_") && !(await authorize(owner, item.roomId)))
              continue;
            const privateRoom = item.roomId.startsWith("private_");
            deliveries.push({
              id: event.id,
              owner,
              cmd: privateRoom ? "push.chat.room.msg" : "push.chat",
              data: {
                id: privateRoom ? item.roomId : undefined,
                senderUid: item.senderUid,
                msg: item.body,
                seqId: String(item.sequenceId),
                timeLong: Date.parse(item.createdAt),
                type: item.roomId.startsWith("alliance_") ? 2 : 0,
                post: item.post ?? 0,
              },
            });
          } else if (
            event.frame &&
            (!repository.access ||
              [
                "push.chat.delete",
                "push.chat.ban",
                "push.chat.room.quit",
                "push.chat.room.kick",
              ].includes(String(event.frame.cmd)) ||
              (await repository.access.canReceive(owner, event.owner)))
          ) {
            if (
              event.roomId &&
              !(await authorize(owner, event.roomId)) &&
              !(await repository.access?.privateRoom(owner, event.roomId))
            )
              continue;
            if (typeof event.frame.cmd !== "string") throw new ChatCommandError("invalid_event");
            deliveries.push({ id: event.id, owner, cmd: event.frame.cmd, data: event.frame.data });
          }
        }
      }),
    );
  return deliveries;
}
