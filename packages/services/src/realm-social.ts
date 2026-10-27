import { nativePrivateMessage, nativePrivateRoom } from "@opencok/mappings/chat-native";
import type { ChatMessage } from "@opencok/contracts/chat";
import type { ChatRepository } from "@opencok/contracts/chat";
import type { ChatSocialCommand } from "@opencok/contracts/chat-social";
import type { RealmSocialCommandService } from "@opencok/contracts/realm-social";
import { ChatCommandError } from "@opencok/errors/chat";
import { ChatNativeService, nativeChatCommands } from "./chat-native.ts";
import { ChatSocialService, chatSocialCommands } from "./chat-social.ts";
export class RealmSocialService implements RealmSocialCommandService {
  readonly social;
  readonly native;
  constructor(
    readonly repository: ChatRepository,
    readonly isReady: () => boolean,
  ) {
    this.social = repository.social ? new ChatSocialService(repository.social) : undefined;
    this.native = new ChatNativeService(repository);
  }
  async execute(
    owner: string,
    realm: number,
    command: string,
    params: Record<string, unknown>,
    operationId: string,
  ): Promise<Record<string, unknown>> {
    if (!this.isReady()) throw new ChatCommandError("unavailable");
    if (
      this.repository.authorizeRealm &&
      (typeof params._realmToken !== "string" ||
        typeof params._realmEpoch !== "string" ||
        !(await this.repository.authorizeRealm(realm, params._realmToken, params._realmEpoch)))
    )
      throw new ChatCommandError("unauthorized");
    if (command.startsWith("realm.events.") && this.repository.realmEvents)
      return this.repository.realmEvents(owner, realm, command, params);
    if (
      [
        "mine.friend",
        "mine.help",
        "mine.inbox.poll",
        "mine.inbox.ack",
        "mine.call.publish",
      ].includes(command) &&
      this.repository.mineCommand
    )
      return this.repository.mineCommand(owner, realm, command, params, operationId);
    const state = await this.repository.getPlayerStateById(owner);
    if (state?.serverId !== realm || state.banned || (state.banUntil ?? 0) > Date.now())
      throw new ChatCommandError("unauthorized");
    if (command === "chat.notice.authorize") {
      if (!this.repository.access || !(await this.repository.access.canSend(owner, true)))
        throw new ChatCommandError("chat_muted");
      return { allowed: true };
    }
    if (command === "chat.notice.commit" && this.repository.publishNotice)
      return this.repository.publishNotice(owner, realm, operationId);
    if (nativeChatCommands.includes(command))
      return this.native.execute(owner, command, params, operationId);
    if (!(chatSocialCommands as readonly string[]).includes(command) || !this.social)
      throw new ChatCommandError("unsupported_command");
    const normalize = (id: unknown) =>
      typeof id === "string" && /^[a-f0-9-]{36}$/.test(id) ? `private_${id}` : id;
    const normalized =
      command.startsWith("chat.room.") || command === "chat.set.status"
        ? {
            ...params,
            ...(params.id !== undefined ? { id: normalize(params.id) } : {}),
            ...(params.roomId !== undefined ? { roomId: normalize(params.roomId) } : {}),
            ...(Array.isArray(params.roomids) ? { roomids: params.roomids.map(normalize) } : {}),
          }
        : params;
    const result = await this.social.execute(
      owner,
      command as ChatSocialCommand,
      normalized,
      operationId,
    );
    if (command === "chat.room.invitee") return { invitee: result.members ?? [] };
    if (command === "chat.room.user.rooms") {
      const rooms = [];
      for (const row of result.rooms as { roomId: string }[]) {
        const room = await this.repository.access?.roomInfo?.(owner, row.roomId);
        if (room) rooms.push(nativePrivateRoom(room));
      }
      return { rooms };
    }
    if (["chat.room.mk", "chat.room.members", "chat.room.msg"].includes(command)) {
      const id = String(result.roomId ?? normalized.roomId ?? normalized.id ?? "");
      const room = await this.repository.access?.roomInfo?.(owner, id);
      if (!room) throw new ChatCommandError("invalid_room");
      if (command !== "chat.room.msg") return { ...nativePrivateRoom(room), invalid: [] };
      const messages = [];
      for (const message of result.msg as ChatMessage[])
        messages.push(
          nativePrivateMessage(
            message,
            room,
            await this.repository.getPlayerStateById(message.senderUid),
          ),
        );
      return { id: room.id.replace(/^private_/, ""), msg: messages };
    }
    if (["chat.room.member.invite", "chat.room.member.kick"].includes(command))
      return { ...result, invalid: [] };
    return result;
  }
}
