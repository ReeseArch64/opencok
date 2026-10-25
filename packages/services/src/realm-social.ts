import type { ChatRepository } from "@opencok/contracts/chat";
import type { ChatSocialCommand } from "@opencok/contracts/chat-social";
import type { RealmSocialCommandService } from "@opencok/contracts/realm-social";
import { ChatCommandError } from "@opencok/errors/chat";
import { ChatNativeService, nativeChatCommands } from "./chat-native.ts";
import { createChatSocialService, chatSocialCommands } from "./chat-social.ts";
export class RealmSocialService implements RealmSocialCommandService {
  readonly social;
  readonly native;
  constructor(
    readonly repository: ChatRepository,
    readonly isReady: () => boolean,
  ) {
    this.social = repository.social ? createChatSocialService(repository.social) : undefined;
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
    return this.social.execute(owner, command as ChatSocialCommand, params, operationId);
  }
}
