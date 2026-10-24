import type { Row } from "./rows.ts";
export const FILE_LIMIT = 2097152;
export const BODY_LIMIT = 2162688;
export const UPLOAD_PATH = "/gameservice/www/gateway/json.php";
export const IMAGE_PATH = /^\/cok\/img\/([0-9]{1,6})\/([a-f0-9]{32})\.jpg$/;
export interface ImageStore {
  put(key: string, bytes: Buffer, owner: string, seq: string, hash: string): Promise<void>;
  get(key: string): Promise<Uint8Array | null>;
  find(owner: string, sequence: string): Promise<UploadReceipt | null>;
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
  issue(owner: string, sequence: number): string;
}
export interface AvatarGrantService extends AvatarFiles {
  read(owner: string, now: number, inspect: AvatarGrantInspector): Promise<AvatarGrantSnapshot>;
}
