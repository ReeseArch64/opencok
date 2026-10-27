import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import { cityInteger } from "./city-progression";
import { eventTimestamp } from "./local-events";
import type { Rule, Rules } from "./game";
import { long, type Row } from "@opencok/contracts/rows";

export function regionalRecallFailure(): never {
  throw new GameError(errors.invalid, "city_progression");
}

export function regionalRecallRule(rules: Rules, country: string) {
  if (!country) {return;}

  return [...(rules.advanced.regionalRecalls?.values() ?? [])].find((rule) => rule.k10 === country);
}

export function regionalRecallBand(rule: Rule, level: number) {
  return (rule.k6 ?? "").split("|").findIndex((pair) => {
    const [minimum, maximum] = pair.split(";").map((value) => cityInteger(value));

    return level >= minimum! && level <= maximum!;
  });
}

export function regionalRecallEligible(rule: Rule, profile: Row, level: number, now: bigint) {
  const registered = eventTimestamp(rule.k1),
    start = eventTimestamp(rule.k3),
    end = eventTimestamp(rule.k4);

  if (registered === undefined || start === undefined || end === undefined || end < start)
    {regionalRecallFailure();}

  return (
    level >= cityInteger(rule.k11) &&
    long(profile, "regTime") <= registered &&
    long(profile, "offLineTime") < start &&
    now - long(profile, "offLineTime") >= BigInt(cityInteger(rule.k2)) * 86400000n &&
    now >= start &&
    now <= end
  );
}

export function regionalRecallRewards(rule: Rule, ladder: number) {
  const rewards = rule.k7?.split("|")[cityInteger(ladder)]?.split(";");

  if (!rewards?.length || rewards.length > 32 || rewards.some((id) => !id)) {regionalRecallFailure();}

  return rewards;
}
