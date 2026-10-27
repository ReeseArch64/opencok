import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import { cityInteger } from "./city-progression";
import type { Rule } from "./game";
export function seasonalExchangeFailure(): never {
  throw new GameError(errors.invalid, "city_progression");
}
export function seasonalExchangeRewards(raw: string) {
  if (raw.length > 1000) seasonalExchangeFailure();
  const parts = raw.split("|");
  if (parts.length !== 5) seasonalExchangeFailure();
  return parts.map((part) => {
    const values = part.split(";");
    if (values.length < 2 || values.length > 3 || !/^\d{1,40}$/.test(values[0]!))
      seasonalExchangeFailure();
    return {
      id: values[0]!,
      count: cityInteger(values[1], 1),
      color: values.length === 3 ? cityInteger(values[2]) : 0,
    };
  });
}
export function selectSeasonalRewards(config: Rule, random: (maximum: number) => number): string {
  return Array.from({ length: 5 }, (_, index) => {
    const choices = (config[`k${index + 2}`] ?? "").split("|");
    if (!choices.length || choices.length > 1024) seasonalExchangeFailure();
    const options = choices.map((choice) => {
        const fields = choice.split(";");
        if (fields.length !== 3 || !/^\d{1,40}$/.test(fields[0]!)) seasonalExchangeFailure();
        return { id: fields[0]!, count: cityInteger(fields[1], 1), weight: cityInteger(fields[2]) };
      }),
      total = cityInteger(
        options.reduce((sum, option) => sum + option.weight, 0),
        1,
      ),
      draw = cityInteger(random(total), 0, total - 1);
    let sum = 0;
    for (const option of options) {
      sum += option.weight;
      if (draw < sum) return `${option.id};${option.count}`;
    }
    return seasonalExchangeFailure();
  }).join("|");
}
