export interface WorldResourceLoad {
  rawArmyLoad: number;
  pointType: number;
  pointItem: string | null;
  plunder: readonly { value?: number }[];
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
