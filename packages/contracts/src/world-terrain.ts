export interface WorldTerrain {
  readonly format: "worldcreator-v2.normal.v1";
  readonly size: number;
  readonly sourceHash: string;
  readonly grid: Uint8Array;
  readonly overlay: Uint8Array;
}

export interface WorldTerrainRules {
  size: number;
  bornSide: number;
  resourceSide: number;
  monsterSide: number;
}

export interface WorldTerrainManifest extends WorldTerrainRules {
  version: 1;
  format: WorldTerrain["format"];
  kingdomId: number;
  sourceHash: string;
  layoutHash: string;
  cursor: number;
  complete: boolean;
  epoch: string;
}
