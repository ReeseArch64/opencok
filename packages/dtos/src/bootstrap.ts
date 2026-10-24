export class ServerClockDto {
  declare public readonly db_utc_timestamp: number;
  declare public readonly db_timezone_offset: number;
  declare public readonly tomorrow: number;
}

export class FeatureConfigDto {
  declare public readonly funcOn: {
    readonly funcKey: string;
    readonly pf: string;
    readonly version: string;
    readonly onOff: boolean;
  }[];
}

export class PushPreferenceDto {
  declare public readonly type: number;
  declare public readonly status: number;
  declare public readonly audio?: number;
}

export class LoginConfigurationPreferencesDto {
  declare public readonly fbShare: { readonly [key: string]: string }[];
  declare public readonly pushSetting: PushPreferenceDto[];
}

export class LoginSwitchesDto {
  declare public readonly switches: {
    readonly name: string;
    readonly stat: number | null;
    readonly appVersion: string | null;
  }[];
}

export class LoginConfigurationDto {
  declare public readonly fbShare: { readonly [key: string]: string }[];
  declare public readonly pushSetting: PushPreferenceDto[];
  declare public readonly funcOn: {
    readonly funcKey: string;
    readonly pf: string;
    readonly version: string;
    readonly onOff: boolean;
  }[];
  declare public readonly switches?: {
    readonly name: string;
    readonly stat: number | null;
    readonly appVersion: string | null;
  }[];
  declare public readonly isVerifyChangeAccount?: boolean;
}

export class SettingConfigDto {
  declare public readonly setting: { readonly [key: string]: string }[];
}

export class ArmySnapshotDto {
  declare public readonly id: string;
  declare public readonly science?: string;
  declare public readonly free: number;
  declare public readonly march: number;
  declare public readonly level: number;
  declare public readonly train?: number;
  declare public readonly health?: number;
  declare public readonly range?: number;
  declare public readonly move?: number;
  declare public readonly speed?: number;
  declare public readonly wood?: number;
  declare public readonly stone?: number;
  declare public readonly iron?: number;
  declare public readonly food?: number;
  declare public readonly time?: number;
  declare public readonly heal_res?: number;
  declare public readonly heal_time?: number;
  declare public readonly load?: number;
  declare public readonly new_arms: number;
  declare public readonly weak_res?: number;
  declare public readonly weak_time?: number;
  declare public readonly fine_iron?: number;
  declare public readonly mix_numtype?: number;
  declare public readonly unlock_civi_science?: number;
  declare public readonly attack: number;
  declare public readonly defen: number;
  declare public readonly finish?: bigint;
  declare public readonly upkeep: number;
  declare public readonly power: number;
}

export class InventoryItemDto {
  declare public readonly uuid: string;
  declare public readonly itemId: string;
  declare public readonly para1?: string;
  declare public readonly para2?: string;
  declare public readonly para3?: string;
  declare public readonly para4?: string;
  declare public readonly para5?: string;
  declare public readonly para6?: string;
  declare public readonly para7?: string;
  declare public readonly para8?: string;
  declare public readonly para9?: string;
  declare public readonly count: number;
  declare public readonly vanishTime: bigint;
}

export { DataConfigDto } from "./configuration.ts";
