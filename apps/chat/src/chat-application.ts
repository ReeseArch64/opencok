import { randomUUID } from "node:crypto";
import type { Server } from "node:http";
import type { CommandContext, WebSocketGateway } from "@opencok/contracts/chat";
import { ChatDeliveryService } from "@opencok/services/chat-delivery";
import { ChatMaintenanceService } from "@opencok/services/chat-maintenance.service";
import { ChatSessionService } from "@opencok/services/chat-session.service";
import { ChatSocialService, chatSocialCommands } from "@opencok/services/chat-social";
import { RealmSocialService } from "@opencok/services/realm-social";
import { ChatMailboxController } from "@opencok/controllers/chat-mailbox";
import { ChatAvatarProfileController } from "@opencok/controllers/chat-avatar-profile";
import { ChatNicknameController } from "@opencok/controllers/chat-nickname";
import { ChatConfigController } from "@opencok/controllers/chat-config.controller";
import { ChatServerListController } from "@opencok/controllers/chat-server-list.controller";
import { ChatSessionController } from "@opencok/controllers/chat-session.controller";
import { ChatGlobalRoomController } from "@opencok/controllers/chat-global-room.controller";
import { ChatLocalRoomController } from "@opencok/controllers/chat-local-room.controller";
import { ChatJoinController } from "@opencok/controllers/chat-join";
import { ChatSendController } from "@opencok/controllers/chat-send";
import { ChatHistoryCursorController } from "@opencok/controllers/chat-history-cursor.controller";
import { ChatHistoryRoomsController } from "@opencok/controllers/chat-history-rooms.controller";
import { ChatHistoryRoomController } from "@opencok/controllers/chat-history-room.controller";
import { ChatLogoutController } from "@opencok/controllers/chat-logout.controller";
import { RealmSocialController } from "@opencok/controllers/realm-social";
import { ChatSessionFormVerifier } from "@opencok/identity/chat-session-form";
import { ChatRoomAccessAuthorizer } from "@opencok/identity/chat-room-access";
import { ChatPlayerTokenVerifier } from "@opencok/identity/chat-player-token";
import { ChatHttpServer } from "@opencok/connection/chat-http-server";
import { ChatWebSocketGateway } from "@opencok/connection/chat-websocket-gateway";
import type { ChatApplicationOptions } from "./chat-application-options.ts";

export class ChatApplication
{
    public readonly server: Server;
    private readonly gateway: WebSocketGateway;
    private readonly distribution: ChatDeliveryService | undefined;
    private readonly maintenance: ChatMaintenanceService;
    private readonly timer: ReturnType<typeof setInterval>;

    public constructor({
        repository,
        signingSecret,
        websocketUrl,
        log = () => {},
        instanceId = randomUUID(),
        cleanupIntervalMs = 60_000,
    }: ChatApplicationOptions)
    {
        if (
            !repository
            || typeof signingSecret !== "string"
            || !signingSecret
            || !Number.isSafeInteger(cleanupIntervalMs)
            || cleanupIntervalMs < 1_000
        )
        {
            throw new TypeError("invalid chat app configuration");
        }

        const sessionStore = repository.sessions;
        const messages = repository.messages;
        const authorizeRoom = new ChatRoomAccessAuthorizer(repository).authorize;
        const social = repository.social ? new ChatSocialService(repository.social) : null;
        const isReady = () => this.maintenance?.isReady() ?? false;
        const roomOptions = { authorizeRoom, messages, access: repository.access };
        const controllers = [
            new ChatLogoutController(sessionStore),
            new ChatGlobalRoomController(authorizeRoom),
            new ChatLocalRoomController(authorizeRoom),
            new ChatJoinController(authorizeRoom),
            new ChatSendController(roomOptions),
            new ChatHistoryCursorController(roomOptions),
            new ChatHistoryRoomsController(roomOptions),
            new ChatHistoryRoomController(roomOptions),
        ];
        const handlers = {
            ...Object.fromEntries(
                social
                    ? chatSocialCommands.map((command) => [
                        command,
                        async (context: CommandContext) =>
                            social.execute(
                                context.uid,
                                command,
                                context.params,
                                String(context.sendTime ?? randomUUID()),
                            ),
                    ])
                    : [],
            ),
            ...Object.fromEntries(
                controllers.map((controller) => [controller.command, controller.handle]),
            ),
        };

        this.gateway = new ChatWebSocketGateway({
            verifyToken: new ChatPlayerTokenVerifier(repository).verify,
            handlers,
            isReady,
            log,
        });
        this.distribution = repository.delivery && this.gateway.peers
            ? new ChatDeliveryService({
                store: repository.delivery,
                instance: instanceId,
                peers: this.gateway.peers,
                authorizeRoom,
                access: repository.access,
                log,
            })
            : undefined;
        this.maintenance = new ChatMaintenanceService({
            repository,
            distribution: this.distribution,
            log,
        });
        this.server = new ChatHttpServer({
            isReady,
            socialHandler: social
                ? new RealmSocialController(
                    new RealmSocialService(repository, isReady),
                    signingSecret,
                )
                    .handle
                : undefined,
            mailboxHandler: repository.mailbox
                ? new ChatMailboxController({ mailboxes: repository.mailbox, signingSecret, log })
                    .handle
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
            sessionHandler: new ChatSessionController(
                new ChatSessionService(sessionStore),
                signingSecret,
                new ChatSessionFormVerifier(signingSecret),
                log,
            ).handle,
            configHandler: new ChatConfigController({ websocketUrl, isReady }).handle,
            serverListHandler: new ChatServerListController({ websocketUrl, isReady }).handle,
            websocketGateway: this.gateway,
        }).server;

        this.timer = setInterval(() => {
            void this.runMaintenance();
        }, cleanupIntervalMs);
        this.timer.unref();
    }

    public readonly runDistribution = (): Promise<void> => {
        return this.distribution?.poll() ?? Promise.resolve();
    };

    public readonly runMaintenance = (): Promise<boolean> => this.maintenance.run();

    public async close(): Promise<void>
    {
        clearInterval(this.timer);
        await this.maintenance.close();
        await this.distribution?.close();
        await this.gateway.close();

        if (this.server.listening)
        {
            await new Promise<void>((resolve, reject) =>
                this.server.close((error) => (error ? reject(error) : resolve()))
            );
        }
    }
}
