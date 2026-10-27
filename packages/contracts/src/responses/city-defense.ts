export interface CityExtinguishResponse {
  readonly remainGold: bigint;
  readonly cityDef: number;
}

export interface CityRepairResponse {
  readonly lastCityDefTime: bigint;
  readonly cityDefValue: number;
}
