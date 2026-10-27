import { createHash } from "node:crypto";
import { cityAmount, cityInteger } from "@opencok/rules/city-progression";
import { featureRealmEnabled, versionAtLeast } from "@opencok/rules/availability";
import { long, num, text, type Row } from "@opencok/contracts/rows";
import type { Rules } from "@opencok/rules/game";
import type { HeroCalendarState, HeroCalendarPlan } from "@opencok/hero/contracts/hero-calendar";

export function heroCalendarIdentity(
  kind: string,
  kingdom: number,
  definition: string,
  start: bigint,
) {
  return createHash("sha256")
    .update(JSON.stringify([kind, kingdom, definition, String(start)]))
    .digest("hex")
    .slice(0, 32);
}

export function heroCalendarOpen(rules: Rules, type: number, now: bigint) {
  const gate = rules.items.get("heroactivity_on"),
    keys = type === 1 ? ["k1", "k2"] : type === 2 ? ["k5", "k6"] : ["k9", "k10"];

  return (
    featureRealmEnabled(gate?.[keys[0]!], rules.kingdomId) &&
    versionAtLeast("12.06.0", gate?.[keys[1]!] ?? "") &&
    now >= 0n
  );
}

export function heroCalendarPlan(
  state: HeroCalendarState,
  rules: Rules,
  now: bigint,
): HeroCalendarPlan {
  cityAmount(now);

  if (state.activities.length > 4096 || state.events.length > 4096)
    throw new Error("Hero calendar state exceeds bound");

  const activities: Row[] = [],
    events: Row[] = [],
    day = (now / 86400000n) * 86400000n,
    weekday = new Date(Number(now)).getUTCDay() + 1;

  for (const activity of state.activities) {
    const type = cityInteger(activity.activityType, 1, 3);
    const disabled = !heroCalendarOpen(rules, type, now);

    if (num(activity, "finish") === 0 && (long(activity, "endTime") <= now || disabled)) {
      activities.push({ ...activity, finish: 1 });

      if (disabled)
        events.push(
          ...state.events
            .filter(
              (event) => event.activityId === activity.uuid && num(event, "rewardStatus") !== 1,
            )
            .map((event) => ({ ...event, rewardStatus: 1 })),
        );
    }
  }

  const definitions = [...(rules.advanced.heroActivities?.values() ?? [])];

  if (definitions.length > 32) throw new Error("Hero calendar definition bound exceeded");

  for (const rule of definitions) {
    const type = cityInteger(rule.type, 1, 3);

    if (!heroCalendarOpen(rules, type, now)) continue;

    const dates = (rule.date ?? "").split("|"),
      date = dates[weekday - 1]?.split(":");

    if (dates.length !== 7 || !date || date.length !== 2 || cityInteger(date[0], 1, 7) !== weekday)
      throw new Error("Invalid hero calendar weekday");

    const [ready, run, total, ...extra] = (rule.cycle ?? "").split("|"),
      duration = BigInt(cityInteger(total, 1, 10080)) * 60000n;
    let prepare = BigInt(cityInteger(ready, 0, 1440)) * 60000n,
      running = BigInt(cityInteger(run, 1, 10080)) * 60000n,
      round = prepare + running;

    if (
      extra.length ||
      round > duration ||
      duration % round !== 0n ||
      !rule.id ||
      rule.id.length > 100
    )
      throw new Error("Invalid hero cycle");

    const eligible = state.activities.filter(
      (row) =>
        row.activityId === rule.id &&
        num(row, "finish") === 0 &&
        long(row, "endTime") > now &&
        !activities.some((next) => next.uuid === row.uuid && num(next, "finish") === 1),
    );

    if (eligible.length > 1) throw new Error("Ambiguous hero calendar");

    let activity = eligible[0];

    if (!activity) {
      if (state.blocked || date[1] !== "1") continue;

      const id = heroCalendarIdentity("main", rules.kingdomId, rule.id, day),
        previous = state.activities.find(
          (row) =>
            row.uuid === id || (row.activityId === rule.id && long(row, "startTime") === day),
        );

      if (previous) continue;

      activity = {
        uuid: id,
        activityId: rule.id,
        activityType: type,
        startTime: day,
        roundTime: round,
        endTime: day + duration,
        finish: 0,
        alreadyEvent: "",
        serverGroup: null,
        kingdomRank: null,
      };
      activities.push(activity);
    }

    round = cityAmount(activity.roundTime);
    const saved = state.events
      .filter((event) => event.activityId === activity!.uuid && long(event, "lastTime") > 0n)
      .toSorted((a, b) =>
        long(a, "readyTime") < long(b, "readyTime")
          ? 1
          : long(a, "readyTime") > long(b, "readyTime")
            ? -1
            : 0,
      )[0];

    if (saved) running = cityAmount(saved.lastTime);

    if (round <= 0n || running > round) throw new Error("Invalid saved hero stage interval");

    prepare = round - running;
    const start = long(activity, "startTime"),
      end = long(activity, "endTime"),
      stage = (now - start) / round,
      readyTime = start + stage * round,
      startTime = readyTime + prepare,
      endTime = readyTime + round;

    if (now < start || endTime > end || endTime <= now) continue;

    const current = state.events.filter(
      (row) => row.activityId === activity!.uuid && long(row, "endTime") > now,
    );

    if (current.length) continue;

    const groups = (rule.activity ?? "")
      .split("|")
      .map((group) => group.split(";").filter(Boolean));

    if (
      !groups.length ||
      groups.length > 32 ||
      groups.some((group) => !group.length || group.length > 256)
    )
      throw new Error("Invalid hero event sequence");

    const selected =
      type === 3 ? groups.flat() : [groups.flat()[Number(stage % BigInt(groups.flat().length))]!];

    if (selected.length > 8 || new Set(selected).size !== selected.length)
      throw new Error("Invalid coupled hero stages");

    const created: string[] = [];

    for (const id of selected) {
      const definition = rules.ranking.heroEvents?.get(id),
        category = (definition?.type ?? "").split("|");

      if (!definition || category.length !== 2) throw new Error("Missing hero stage definition");

      const eventType = cityInteger(category[1], 1, 4);

      if ((type < 3 && eventType !== type) || (type === 3 && eventType < 3))
        throw new Error("Mismatched hero stage type");

      const uuid = heroCalendarIdentity(
        "event",
        rules.kingdomId,
        `${activity.uuid}:${id}`,
        readyTime,
      );

      if (state.events.some((row) => row.uuid === uuid))
        throw new Error("Conflicting ended hero stage");

      events.push({
        uuid,
        eventId: id,
        activityId: text(activity, "uuid"),
        type: eventType,
        rewardType: eventType,
        readyTime,
        startTime,
        lastTime: running,
        endTime,
        rewardStatus: 0,
        serverGroup: activity.serverGroup ?? null,
        kingdomRank: activity.kingdomRank ?? null,
      });
      created.push(id);
    }

    const history =
      type === 3
        ? ""
        : [text(activity, "alreadyEvent"), created.join(";")].filter(Boolean).join(";");

    if (history.length > 1000) throw new Error("Hero stage history exceeds bound");

    const updated = { ...activity, alreadyEvent: history };
    const position = activities.findIndex((row) => row.uuid === activity!.uuid);

    if (position < 0) activities.push(updated);
    else activities[position] = updated;
  }

  return { activities, events };
}
