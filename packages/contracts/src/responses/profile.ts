export interface PublicStatisticsResponse
{
    readonly battleWin?: number;
    readonly battleLose?: number;
    readonly attackWin?: number;
    readonly attackLose?: number;
    readonly defenseWin?: number;
    readonly detectNum?: number;
    readonly armyDead?: number;
    readonly armyCure?: number;
    readonly cityDes?: number;
    readonly armyKill?: bigint;
    readonly power?: bigint;
}

export interface PublicMedalResponse
{
    readonly id: string;
    readonly level: number;
}

export interface PublicEquipmentResponse
{
    readonly uuid: string;
    readonly itemId: string;
    readonly extraProperty: string;
    readonly refineProperty: string;
    readonly lockProperty?: string;
    readonly suit_effect?: string;
    readonly suit_value?: string;
    readonly suit_value_type?: string;
    readonly suit_value_sign?: string;
    readonly Buff?: string;
    readonly buff?: string;
    readonly buff_str?: string;
    readonly buff_Str?: string;
    readonly buffStr?: string;
    readonly BuffStr?: string;
    readonly on: number;
    readonly reforgeCount: number;
    readonly strength_level?: number;
}

export interface PublicProfileBaseResponse
{
    readonly uid: string;
    readonly name: string;
    readonly pic: string;
    readonly medal: string;
    readonly serverName: string;
    readonly lastUpdateTime: string;
    readonly officer?: string;
    readonly level: number;
    readonly exp: number;
    readonly picVer: number;
    readonly picfraId: number;
    readonly gmFlag: number;
    readonly maxExp: number;
    readonly vip: number;
    readonly vipEndTime: number;
    readonly armedLevel: number;
    readonly market: number;
    readonly score: number;
    readonly serverId: number;
    readonly flowerVal: number;
    readonly showEquip: boolean;
    readonly showMedal: boolean;
    readonly showMarchSoldier: boolean;
    readonly achieveNum: number;
    readonly battleWin?: number;
    readonly battleLose?: number;
    readonly attackWin?: number;
    readonly attackLose?: number;
    readonly defenseWin?: number;
    readonly detectNum?: number;
    readonly armyDead?: number;
    readonly armyCure?: number;
    readonly cityDes?: number;
    readonly armyKill?: bigint;
    readonly power?: bigint;
    readonly medalList: PublicMedalResponse[];
    readonly equip: PublicEquipmentResponse[];
}
