import type { ActivityOperatorsSnapshot } from "@opencok/contracts/activity-operators";
import type { ActivityOperatorResponse } from "@opencok/contracts/responses/activity-operators";
import { long, num, text, type Row } from "@opencok/contracts/rows";
import type { Rules, Rule } from "./game";
import { versionAtLeast, type RuleContext } from "./availability";
import { serverFeature } from "./power-context";
import { localEventControlOpen, eventTimestamp } from "./local-events";
import { rechargeActivityWindow } from "./recharge-activity";
import { continuedCostPeriod } from "./continued-cost";
import { targetSchedule } from "./target-task";
import { cityInteger } from "./city-progression";
import { groupBuyPeriod, groupBuyRounds } from "./groupbuy";
import { comebackActiveChannels } from "./comeback";
import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
function invalid(): never {
  throw new GameError(errors.unsupported, "activity_operators");
}
function feature(rules: Rules, key: string, context: RuleContext) {
  const version = rules.features.get(key)?.version;
  return (
    !!version && versionAtLeast(context.version, version) && serverFeature(rules, key, context)
  );
}
function ownedWindow(row: Row | undefined, now: bigint) {
  if (!row) return;
  const start = long(row, "beginTime"),
    end = long(row, "endTime");
  if (start < 0n || end < 0n || (start > 0n && end <= start)) invalid();
  if (start <= 0n || end <= start || now < start || now >= end) return;
  return { start, end };
}
function configuredWindow(rule: Rule | undefined, now: bigint) {
  const start = eventTimestamp(rule?.start),
    end = eventTimestamp(rule?.end);
  if (
    !rule ||
    rule.function_on !== "1" ||
    start === undefined ||
    end === undefined ||
    end <= start ||
    now < start ||
    now >= end
  )
    return;
  return { start, end };
}
function endTime(
  page: Rule,
  rules: Rules,
  state: ActivityOperatorsSnapshot,
  context: RuleContext,
): bigint | undefined {
  const now = BigInt(context.now),
    type = cityInteger(page.Type),
    call = page.call_activity ?? "",
    opened = long(state.server, "activityTime"),
    openingValid = opened > 0n && opened <= now;
  switch (type) {
    case 21: {
      if (!feature(rules, "comeback", context) || !state.comeback) return;
      const config = rules.advanced.comebacks?.get(text(state.comeback, "configId")),
        end = eventTimestamp(rules.power.activityPanels?.get("57083")?.end);
      if (
        !config ||
        end === undefined ||
        end <= now ||
        !comebackActiveChannels(config, state.comeback, now).length
      )
        return;
      return end;
    }
    case 22: {
      if (rules.configuration.payControl?.get("69023")?.k5 === "1" && !openingValid) return;
      const period = rechargeActivityWindow(rules, opened, context);
      return period?.active ? period.end : undefined;
    }
    case 23: {
      if (!openingValid || !localEventControlOpen(rules, "69024", context)) return;
      const rule = rules.advanced.castleLevels?.get("9011501");
      if (!rule) return;
      const windows = (rule.activity_Type ?? "").split("|").map((part) => {
        const pair = part.split(";");
        if (pair.length !== 2) invalid();
        return cityInteger(pair[1]);
      });
      if (windows.length !== 2) return;
      const days = windows.includes(0) ? 0 : Math.max(...windows),
        end = opened + BigInt(days) * 86400000n;
      return end > now ? end : undefined;
    }
    case 24:
      return localEventControlOpen(rules, "69026", context) ? 0n : undefined;
    case 26: {
      if (!openingValid || !localEventControlOpen(rules, "69027", context)) return;
      const end =
        opened + BigInt(cityInteger(rules.configuration.payControl!.get("69027")!.k6)) * 86400000n;
      return end > now ? end : undefined;
    }
    case 27: {
      if (!feature(rules, "target_quest", context)) return;
      const config = rules.items.get("target_quest");
      if (!config) return;
      const window = targetSchedule(config, now, opened);
      const saved = ownedWindow(state.target, now);
      if (saved) return saved.end;
      if (!openingValid) return;
      return window.active ? window.end : undefined;
    }
    case 36: {
      if (!feature(rules, "recall_quest", context) || !state.country) return;
      const config = [...(rules.advanced.recallActivities?.values() ?? [])].find(
        (row) => row.k10 === state.country,
      );
      if (!config) return;
      const castle = state.buildings.find((row) => num(row, "itemId") === 400000);
      if (num(castle ?? {}, "level") < cityInteger(config.k11)) return;
      const saved = ownedWindow(state.recall, now);
      if (
        saved &&
        (!text(state.recall!, "country") || text(state.recall!, "country") === state.country)
      )
        return saved.end;
      const start = eventTimestamp(config.k3),
        end = eventTimestamp(config.k4);
      return start !== undefined && end !== undefined && start < now && now < end ? end : undefined;
    }
    case 34: {
      const config = rules.items.get("alliance_groupbuys");
      if (
        !config ||
        !openingValid ||
        !feature(rules, "alliance_groupbuys", context) ||
        now - opened < BigInt(cityInteger(config.k1)) * 86400000n
      )
        return;
      const period = groupBuyPeriod(rules);
      if (!period || now < period.start || now >= period.end) return;
      const roundIndex = period.rounds.findIndex(
        (round) => now >= BigInt(round.sTime) && now < BigInt(round.eTime),
      );
      if (roundIndex < 0) return;
      const current = state.groupBuys.filter(
        (row) => long(row, "startTime") === period.start && long(row, "endTime") === period.end,
      );
      if (current.length > 1) invalid();
      if (current[0]) {
        const rounds = groupBuyRounds(current[0].roundInfo),
          round = rounds[roundIndex];
        if (!round || now < BigInt(round.sTime) || now >= BigInt(round.eTime)) return;
      }
      return period.end;
    }
    case 6:
    case 30:
    case 31:
    case 35: {
      const panel = rules.power.activityPanels?.get(call);
      if (
        !panel ||
        ![6, 30, 31, 35].includes(cityInteger(panel.type)) ||
        cityInteger(panel.battle_type ?? 0) !== 0
      )
        return;
      const period = configuredWindow(panel, now);
      if (!period) return;
      if (call === "57159" && !feature(rules, "continued_cost", context)) return;
      if (call === "57159")
        return continuedCostPeriod(rules, state.profile!, state.buildings, context.now)?.end;
      return period.end;
    }
    default:
      return;
  }
}
export function activityOperators(
  rules: Rules,
  state: ActivityOperatorsSnapshot,
  context: RuleContext,
): readonly ActivityOperatorResponse[] {
  if (
    !Number.isSafeInteger(context.now) ||
    context.now < 0 ||
    context.kingdomId !== rules.kingdomId ||
    !state.profile ||
    num(state.profile, "serverId") !== context.kingdomId ||
    num(state.profile, "banFlag") !== 0 ||
    long(state.profile, "banTime") > BigInt(context.now)
  )
    invalid();
  if (
    (state.target && state.target.uid !== state.profile.uid) ||
    (state.recall && state.recall.uid !== state.profile.uid) ||
    (state.comeback && state.comeback.uid !== state.profile.uid)
  )
    invalid();
  if (num(state.profile, "crossFightSrcServerId") > 0) return [];
  const pages = [...(rules.advanced.activityPages?.values() ?? [])];
  if (pages.length > 4096 || state.buildings.length > 256 || state.groupBuys.length > 2) invalid();
  const output: ActivityOperatorResponse[] = [];
  for (const page of pages) {
    const id = cityInteger(page.id, 1),
      end = endTime(page, rules, state, context);
    if (end !== undefined) output.push({ id, endTime: end > 0n ? end / 1000n : 0n });
  }
  if (new Set(output.map((row) => row.id)).size !== output.length) invalid();
  return output;
}
