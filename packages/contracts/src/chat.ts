import type { ChatRoomGroup } from "@opencok/enums/chat-room-group";
import type {
  ChatAccessStore,
  ChatDeliveryStore,
  ChatHistoryPage,
  ChatHistoryQuery,
} from "./chat-delivery.ts";
import type { ChatSocialStore } from "./chat-social.ts";
import type { ChatMailboxStore } from "./chat-mailbox.ts";
import type { ChatAvatarProfileStore } from "./chat-avatar-profile.ts";
import type { ChatNicknameStore } from "./chat-nickname.ts";
import type { IncomingMessage, Server, ServerResponse } from "node:http";

export interface Session {
  tokenHash: Buffer;
  uid: string;
  createdAt: Date;
  expiresAt: Date;
}

export interface SessionStore {
  revoke?(uid: string): Promise<void>;
  create(session: Session): Promise<void>;
  getById(tokenHash: Buffer): Promise<{ uid: string } | null>;
}

export interface PlayerState {
  serverId: number;
  originalServerId: number;
  allianceId: string | null;
  membershipAllianceId: string | null;
  language: string;
  allianceJoinedAt?: number;
  gmFlag?: number;
  moderationAllowed?: boolean;
  name?: string | null;
  pic?: string | null;
  picVer?: number | null;
  picfraId?: number | null;
  facebookId?: string | null;
  banned?: boolean;
  banUntil?: number;
  chatBanUntil?: number;
  noticeBanUntil?: number;
}

export type RoomGroup = `${ChatRoomGroup}`;

export interface Room {
  group: RoomGroup;
  roomId: string;
}

export type PlayerStateLoader = (uid: string) => Promise<PlayerState | null>;

export type RoomAuthorizer = (uid: string, roomId: string) => Promise<Room | null>;

export interface MessageInput {
  roomId: string;
  senderUid: string;
  idempotencyKey: string;
  body: string;
  now: Date;
  post?: number;
}

export interface ChatMessage {
  sequenceId: number;
  roomId: string;
  senderUid: string;
  idempotencyKey: string;
  body: string;
  createdAt: string;
  post?: number;
}

export interface MessageStore {
  durableDelivery?: boolean;
  page?(query: ChatHistoryQuery): Promise<ChatHistoryPage>;
  remove?(sequenceId: number, actor: string): Promise<void>;
  create(input: MessageInput): Promise<ChatMessage & { inserted: boolean }>;
  getAll(roomId: string, afterMs?: number): Promise<ChatMessage[]>;
  getAllByRange(roomId: string, startMs: number, endMs: number): Promise<ChatMessage[]>;
}

export interface Connection {
  joinedRooms: Set<string>;
}

export type Frame = Record<string, unknown>;

export interface Peer {
  uid: string;
  connection: Connection;
  sendFrame(frame: Frame): void;
  authorizeSession?: (closeOnFailure?: boolean) => Promise<boolean>;
}

export interface CommandContext extends Peer {
  params: Record<string, unknown>;
  sendTime?: unknown;
  peers: Set<Peer>;
}

export type CommandHandler = (context: CommandContext) => Promise<unknown>;

export type CommandHandlers = Record<string, CommandHandler>;

export type Log = (event: { correlationId?: string; operation: string; category: string }) => void;

export type HttpHandler = (request: IncomingMessage, response: ServerResponse) => void;

export type AsyncHttpHandler = (
  request: IncomingMessage,
  response: ServerResponse,
) => Promise<void>;

export type TokenVerifier = (
  token: unknown,
  claimedUid?: unknown,
) => Promise<{ uid: string } | null>;

export interface WebSocketGateway {
  peers?: Set<Peer>;
  attach(server: Server): void;
  close(): Promise<void>;
}

export interface RoomHandlerOptions {
  authorizeRoom: RoomAuthorizer;
  messages: MessageStore;
  access?: ChatAccessStore;
}

export interface IncomingFrame {
  cmd: string;
  params: Record<string, unknown>;
  sendTime?: unknown;
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function isSafeInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isSafeInteger(value);
}

export interface ChatRepository {
  authorizeRealm?(realm: number, token: string, epoch: string): Promise<boolean>;
  social?: ChatSocialStore;
  access?: ChatAccessStore;
  delivery?: ChatDeliveryStore;
  realmEvents?(
    owner: string,
    realm: number,
    command: string,
    params: Record<string, unknown>,
  ): Promise<Record<string, unknown>>;
  mineCommand?(
    owner: string,
    realm: number,
    command: string,
    params: Record<string, unknown>,
    operationId: string,
  ): Promise<Record<string, unknown>>;
  publishNotice?(
    owner: string,
    realm: number,
    operationId: string,
  ): Promise<Record<string, unknown>>;
  archivePending?(): Promise<number>;
  mailbox?: ChatMailboxStore;
  profiles: ChatAvatarProfileStore;
  nicknames: ChatNicknameStore;
  sessions: SessionStore;
  messages: MessageStore;
  getPlayerStateById: PlayerStateLoader;
  deleteExpired(): Promise<{ messages: number; sessions: number }>;
  health(): Promise<void>;
}

export interface RealmChatSessionRequest {
  uid: string;
  userinfo: Record<string, string>;
}

export interface ChatSessionTicket {
  session: string;
  expire: number;
}

export type ChatSessionIssuer = (request: RealmChatSessionRequest) => Promise<ChatSessionTicket>;

export function isChatSessionTicket(value: unknown, now: number): value is ChatSessionTicket {
  if (
    !isRecord(value) ||
    typeof value.session !== "string" ||
    !/^[A-Za-z0-9_-]{43}$/.test(value.session)
  )
    {return false;}

  const token = Buffer.from(value.session, "base64url");

  return (
    token.length === 32 &&
    token.toString("base64url") === value.session &&
    Number.isSafeInteger(now) &&
    now >= 0 &&
    isSafeInteger(value.expire) &&
    value.expire > Math.floor(now / 1000)
  );
}

export const chatDiscoveryPaths = [
  "/api/v1global_config",
  "/chat/server/links",
  "/chat/server/all",
] as const;

export type ChatDiscoveryPath = (typeof chatDiscoveryPaths)[number];

export interface ChatDiscoveryReply {
  code: 1;
  data: unknown;
  message?: string;
}

export type ChatDiscovery = (path: ChatDiscoveryPath) => Promise<ChatDiscoveryReply>;
