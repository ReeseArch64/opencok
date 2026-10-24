export interface WorldResourceLoad {
  rawArmyLoad: number;
  pointType: number;
  pointItem: string | null;
  plunder: readonly { value?: number }[];
}

export interface WorldResourceSoldier {
  armsId: string;
  total: number;
  dead: number;
  loadEffect: number;
}

export interface WorldResourceLoadEffects {
  worldLoad: number;
  worldLoadAdd: number;
  general: number;
  newGeneral: number;
  expedition: number;
}

export interface WorldResourceArmy {
  cachedLoad: number;
  residentOwner: boolean;
  soldiers: readonly WorldResourceSoldier[];
  effects?: WorldResourceLoadEffects;
}

export interface WorldResourceCollection {
  collectSpd: number;
  marchArrivalTime: bigint;
  armyLoad: number;
}

export interface WorldResourceMarch extends WorldResourceCollection {
  maxCollectTime: bigint;
  collectedBeforeSpd: number;
  changeCollectSpdTime: bigint;
  occupyResourceEndTime: bigint;
}

export type WorldResourceSavedCollection = Pick<
  WorldResourceMarch,
  | "collectSpd"
  | "marchArrivalTime"
  | "collectedBeforeSpd"
  | "changeCollectSpdTime"
  | "occupyResourceEndTime"
>;

export interface WorldResourceOwnerDetail {
  quantity: number;
  speed: number;
  startTime: bigint;
  remaining: number;
  collected: number;
  speedChangedAt: bigint;
  occupyEndTime: bigint;
}

export interface WorldResourceGroupDetail {
  speed: number;
  remaining: number;
  sampledAt: number;
}
