export class PublicStatisticsDto {
  declare public readonly battleWin?: number;
  declare public readonly battleLose?: number;
  declare public readonly attackWin?: number;
  declare public readonly attackLose?: number;
  declare public readonly defenseWin?: number;
  declare public readonly detectNum?: number;
  declare public readonly armyDead?: number;
  declare public readonly armyCure?: number;
  declare public readonly cityDes?: number;
  declare public readonly armyKill?: bigint;
  declare public readonly power?: bigint;
}

export class PublicMedalDto {
  declare public readonly id: string;
  declare public readonly level: number;
}

export class GeneralInfoDto {
  declare public readonly uuid: string;
  declare public readonly generalId: string;
  declare public readonly level: number;
  declare public readonly status: number;
  declare public readonly att: number;
  declare public readonly defence: number;
  declare public readonly ability: { readonly [key: string]: null | string | number }[];
  declare public readonly skill: {
    readonly uuid: string;
    readonly ownerId: string;
    readonly skillId: string;
    readonly startTime: bigint;
    readonly endTime: bigint;
    readonly actTime: bigint;
    readonly stat: number;
    readonly param1: number;
    readonly param2: number;
  }[];
}

export class PublicGeneralsDto {
  declare public readonly skillPoint: number;
  declare public readonly userGenerals: GeneralInfoDto[];
}

export class PublicEquipmentDto {
  declare public readonly uuid: string;
  declare public readonly itemId: string;
  declare public readonly extraProperty: string;
  declare public readonly refineProperty: string;
  declare public readonly lockProperty?: string;
  declare public readonly suit_effect?: string;
  declare public readonly suit_value?: string;
  declare public readonly suit_value_type?: string;
  declare public readonly suit_value_sign?: string;
  declare public readonly Buff?: string;
  declare public readonly buff?: string;
  declare public readonly buff_str?: string;
  declare public readonly buff_Str?: string;
  declare public readonly buffStr?: string;
  declare public readonly BuffStr?: string;
  declare public readonly on: number;
  declare public readonly reforgeCount: number;
  declare public readonly strength_level?: number;
}

export class PublicProfileBaseDto {
  declare public readonly uid: string;
  declare public readonly name: string;
  declare public readonly pic: string;
  declare public readonly medal: string;
  declare public readonly serverName: string;
  declare public readonly lastUpdateTime: string;
  declare public readonly officer?: string;
  declare public readonly level: number;
  declare public readonly exp: number;
  declare public readonly picVer: number;
  declare public readonly picfraId: number;
  declare public readonly gmFlag: number;
  declare public readonly maxExp: number;
  declare public readonly vip: number;
  declare public readonly vipEndTime: number;
  declare public readonly armedLevel: number;
  declare public readonly market: number;
  declare public readonly score: number;
  declare public readonly serverId: number;
  declare public readonly flowerVal: number;
  declare public readonly showEquip: boolean;
  declare public readonly showMedal: boolean;
  declare public readonly showMarchSoldier: boolean;
  declare public readonly achieveNum: number;
  declare public readonly battleWin?: number;
  declare public readonly battleLose?: number;
  declare public readonly attackWin?: number;
  declare public readonly attackLose?: number;
  declare public readonly defenseWin?: number;
  declare public readonly detectNum?: number;
  declare public readonly armyDead?: number;
  declare public readonly armyCure?: number;
  declare public readonly cityDes?: number;
  declare public readonly armyKill?: bigint;
  declare public readonly power?: bigint;
  declare public readonly medalList: PublicMedalDto[];
  declare public readonly equip: PublicEquipmentDto[];
}
