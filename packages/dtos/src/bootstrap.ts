export class ServerClockDto {
  readonly db_utc_timestamp!: number;
  readonly db_timezone_offset!: number;
  readonly tomorrow!: number;
}

export class FeatureConfigDto {
  readonly funcOn!: {
    readonly funcKey: string;
    readonly pf: string;
    readonly version: string;
    readonly onOff: boolean;
  }[];
}

export class PushPreferenceDto {
  readonly type!: number;
  readonly status!: number;
  readonly audio?: number;
}

export class LoginConfigurationPreferencesDto {
  readonly fbShare!: { readonly [key: string]: string }[];
  readonly pushSetting!: PushPreferenceDto[];
}

export class LoginSwitchesDto {
  readonly switches!: {
    readonly name: string;
    readonly stat: number | null;
    readonly appVersion: string | null;
  }[];
}

export class LoginConfigurationDto {
  readonly fbShare!: { readonly [key: string]: string }[];
  readonly pushSetting!: PushPreferenceDto[];
  readonly funcOn!: {
    readonly funcKey: string;
    readonly pf: string;
    readonly version: string;
    readonly onOff: boolean;
  }[];
  readonly switches?: {
    readonly name: string;
    readonly stat: number | null;
    readonly appVersion: string | null;
  }[];
  readonly isVerifyChangeAccount?: boolean;
}

export class SettingConfigDto {
  readonly setting!: { readonly [key: string]: string }[];
}

export class ArmySnapshotDto {
  readonly id!: string;
  readonly science?: string;
  readonly free!: number;
  readonly march!: number;
  readonly level!: number;
  readonly train?: number;
  readonly health?: number;
  readonly range?: number;
  readonly move?: number;
  readonly speed?: number;
  readonly wood?: number;
  readonly stone?: number;
  readonly iron?: number;
  readonly food?: number;
  readonly time?: number;
  readonly heal_res?: number;
  readonly heal_time?: number;
  readonly load?: number;
  readonly new_arms!: number;
  readonly weak_res?: number;
  readonly weak_time?: number;
  readonly fine_iron?: number;
  readonly mix_numtype?: number;
  readonly unlock_civi_science?: number;
  readonly attack!: number;
  readonly defen!: number;
  readonly finish?: bigint;
  readonly upkeep!: number;
  readonly power!: number;
}

export class InventoryItemDto {
  readonly uuid!: string;
  readonly itemId!: string;
  readonly para1?: string;
  readonly para2?: string;
  readonly para3?: string;
  readonly para4?: string;
  readonly para5?: string;
  readonly para6?: string;
  readonly para7?: string;
  readonly para8?: string;
  readonly para9?: string;
  readonly count!: number;
  readonly vanishTime!: bigint;
}

export { DataConfigDto } from "./configuration.ts";
