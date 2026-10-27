import type { CommandHandlers, Log, TokenVerifier } from "./chat.ts";

export interface ChatWebsocketOptions {
  verifyToken: TokenVerifier;
  handlers?: CommandHandlers;
  isReady?: () => boolean;
  log?: Log;
}
