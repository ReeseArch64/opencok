import type { ChatRepository, TokenVerifier } from "@opencok/contracts/chat";
import { ChatTokenVerifier } from "./chat-token.ts";

export class ChatPlayerTokenVerifier {
  private readonly tokens: ChatTokenVerifier;

  public constructor(
    private readonly repository: Pick<ChatRepository, "sessions" | "access" | "getPlayerStateById">,
  ) {
    this.tokens = new ChatTokenVerifier(repository.sessions);
  }

  public readonly verify: TokenVerifier = async (token, claimedUid) => {
    const identity = await this.tokens.verify(token, claimedUid);

    if (!identity || !this.repository.access) return identity;

    const state = await this.repository.getPlayerStateById(identity.uid);

    return state && !state.banned && (state.banUntil ?? 0) <= Date.now() ? identity : null;
  };
}
