import type { Row } from "./rows.ts";

export const FILE_LIMIT = 2097152;

export const BODY_LIMIT = 2162688;

export const UPLOAD_PATH = "/gameservice/www/gateway/json.php";

export const IMAGE_PATH = /^\/cok\/img\/([0-9]{1,6})\/([a-f0-9]{32})\.jpg$/;

export interface ImageStore {
  put(key: string, bytes: Buffer, owner: string, seq: string, hash: string): Promise<void>;
  get(key: string): Promise<Uint8Array | null>;
  removePrevious(owner: string, sequence: string): Promise<void>;
  find(owner: string, sequence: string): Promise<UploadReceipt | null>;
  image(key: string): Promise<string>;
}

export type AvatarTicketPurpose = "upload" | "confirm" | "image";

export interface AvatarTickets {
  issue(owner: string, sequence: number, purpose: AvatarTicketPurpose): Promise<string>;
  verify(token: string, purpose: AvatarTicketPurpose): Promise<{ owner: string; seq: string }>;
}

export interface UploadReceipt {
  owner: string;
  sequence: string;
  hash: string;
}

export interface AvatarGrant {
  owner: string;
  sequence: number;
  grant: string;
  pendingHash: string;
}

export interface AvatarGrantReaders {
  castleLevel(): Promise<number>;
  uploadRecord(): Promise<Row | undefined>;
}

export type AvatarGrantInspector = (
  profile: Row,
  readers: AvatarGrantReaders,
) => Promise<AvatarGrant>;

export interface AvatarGrantSnapshot {
  profile: Row | undefined;
  grant?: AvatarGrant;
}

export interface AvatarFiles {
  find(owner: string, sequence: number): Promise<UploadReceipt | null>;
  issue(owner: string, sequence: number): string | Promise<string>;
  image(owner: string, sequence: number): string | Promise<string>;
}

export interface AvatarGrantService extends AvatarFiles {
  read(owner: string, now: number, inspect: AvatarGrantInspector): Promise<AvatarGrantSnapshot>;
}

export interface AvatarFinishQuery {
  sequence: number;
  hash: string;
  now: number;
}

export interface AvatarFinishPlan {
  picVer: number;
  moderated: boolean;
  effects: string;
  pendingEffects: number;
}

export type AvatarFinishInspector = (
  profile: Row,
  readers: AvatarGrantReaders,
) => Promise<AvatarFinishPlan>;

export interface AvatarFinishSnapshot {
  profile: Row | undefined;
  picVer?: number;
  superseded?: boolean;
  applied?: boolean;
}

export interface AvatarFinishStore {
  commit(
    owner: string,
    query: AvatarFinishQuery,
    find: AvatarFiles["find"],
    inspect: AvatarFinishInspector,
  ): Promise<AvatarFinishSnapshot>;
}

export interface AvatarCompletionRecord {
  revision?: bigint;
  ownerUid: string;
  sequence: number;
  hash: string;
  picVer: number;
  committedAt: bigint;
  effects: string;
  pendingEffects: number;
}

export interface AvatarSystemMail {
  uid: string;
  owner: string;
  fromName: string;
  title: string;
  type: 2 | 9 | 15;
  contents: Uint8Array;
  extra: Uint8Array | null;
  rewardId: string | null;
  rewardStatus: 0 | 1;
  reply: number;
  itemIdFlag?: 0 | 1;
  createTime: bigint;
}

export type AvatarMailPlanner = (
  completion: AvatarCompletionRecord,
  stem: string,
) => AvatarSystemMail;

export interface AvatarMailDelivery {
  profile: Row | undefined;
  mail?: AvatarSystemMail;
}

export interface AvatarProfileUpdate {
  revision?: bigint;
  owner: string;
  kingdomId: number;
  sequence: number;
  picVer: number;
  committedAt: bigint;
  updatedAt: string;
  userName: string;
  platform: string;
}

export type AvatarProfileProjector = (
  entry: AvatarCompletionRecord,
  kingdomId: number,
) => AvatarProfileUpdate;

export type AvatarProfilePublisher = (
  update: AvatarProfileUpdate,
  signal: AbortSignal,
) => Promise<void>;

export interface AvatarProfileDelivery {
  profile: Row | undefined;
  published: boolean;
}

export interface AvatarFinishService {
  finish(owner: string, receipt: string, now: number): Promise<AvatarFinishSnapshot>;
  deliver(owner: string, sequence: number): Promise<void>;
}

export interface AvatarDeliveryKey {
  owner: string;
  sequence: number;
}
