import { featureRealmEnabled, versionAtLeast } from "./availability";
import { cityInteger } from "./city-progression";
import { heroHistoryBand } from "./hero-ranking";
import { text, type Row } from "@opencok/contracts/rows";
import type { Rules } from "./game";
import type { HeroEventSnapshot } from "@opencok/contracts/hero-event";
export function heroEventBand(event: Row, snapshot: HeroEventSnapshot, rules: Rules) {
  const type = cityInteger(event.type, 1, 4),
    alliance = type === 2 || type === 4,
    member = alliance
      ? text(snapshot.profile ?? {}, "allianceId")
      : text(snapshot.profile ?? {}, "uid"),
    score = snapshot.scores.find((row) => row.actId === event.uuid && row.uid === member);
  if (!member) return { level: -1, score };
  const level = score
    ? cityInteger(score.level, 0, 4095)
    : alliance
      ? heroHistoryBand(type, snapshot.castleLevel, snapshot.alliancePower, rules)
      : snapshot.castleLevel > 0
        ? Math.min(29, snapshot.castleLevel - 1)
        : -1;
  return { level, score };
}
export function heroEventRewards(event: Row, level: number, rules: Rules) {
  const rule = rules.ranking.heroEvents?.get(text(event, "eventId"));
  if (!rule) throw new Error("Missing hero event definition");
  const matrix = (key: string) => (rule[key] ?? "").split("|").map((row) => row.split(";"));
  const targets = matrix("target"),
    rewards = matrix("reward"),
    ranks = matrix("rankreward"),
    values = (rule.value ?? "").split("|"),
    rankLevels = (rule.ranklist ?? "").split("|");
  if (
    [targets, rewards, ranks].some((rows) => rows.length > 4096) ||
    rankLevels.length > 128 ||
    values.length > 4096 ||
    !targets[level] ||
    !rewards[level] ||
    !ranks[level] ||
    !values.length ||
    targets[level]!.length !== rewards[level]!.length ||
    rankLevels.length !== ranks[level]!.length
  )
    throw new Error("Invalid hero reward band");
  return {
    rule,
    targets: targets[level]!.map((value) => cityInteger(value)),
    rewards: rewards[level]!,
    ranking: ranks[level]!,
    rankLevels: rankLevels.map((value) => cityInteger(value, 1)),
    value: values[Math.min(level, values.length - 1)]!.replaceAll(";", "|"),
  };
}
export function heroScoreFlags(score: Row) {
  const flags = [
    ...new Set(
      text(score, "rewardFlag")
        .split(",")
        .filter((value) => value !== "" && value !== "-1")
        .map((value) => cityInteger(value, 0, 127)),
    ),
  ];
  if (flags.length > 128) throw new Error("Invalid hero reward flags");
  let capacity = 16;
  while (flags.length > capacity * 0.75) capacity *= 2;
  return flags
    .toSorted((a, b) => ((a ^ (a >>> 16)) & (capacity - 1)) - ((b ^ (b >>> 16)) & (capacity - 1)))
    .join(",");
}

export function nextHeroPanel(rules: Rules, type: number, realm: number, now: bigint) {
  const gate = rules.items.get("heroactivity_on"),
    keys = type === 1 ? ["k1", "k2"] : type === 2 ? ["k5", "k6"] : ["k9", "k10"];
  if (
    !featureRealmEnabled(gate?.[keys[0]!], realm) ||
    !versionAtLeast("12.06.0", gate?.[keys[1]!] ?? "")
  )
    return;
  for (const rule of rules.advanced.heroActivities?.values() ?? []) {
    if (cityInteger(rule.type, 1, 3) !== type) continue;
    const dates = (rule.date ?? "").split("|");
    if (dates.length !== 7) throw new Error("Invalid hero weekday calendar");
    let start = (now / 86400000n) * 86400000n,
      day = new Date(Number(now)).getUTCDay() + 1;
    for (let i = 0; i < 7; i++) {
      const [weekday, on, ...extra] = dates[day - 1]!.split(":");
      if (extra.length) throw new Error("Invalid hero weekday");
      if (cityInteger(weekday, 1, 7) === day && on === "1")
        return { activityId: rule.id!, startTime: start };
      start += 86400000n;
      day = day === 7 ? 1 : day + 1;
    }
  }
}
