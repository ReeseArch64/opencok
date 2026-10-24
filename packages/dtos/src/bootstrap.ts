import { sfs, Type, type Fields } from "@opencok/messages/sfs";
import type { Rules } from "@opencok/rules/game";
import { GameError } from "@opencok/errors/game";
import { errors, PUSH_SETTING_COUNT, WORLD_NEWS_PUSH_TYPE } from "@opencok/constants/game";
import { long, num, text, type Row } from "@opencok/contracts/rows";
import type { LoginConfigurationState } from "@opencok/contracts/game";
import { featureAnnouncementEnabled, type FeatureContext } from "@opencok/rules/features";

export { dataConfig } from "./configuration.ts";

export function serverClock(now: number, offsetHours: number): Fields {
  const offset = offsetHours * 3600;
  const seconds = Math.floor(now / 1000);
  return {
    db_utc_timestamp: sfs.int(offsetHours),
    db_timezone_offset: sfs.int(seconds),
    tomorrow: sfs.int((Math.floor((seconds + offset) / 86400) + 1) * 86400 - offset),
  };
}

export function featureConfig(rules: Rules, context: FeatureContext): Fields {
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

export function loginConfigurationPreferences(
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

export function pushPreferences(rows: readonly Row[]) {
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

export function loginSwitches(rows: readonly Row[]): Fields {
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

export function loginConfiguration(
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

export function settingConfig(rules: Rules): Fields {
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

export function armySnapshot(row: Row, rules: Rules): Fields {
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

export function inventoryItem(row: Row, rules: Rules): Fields {
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
