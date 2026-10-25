import type { Row } from "./rows.ts";
import type { AvatarGrantReaders } from "./files.ts";

export interface AvatarVersionKey {
  owner: string;
  operationId: string;
}

export interface AvatarVersionPlan {
  picVer: number;
  nextUpdateTime: bigint | null;
  moderated: boolean;
  effects: string;
  pendingEffects: number;
}

export interface AvatarVersionIntent {
  revision?: bigint;
  operationId: string;
  ownerUid: string;
  picVer: number;
  committedAt: bigint;
  nextUpdateTime: bigint | null;
  effects: string;
  pendingEffects: number;
}

export interface AvatarVersionResult {
  profile: Row | undefined;
  intent?: AvatarVersionIntent;
}

export type AvatarVersionInspector = (
  profile: Row,
  readers: AvatarGrantReaders,
) => Promise<AvatarVersionPlan>;

export interface AvatarVersionService {
  update(owner: string, now: number): Promise<AvatarVersionResult>;
  deliver(owner: string, operationId: string): Promise<void>;
}
