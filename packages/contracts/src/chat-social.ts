import type { ChatSocialAction } from "@opencok/enums/chat-social-action";

export interface ChatLegacyRelations
{
    realm: number;
    contacts: { other: string; state: number; description: string; }[];
    blocks: { other: string; id: string; }[];
}

export type ChatSocialCommand = `${ChatSocialAction}`;

export interface ChatSocialOperation
{
    owner: string;
    operationId: string;
    command: ChatSocialCommand;
    target: string;
    room: string;
    name: string;
    body: string;
    description: string;
    members: string[];
    ids: string[];
    duration: number;
    sequence: number;
    limit: number;
    feedId: string;
    feedType: number;
    feedData: string;
    feedAuth: string;
    notices: string[];
    localId: string;
}

export type { ChatSocialResponse } from "./responses/chat-social.ts";

import type { ChatSocialResponse } from "./responses/chat-social.ts";

export interface ChatSocialStore
{
    execute(
        operation: ChatSocialOperation,
        plan: (tx: ChatSocialTransaction) => Promise<ChatSocialResponse>,
    ): Promise<ChatSocialResponse>;
}

export interface SocialRelation
{
    owner: string;
    other: string;
    kind: string;
    state: number;
    description: string;
    id: string;
    facebookId: string | null;
    facebookName: string | null;
    createdAt: bigint;
}

export interface SocialRoom
{
    id: string;
    owner: string;
    name: string;
    version: number;
    createdAt: bigint;
    deletedAt: bigint | null;
}

export interface SocialMember
{
    room: string;
    owner: string;
    role: number;
    joinedAt: bigint;
    leftAt: bigint | null;
    readSequence: bigint;
}

export interface SocialFeed
{
    id: string;
    owner: string;
    realm: number;
    alliance: string;
    parent: string | null;
    type: number;
    body: unknown;
    createdAt: bigint;
    expiresAt: bigint;
    deletedAt: bigint | null;
}

export interface ChatSocialTransaction
{
    now: bigint;
    actor: import("./chat.ts").PlayerState;
    target: import("./chat.ts").PlayerState | null;
    players: ReadonlyMap<string, import("./chat.ts").PlayerState | null>;
    invitees: { uid: string; name: string; }[];
    facebookPlayers: { uid: string; facebookId: string; }[];
    canSend: boolean;
    blocked(first: string, second: string): Promise<boolean>;
    relations(owner: string, kind: string): Promise<SocialRelation[]>;
    pair(owner: string, other: string): Promise<SocialRelation[]>;
    putRelation(row: SocialRelation): Promise<void>;
    removeRelations(owner: string, kind: string, others: string[]): Promise<void>;
    room(id: string): Promise<SocialRoom | null>;
    myRooms(owner: string): Promise<(SocialRoom & { role: number; })[]>;
    members(id: string): Promise<SocialMember[]>;
    putRoom(row: SocialRoom): Promise<void>;
    putMember(row: SocialMember): Promise<void>;
    append(
        room: string,
        owner: string,
        key: string,
        body: string,
        post?: number,
    ): Promise<import("./chat.ts").ChatMessage>;
    history(
        room: string,
        joinedAt: bigint,
        before: number,
        limit: number,
    ): Promise<import("./chat.ts").ChatMessage[]>;
    markRead(room: string, owner: string, sequence: number): Promise<void>;
    removeMessage(sequence: number): Promise<void>;
    moderate(
        owner: string,
        actor: string,
        reason: string,
        notice: boolean,
        until: bigint,
    ): Promise<void>;
    report(owner: string, target: string, reason: string): Promise<string>;
    direct(
        owner: string,
        recipient: string,
        body: string,
        senderRealm: number,
        recipientRealm: number,
    ): Promise<string>;
    event(
        owner: string,
        command: string,
        data: Record<string, unknown>,
        target?: string | null,
        room?: string,
    ): Promise<void>;
    feed(id: string): Promise<SocialFeed | null>;
    feeds(owner: string, realm: number, alliance: string): Promise<SocialFeed[]>;
    putFeed(row: SocialFeed): Promise<void>;
    removeFeed(id: string): Promise<void>;
    feedNotice(owner: string, id: string): Promise<void>;
    removeFeedNotices(owner: string, ids: string[]): Promise<void>;
}
