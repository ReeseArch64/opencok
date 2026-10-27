export interface TreasureMapEntryResponse {
  readonly uuid: string;
  readonly treasureId: string;
  readonly currentOwner: string;
  readonly originalOwner: string;
  readonly targetId: number;
  readonly time: number;
  readonly colour: number;
  readonly state: number;
}
export interface TreasureMapOccupationResponse {
  readonly time: number;
  readonly finishtime: bigint;
  readonly useitem: string;
  readonly treasureuuid: string;
}
export interface TreasureMapSpeedResponse {
  readonly gold: bigint;
}
