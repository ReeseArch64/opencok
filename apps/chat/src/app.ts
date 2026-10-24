import { createChatMailboxHandler } from "@opencok/controllers/chat-mailbox";
import { createChatAvatarProfileHandler } from "@opencok/controllers/chat-avatar-profile";
import { createChatNicknameHandler } from "@opencok/controllers/chat-nickname";
import type { ChatRepository, Log } from "@opencok/contracts/chat";

import { createTokenVerifier } from "@opencok/identity/chat-token";
import { createConfigHandler, createServerListHandler } from "@opencok/controllers/chat-config";
import { createHistoryHandlers } from "@opencok/controllers/chat-history";
import { createJoinHandler } from "@opencok/controllers/chat-join";
import { createRoomDiscovery } from "@opencok/controllers/chat-rooms";
import { createRoomAuthorizer } from "@opencok/identity/chat-rooms";
import { createChatServer } from "@opencok/connection/chat-server";
import { createSendHandler } from "@opencok/controllers/chat-send";
import { createSessionHandler } from "@opencok/controllers/chat-session";
import { createWebSocketGateway } from "@opencok/connection/chat-websocket";

const defaultCleanupIntervalMs = 60_000;

export function createChatApp({
  repository,
  signingSecret,
  websocketUrl,
  log = () => {},
  cleanupIntervalMs = defaultCleanupIntervalMs,
}: {
  repository: ChatRepository;
  signingSecret: string;
  websocketUrl: string;
  log?: Log;
  cleanupIntervalMs?: number;
}) {
  if (
    !repository ||
    typeof signingSecret !== "string" ||
    !signingSecret ||
    !Number.isSafeInteger(cleanupIntervalMs) ||
    cleanupIntervalMs < 1_000
  )
    throw new TypeError("invalid chat app configuration");

  const sessionStore = repository.sessions;
  const messages = repository.messages;
  const authorizeRoom = createRoomAuthorizer(repository.getPlayerStateById);
  const deleteExpired = repository.deleteExpired;
  let ready = false;
  const isReady = () => ready;
  const handlers = {
    ...createRoomDiscovery(authorizeRoom),
    "room.joinMulti": createJoinHandler(authorizeRoom),
    "chat.room": createSendHandler({ authorizeRoom, messages }),
    ...createHistoryHandlers({ authorizeRoom, messages }),
  };
  const gateway = createWebSocketGateway({
    verifyToken: createTokenVerifier(sessionStore),
    handlers,
    isReady,
    log,
  });
  const server = createChatServer({
    isReady,
    mailboxHandler: repository.mailbox
      ? createChatMailboxHandler({ mailboxes: repository.mailbox, signingSecret, log })
      : undefined,
    nicknameHandler: createChatNicknameHandler({
      nicknames: repository.nicknames,
      signingSecret,
      log,
    }),
    profileHandler: createChatAvatarProfileHandler({
      profiles: repository.profiles,
      signingSecret,
      log,
    }),
    sessionHandler: createSessionHandler({ sessionStore, signingSecret, log }),
    configHandler: createConfigHandler({ websocketUrl, isReady }),
    serverListHandler: createServerListHandler({ websocketUrl, isReady }),
    websocketGateway: gateway,
  });

  let maintenance: Promise<boolean> | undefined;
  function runMaintenance(): Promise<boolean> {
    return (maintenance ??= maintain().finally(() => {
      maintenance = undefined;
    }));
  }
  async function maintain() {
    try {
      await repository.health();
      await deleteExpired();
      ready = true;
      return true;
    } catch {
      ready = false;
      log({ operation: "chat.maintenance", category: "storage_unavailable" });
      return false;
    }
  }

  const timer = setInterval(() => {
    void runMaintenance();
  }, cleanupIntervalMs);
  timer.unref();

  return {
    server,
    runMaintenance,
    async close() {
      clearInterval(timer);
      ready = false;
      await maintenance;
      await gateway.close();
      if (server.listening)
        await new Promise<void>((resolve, reject) =>
          server.close((error) => (error ? reject(error) : resolve())),
        );
    },
  };
}
