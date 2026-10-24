import type { Row } from "./rows.ts";
import type { GeneralPreview } from "./profile.ts";

export interface ReconnectBaseState {
  profile: Row | undefined;
  armies: readonly Row[];
  generals: readonly Row[];
  skills: readonly Row[];
}

export interface OwnGeneralSnapshot extends Omit<GeneralPreview, "plusSkillPoint"> {
  abilityIndex: number;
}

export interface FriendshipMine {
  itemId: number;
  level: number;
  exp: number;
  miner: number;
  mineTime: bigint;
  call: number;
}

export interface FriendshipMineView extends FriendshipMine {
  requiredExp: number;
  maxMiners: number;
}

export interface FriendshipMineStore {
  friendshipMine(uid: string, initial: () => FriendshipMine): Promise<Row>;
}
