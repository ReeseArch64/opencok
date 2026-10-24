import type { ResponseValue } from "./value.ts";

export interface ReconnectMarchArmyResponse {
  readonly armId: number;
  readonly total: number;
  readonly dead: number;
  readonly knight_total?: number;
  readonly knight_dead?: number;
}

export interface ReconnectMarchDragonResponse {
  readonly uuid: string;
  readonly itemId: string;
  readonly friendShip: number;
  readonly userId?: string;
  readonly nickName?: string;
}

export interface ReconnectMarchGeneralResponse {
  readonly userId: string;
  readonly generalId: string;
  readonly level: number;
  readonly skillList?: string[];
}

export interface ReconnectMarchResponse {
  readonly uuid: string;
  readonly o: string;
  readonly ouid: string;
  readonly mType: number;
  readonly tType: number;
  readonly sType: number;
  readonly color: number;
  readonly sp: number;
  readonly dp: number;
  readonly extraParam: number;
  readonly serverId: number;
  readonly isDuel: number;
  readonly mt: number;
  readonly slowDown: boolean;
  readonly st: bigint;
  readonly et: bigint;
  readonly territoryStartTime?: bigint;
  readonly territoryUpdateTime?: bigint;
  readonly occupyEndTime?: bigint;
  readonly tct?: bigint;
  readonly exploreSt?: bigint;
  readonly exploreTime?: bigint;
  readonly sdt?: bigint;
  readonly changeCollectSpdTime?: bigint;
  readonly territoryStat?: number;
  readonly monsterCount?: number;
  readonly monsterLevel?: number;
  readonly attSkin?: number;
  readonly defSkin?: number;
  readonly marchSkin?: number;
  readonly oType?: number;
  readonly crt?: number;
  readonly q?: number;
  readonly tq?: number;
  readonly collected?: number;
  readonly spd?: number;
  readonly plunderRes?: string;
  readonly asn?: string;
  readonly tali?: string;
  readonly officer?: string;
  readonly team?: string;
  readonly mt2?: ResponseValue[];
  readonly army: ReconnectMarchArmyResponse[];
  readonly leaderArmy?: ReconnectMarchArmyResponse[];
  readonly petDragon?: ReconnectMarchDragonResponse;
  readonly dragonList?: ReconnectMarchDragonResponse[];
  readonly generalList?: ReconnectMarchGeneralResponse[];
}

export interface ReconnectMarchesResponse {
  readonly worldMarch: ReconnectMarchResponse[];
}
