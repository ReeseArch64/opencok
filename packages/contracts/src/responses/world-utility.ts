export interface WorldNearestPointResponse {
  readonly point: number;
}

export interface WorldAlliancePointsResponse {
  readonly pointId: number;
  readonly territoryPointId?: readonly { readonly pointId: number }[];
  readonly memberPointId?: readonly {
    readonly pointId: number;
    readonly allianceId: string;
    readonly worldId: number;
  }[];
}
