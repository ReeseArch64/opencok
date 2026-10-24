import { z } from "zod";
import { createZodDto, wire, wireRecord } from "./dto.ts";

import { sfs, Type, type Fields, type Value } from "@opencok/messages/sfs";
import type { Rules } from "@opencok/rules/game";
import { GameError } from "@opencok/errors/game";
import { errors, PUSH_SETTING_COUNT, WORLD_NEWS_PUSH_TYPE } from "@opencok/constants/game";
import { long, num, text, type Row } from "@opencok/contracts/rows";
import type { LoginConfigurationState } from "@opencok/contracts/game";
import { featureAnnouncementEnabled, type FeatureContext } from "@opencok/rules/features";

export { dataConfig, DataConfigDto } from "./configuration.ts";

function serializeServerClock(now: number, offsetHours: number): Fields {
  const offset = offsetHours * 3600;
  const seconds = Math.floor(now / 1000);
  return {
    db_utc_timestamp: sfs.int(offsetHours),
    db_timezone_offset: sfs.int(seconds),
    tomorrow: sfs.int((Math.floor((seconds + offset) / 86400) + 1) * 86400 - offset),
  };
}

function serializeFeatureConfig(rules: Rules, context: FeatureContext): Fields {
  return {
    funcOn: sfs.array(
      [...(rules.configuration.featureRecords ?? rules.features.values())].map((rule) => {
        if (typeof rule.id !== "string") throw new GameError(errors.unsupported, "config_string");
        const enabled = featureAnnouncementEnabled(rule, rules, context);
        if (typeof rule.pf !== "string" || typeof rule.version !== "string")
          throw new GameError(errors.unsupported, "config_string");
        return sfs.object({
          funcKey: sfs.string(rule.id!),
          pf: sfs.string(rule.pf!),
          version: sfs.string(rule.version!),
          onOff: sfs.bool(enabled),
        });
      }),
    ),
  };
}

function serializeLoginConfigurationPreferences(
  rules: Rules,
  state: LoginConfigurationState,
): Fields {
  const fbShare = sfs.array(
    [
      ...(rules.configuration.facebookShareRecords ??
        rules.configuration.facebookShare?.values() ??
        []),
    ].map((rule) =>
      sfs.object(
        Object.fromEntries(Object.entries(rule).map(([key, value]) => [key, sfs.string(value)])),
      ),
    ),
  );
  return { fbShare, pushSetting: pushPreferences(state.pushSettings) };
}

function serializePushPreferences(rows: readonly Row[]) {
  const present = new Set(rows.map((row) => num(row, "type")));
  const pushSettings = rows.map((row) =>
    sfs.object({
      type: sfs.int(num(row, "type")),
      status: sfs.int(num(row, "status")),
      audio: sfs.int(num(row, "audio")),
    }),
  );
  if (rows.length < PUSH_SETTING_COUNT)
    for (let type = 0; type < PUSH_SETTING_COUNT; type++)
      if (!present.has(type))
        pushSettings.push(
          sfs.object({
            type: sfs.int(type),
            status: sfs.int(type === WORLD_NEWS_PUSH_TYPE ? 0 : 1),
          }),
        );
  return sfs.array(pushSettings);
}

function serializeLoginSwitches(rows: readonly Row[]): Fields {
  return {
    switches: sfs.array(
      rows.map((row) =>
        sfs.object({
          name: sfs.string(text(row, "name")),
          stat: row.stat === null ? sfs.null() : sfs.int(num(row, "stat")),
          appVersion: row.appVersion === null ? sfs.null() : sfs.string(text(row, "appVersion")),
        }),
      ),
    ),
  };
}

function serializeLoginConfiguration(
  rules: Rules,
  state: LoginConfigurationState,
  context: FeatureContext,
  verifyChangeAccount: boolean | undefined,
): Fields {
  return {
    ...loginConfigurationPreferences(rules, state),
    ...(state.switches === undefined ? {} : loginSwitches(state.switches)),
    ...(state.switches !== undefined && verifyChangeAccount !== undefined
      ? { isVerifyChangeAccount: sfs.bool(verifyChangeAccount) }
      : {}),
    ...featureConfig(rules, context),
  };
}

function serializeSettingConfig(rules: Rules): Fields {
  return {
    setting: sfs.array(
      [...(rules.configuration.settingRecords ?? rules.settings.values())].map((rule) =>
        sfs.object(
          Object.fromEntries(Object.entries(rule).map(([key, value]) => [key, sfs.string(value)])),
        ),
      ),
    ),
  };
}

function serializeArmySnapshot(row: Row, rules: Rules): Fields {
  const id = text(row, "armyId");
  const rule = rules.arms.get(id);
  if (!rule) throw new GameError(errors.unsupported);
  const out: Fields = { id: sfs.string(id) };
  for (const key of ["free", "march", "level"]) out[key] = sfs.int(num(row, key));
  if (num(row, "train")) {
    out.train = sfs.int(num(row, "train"));
    out.finish = sfs.long(long(row, "finishTime"));
  }
  for (const key of [
    "health",
    "range",
    "move",
    "speed",
    "wood",
    "stone",
    "iron",
    "food",
    "time",
    "heal_res",
    "heal_time",
    "load",
    "new_arms",
    "weak_res",
    "weak_time",
    "fine_iron",
    "mix_numtype",
    "unlock_civi_science",
  ])
    if (rule[key] !== undefined) out[key] = sfs.int(Math.trunc(Number(rule[key])));
  out.attack = sfs.int(
    Math.trunc(Math.fround(Number(rule.attack)) + num(row, "level") * Number(rule.attack_add)),
  );
  out.defen = sfs.int(
    Math.trunc(Math.fround(Number(rule.defence))) + num(row, "level") * Number(rule.defence_add),
  );
  out.upkeep = { type: Type.Float, value: Math.fround(Math.fround(Number(rule.upkeep)) / 24) };
  out.power = { type: Type.Float, value: Number(rule.power) };
  out.new_arms ??= sfs.int(0);
  if (rule.science) out.science = sfs.string(rule.science);
  return out;
}

function serializeInventoryItem(row: Row, rules: Rules): Fields {
  const rule = rules.goods.get(text(row, "itemId").trim());
  if (!rule) throw new GameError(errors.unsupported);
  const out: Fields = {
    uuid: sfs.string(text(row, "uuid")),
    itemId: sfs.string(text(row, "itemId")),
    count: sfs.int(num(row, "count")),
    vanishTime: sfs.long(long(row, "vanishTime")),
  };
  for (let i = 1; i < 10; i++)
    if (rule[`para${i}`]) out[`para${i}`] = sfs.string(rule[`para${i}`]!);
  return out;
}

export class ServerClockDto extends createZodDto(
  z.strictObject({
    db_utc_timestamp: wire.int,
    db_timezone_offset: wire.int,
    tomorrow: wire.int,
  }),
) {}

export class FeatureConfigDto extends createZodDto(
  z.strictObject({
    funcOn: wire.array(
      wire.object(
        z.strictObject({
          funcKey: wire.string,
          pf: wire.string,
          version: wire.string,
          onOff: wire.bool,
        }),
      ),
    ),
  }),
) {}

export class PushPreferencesDto extends createZodDto(
  wire.array(
    wire.object(z.strictObject({ type: wire.int, status: wire.int, audio: wire.int.optional() })),
  ),
) {}

export class LoginConfigurationPreferencesDto extends createZodDto(
  z.strictObject({
    fbShare: wire.array(wire.object(wireRecord(z.string(), wire.string))),
    pushSetting: PushPreferencesDto.schema,
  }),
) {}

export class LoginSwitchesDto extends createZodDto(
  z.strictObject({
    switches: wire.array(
      wire.object(
        z.strictObject({
          name: wire.string,
          stat: z.union([wire.int, wire.null]),
          appVersion: z.union([wire.string, wire.null]),
        }),
      ),
    ),
  }),
) {}

export class LoginConfigurationDto extends createZodDto(
  LoginConfigurationPreferencesDto.schema.extend({
    funcOn: FeatureConfigDto.schema.shape.funcOn,
    switches: LoginSwitchesDto.schema.shape.switches.optional(),
    isVerifyChangeAccount: wire.bool.optional(),
  }),
) {}

export class SettingConfigDto extends createZodDto(
  z.strictObject({ setting: wire.array(wire.object(wireRecord(z.string(), wire.string))) }),
) {}

export class ArmySnapshotDto extends createZodDto(
  z.strictObject({
    id: wire.string,
    science: wire.string.optional(),
    free: wire.int,
    march: wire.int,
    level: wire.int,
    train: wire.int.optional(),
    health: wire.int.optional(),
    range: wire.int.optional(),
    move: wire.int.optional(),
    speed: wire.int.optional(),
    wood: wire.int.optional(),
    stone: wire.int.optional(),
    iron: wire.int.optional(),
    food: wire.int.optional(),
    time: wire.int.optional(),
    heal_res: wire.int.optional(),
    heal_time: wire.int.optional(),
    load: wire.int.optional(),
    new_arms: wire.int,
    weak_res: wire.int.optional(),
    weak_time: wire.int.optional(),
    fine_iron: wire.int.optional(),
    mix_numtype: wire.int.optional(),
    unlock_civi_science: wire.int.optional(),
    attack: wire.int,
    defen: wire.int,
    finish: wire.long.optional(),
    upkeep: wire.float,
    power: wire.float,
  }),
) {}

export class InventoryItemDto extends createZodDto(
  z.strictObject({
    uuid: wire.string,
    itemId: wire.string,
    para1: wire.string.optional(),
    para2: wire.string.optional(),
    para3: wire.string.optional(),
    para4: wire.string.optional(),
    para5: wire.string.optional(),
    para6: wire.string.optional(),
    para7: wire.string.optional(),
    para8: wire.string.optional(),
    para9: wire.string.optional(),
    count: wire.int,
    vanishTime: wire.long,
  }),
) {}

export function serverClock(...args: Parameters<typeof serializeServerClock>): Fields {
  return new ServerClockDto(serializeServerClock(...args));
}

export function featureConfig(...args: Parameters<typeof serializeFeatureConfig>): Fields {
  return new FeatureConfigDto(serializeFeatureConfig(...args));
}

export function loginConfigurationPreferences(
  ...args: Parameters<typeof serializeLoginConfigurationPreferences>
): Fields {
  return new LoginConfigurationPreferencesDto(serializeLoginConfigurationPreferences(...args));
}

export function pushPreferences(...args: Parameters<typeof serializePushPreferences>): Value {
  return new PushPreferencesDto(serializePushPreferences(...args));
}

export function loginSwitches(...args: Parameters<typeof serializeLoginSwitches>): Fields {
  return new LoginSwitchesDto(serializeLoginSwitches(...args));
}

export function loginConfiguration(
  ...args: Parameters<typeof serializeLoginConfiguration>
): Fields {
  return new LoginConfigurationDto(serializeLoginConfiguration(...args));
}

export function settingConfig(...args: Parameters<typeof serializeSettingConfig>): Fields {
  return new SettingConfigDto(serializeSettingConfig(...args));
}

export function armySnapshot(...args: Parameters<typeof serializeArmySnapshot>): Fields {
  return new ArmySnapshotDto(serializeArmySnapshot(...args));
}

export function inventoryItem(...args: Parameters<typeof serializeInventoryItem>): Fields {
  return new InventoryItemDto(serializeInventoryItem(...args));
}
