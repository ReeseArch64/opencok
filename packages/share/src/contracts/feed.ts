import type { ShareFeedEnvelope } from "./envelope";

export interface ShareFeedOperation extends ShareFeedEnvelope
{
    owner: string;
    command: string;
    body: string;
    ids: string[];
}

export interface ShareFeedActor
{
    serverId: number;
    allianceId: string | null;
    membershipAllianceId: string | null;
    gmFlag?: number;
    moderationAllowed?: boolean;
}

export interface ShareFeed
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

export interface ShareFeedStore
{
    feed(id: string): Promise<ShareFeed | null>;
    feeds(owner: string, realm: number, alliance: string): Promise<ShareFeed[]>;
    putFeed(row: ShareFeed): Promise<void>;
    removeFeed(id: string): Promise<void>;
    feedNotice(owner: string, id: string): Promise<void>;
    removeFeedNotices(owner: string, ids: string[]): Promise<void>;
}

export interface ShareFeedTransaction extends ShareFeedStore
{
    now: bigint;
    actor: ShareFeedActor;
    players: ReadonlyMap<string, ShareFeedActor | null>;
    blocked(first: string, second: string): Promise<boolean>;
    event(
        owner: string,
        command: string,
        data: Record<string, unknown>,
        target?: string | null,
        room?: string,
    ): Promise<void>;
}

export interface ShareFeedResponse
{
    [key: string]: unknown;
}
