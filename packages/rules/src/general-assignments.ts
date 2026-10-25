import type { Rules, Rule } from "./game";
import type { Row } from "@opencok/contracts/rows";
import { num, text, long } from "@opencok/contracts/rows";
import { cityInteger } from "./city-progression";
import { generalBase, generalFailure } from "./general-progression";
import { ruleAvailable } from "./availability";
export interface GeneralOfficeContext {
  castle: number;
  player: number;
  prestige: number;
}
function condition(type: number, value: number, context: GeneralOfficeContext) {
  if (type === 0) return true;
  const actual =
    type === 1
      ? context.castle
      : type === 2
        ? context.prestige
        : type === 3
          ? context.player
          : undefined;
  return actual !== undefined && actual >= value;
}
export function generalOfficeUnlocked(
  rules: Rules,
  id: string,
  position: number,
  context: GeneralOfficeContext,
): Rule {
  const rule = rules.power.newGeneralOffices?.get(id);
  if (!rule || context.castle < cityInteger(rules.items.get("general_official")?.k1, 1))
    generalFailure();
  for (const entry of (rule.unlock ?? "").split("|").filter(Boolean)) {
    const values = entry.split(";");
    if (
      values.length !== 2 ||
      !condition(cityInteger(values[0], 0, 3), cityInteger(values[1]), context)
    )
      generalFailure();
  }
  const positions = (rule.pos_unlock ?? "").split("|").map((entry) => entry.split(";").map(Number));
  if (
    !positions.some(
      (entry) =>
        entry.length === 3 && entry[0] === position && condition(entry[1]!, entry[2]!, context),
    )
  )
    generalFailure();
  return rule;
}
export function generalGarrison(rules: Rules, general: Row, building: Row, now: bigint) {
  if (
    num(general, "state") !== 1 ||
    num(building, "level") < 1 ||
    num(building, "opType") !== 0 ||
    generalBase(rules, num(general, "id")).garrison !== "1"
  )
    generalFailure();
  const station = [...(rules.general.stations?.values() ?? [])].find(
    (rule) => rule.build === String(building.itemId),
  );
  if (
    !station ||
    station.station !== "1" ||
    !ruleAvailable(
      { ...station, online: station.function_online!, test: station.function_test! },
      { kingdomId: rules.kingdomId, version: "12.06.0", now: Number(now) },
    )
  )
    generalFailure();
  return { ...general, state: 2, buildingUuid: text(building, "uuid") };
}
export function generalMarch(rules: Rules, row: Row) {
  if (num(row, "state") !== 1 || generalBase(rules, num(row, "id")).battle !== "1")
    generalFailure();
  return { ...row, state: 3, buildingUuid: "" };
}
export function generalMarchReturn(row: Row) {
  if (num(row, "state") !== 3) generalFailure();
  return { ...row, state: 1 };
}
export function generalOfficeExperience(office: Row, rule: Rule, now: bigint) {
  const start = long(office, "lastRefreshExpTime"),
    rate = (rule.pos_exp ?? "")
      .split("|")
      .map((entry) => entry.split(";"))
      .find(([position]) => Number(position) === num(office, "position"))?.[1];
  if (start < long(office, "startTime") || now < start || !rate) generalFailure();
  const perHour = BigInt(cityInteger(rate, 1)),
    amount = ((now - start) * perHour) / 3600000n;
  if (!amount) return { amount: 0, at: start };
  const at = start + (amount * 3600000n + perHour - 1n) / perHour;
  return { amount: Number(amount > 2147483647n ? 2147483647n : amount), at };
}
