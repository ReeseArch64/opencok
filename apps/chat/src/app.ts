import { RealmSocialService } from "@opencok/services/realm-social";
import { createRealmSocialHandler } from "@opencok/controllers/realm-social";
import { randomUUID } from "node:crypto";
import { createChatDeliveryService } from "@opencok/services/chat-delivery";
import { createChatSocialService, chatSocialCommands } from "@opencok/services/chat-social";
import { ChatMailboxController } from "@opencok/controllers/chat-mailbox";
import { ChatAvatarProfileController } from "@opencok/controllers/chat-avatar-profile";
import { ChatNicknameController } from "@opencok/controllers/chat-nickname";
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
  instanceId = randomUUID(),
  cleanupIntervalMs = defaultCleanupIntervalMs,
}: {
  repository: ChatRepository;
  signingSecret: string;
  websocketUrl: string;
  log?: Log;
  instanceId?: string;
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
  const publicRoom = createRoomAuthorizer(repository.getPlayerStateById);
  const authorizeRoom: typeof publicRoom = async (uid, roomId) =>
    roomId.startsWith("private_")
      ? (await repository.access?.privateRoom(uid, roomId)) &&
        (await repository.getPlayerStateById(uid))
        ? { group: "private", roomId }
        : null
      : publicRoom(uid, roomId);
  const social = repository.social ? createChatSocialService(repository.social) : null;
  const deleteExpired = repository.deleteExpired;
  let ready = false;
  const isReady = () => ready;
  const handlers = {
    ...Object.fromEntries(
      social
        ? chatSocialCommands.map((command) => [
            command,
            async (context: import("@opencok/contracts/chat").CommandContext) =>
              social.execute(
                context.uid,
                command,
                context.params,
                String(context.sendTime ?? randomUUID()),
              ),
          ])
        : [],
    ),
    "chat.logout": async ({ uid }: import("@opencok/contracts/chat").CommandContext) => {
      await repository.sessions.revoke?.(uid);
      return { status: "ok" };
    },
    ...createRoomDiscovery(authorizeRoom),
    "room.joinMulti": createJoinHandler(authorizeRoom),
    "chat.room": createSendHandler({ authorizeRoom, messages, access: repository.access }),
    ...createHistoryHandlers({ authorizeRoom, messages, access: repository.access }),
  };
  const gateway = createWebSocketGateway({
    verifyToken: async (token, claimedUid) => {
      const identity = await createTokenVerifier(sessionStore)(token, claimedUid);
      if (!identity || !repository.access) return identity;
      const state = await repository.getPlayerStateById(identity.uid);
      return state && !state.banned && (state.banUntil ?? 0) <= Date.now() ? identity : null;
    },
    handlers,
    isReady,
    log,
  });
  const distribution =
    repository.delivery && gateway.peers
      ? createChatDeliveryService({
          store: repository.delivery,
          instance: instanceId,
          peers: gateway.peers,
          authorizeRoom,
          access: repository.access,
          log,
        })
      : undefined;
  const server = createChatServer({
    isReady,
    socialHandler: social
      ? createRealmSocialHandler({
          signingSecret,
          service: new RealmSocialService(repository, isReady),
        })
      : undefined,
    mailboxHandler: repository.mailbox
      ? new ChatMailboxController({ mailboxes: repository.mailbox, signingSecret, log }).handle
      : undefined,
    nicknameHandler: new ChatNicknameController({
      nicknames: repository.nicknames,
      signingSecret,
      log,
    }).handle,
    profileHandler: new ChatAvatarProfileController({
      profiles: repository.profiles,
      signingSecret,
      log,
    }).handle,
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
      for (let batch = 0; batch < 5; batch++) {
        const removed = await deleteExpired();
        if (removed.messages < 500 && removed.sessions < 500) break;
        if (batch === 4) log({ operation: "chat.retention", category: "retention_backlog" });
      }
      if (repository.archivePending) {
        const deadline = performance.now() + 8000;
        try {
          let pending = 0;
          for (let batch = 0; batch < 10 && performance.now() < deadline; batch++) {
            pending = await repository.archivePending();
            if (pending < 100) break;
          }
          if (pending >= 100) log({ operation: "chat.archive", category: "retention_backlog" });
        } catch {
          log({ operation: "chat.archive", category: "unavailable" });
        }
      }
      await distribution?.poll();
      ready = distribution?.isReady() ?? true;
      return ready;
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
    runDistribution: () => distribution?.poll() ?? Promise.resolve(),
    server,
    runMaintenance,
    async close() {
      clearInterval(timer);
      ready = false;
      await maintenance;
      await distribution?.close();
      await gateway.close();
      if (server.listening)
        await new Promise<void>((resolve, reject) =>
          server.close((error) => (error ? reject(error) : resolve())),
        );
    },
  };
}
