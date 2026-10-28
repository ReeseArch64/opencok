import { heroResourceConfigSchema } from "@opencok/hero/validations/resource-config";
import { z } from "zod";
import type {
    DynamicResourceConfigResponse,
    ServerClockResponse,
    FeatureConfigResponse,
    PushPreferenceResponse,
    LoginConfigurationPreferencesResponse,
    LoginSwitchesResponse,
    LoginConfigurationResponse,
    SettingConfigResponse,
    ArmySnapshotResponse,
} from "@opencok/contracts/responses/bootstrap";
import { field, responseRecord } from "@opencok/messages/validations/response";

export const dynamicResourceConfigSchema = heroResourceConfigSchema.catchall(
    field.string,
) satisfies z.ZodType<DynamicResourceConfigResponse>;

export const serverClockSchema = z.strictObject({
    db_utc_timestamp: field.int,
    db_timezone_offset: field.int,
    tomorrow: field.int,
}) satisfies z.ZodType<ServerClockResponse>;

export const featureConfigSchema = z.strictObject({
    funcOn: z
        .array(
            z.strictObject({
                funcKey: field.string,
                pf: field.string,
                version: field.string,
                onOff: field.bool,
            }),
        )
        .max(32767),
}) satisfies z.ZodType<FeatureConfigResponse>;

export const pushPreferencesSchema = z
    .array(z.strictObject({ type: field.int, status: field.int, audio: field.int.optional() }))
    .max(32767) satisfies z.ZodType<PushPreferenceResponse[]>;

export const loginConfigurationPreferencesSchema = z.strictObject({
    fbShare: z.array(responseRecord(z.string(), field.string)).max(32767),
    pushSetting: pushPreferencesSchema,
}) satisfies z.ZodType<LoginConfigurationPreferencesResponse>;

export const loginSwitchesSchema = z.strictObject({
    switches: z
        .array(
            z.strictObject({
                name: field.string,
                stat: z.union([field.int, field.null]),
                appVersion: z.union([field.string, field.null]),
            }),
        )
        .max(32767),
}) satisfies z.ZodType<LoginSwitchesResponse>;

export const loginConfigurationSchema = loginConfigurationPreferencesSchema.extend({
    funcOn: featureConfigSchema.shape.funcOn,
    switches: loginSwitchesSchema.shape.switches.optional(),
    isVerifyChangeAccount: field.bool.optional(),
}) satisfies z.ZodType<LoginConfigurationResponse>;

export const settingConfigSchema = z.strictObject({
    setting: z.array(responseRecord(z.string(), field.string)).max(32767),
}) satisfies z.ZodType<SettingConfigResponse>;

export const armySnapshotSchema = z.strictObject({
    id: field.string,
    science: field.string.optional(),
    free: field.int,
    march: field.int,
    level: field.int,
    train: field.int.optional(),
    health: field.int.optional(),
    range: field.int.optional(),
    move: field.int.optional(),
    speed: field.int.optional(),
    wood: field.int.optional(),
    stone: field.int.optional(),
    iron: field.int.optional(),
    food: field.int.optional(),
    time: field.int.optional(),
    heal_res: field.int.optional(),
    heal_time: field.int.optional(),
    load: field.int.optional(),
    new_arms: field.int,
    weak_res: field.int.optional(),
    weak_time: field.int.optional(),
    fine_iron: field.int.optional(),
    mix_numtype: field.int.optional(),
    unlock_civi_science: field.int.optional(),
    attack: field.int,
    defen: field.int,
    finish: field.long.optional(),
    upkeep: field.float,
    power: field.float,
}) satisfies z.ZodType<ArmySnapshotResponse>;
