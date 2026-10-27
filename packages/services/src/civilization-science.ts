import { serverFeature } from "@opencok/rules/power-context";
import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import { sfs, str, int, encode } from "@opencok/messages/sfs";
import { num, long } from "@opencok/contracts/rows";
import {
  civilizationScience,
  civilizationScienceRequirements,
} from "@opencok/rules/civilization-science";
import { civilizationScienceView } from "@opencok/mappings/civilization-science";
import { researchCosts } from "@opencok/rules/research";
import { cityInteger, cityAmount, progressionActivityData } from "@opencok/rules/city-progression";
import type { CityDomain, CityProgressionContext } from "./city-progression";

function current(context: CityProgressionContext, base: number) {
  return (
    (context.state.civilizationSciences ?? []).find((row) => num(row, "baseItemID") === base) ?? {
      userID: context.owner,
      baseItemID: base,
      level: 0,
    }
  );
}

function complete(context: CityProgressionContext, base: number, expected?: number) {
  const row = current(context, base),
    level = num(row, "level");

  if (expected !== undefined && expected !== level + 1)
    throw new GameError(errors.queue, "city_progression");

  const before = civilizationScience(context.rules, base, level),
    after = civilizationScience(context.rules, base, level + 1);
  context.write.civilizationSciences = [{ ...row, level: level + 1 }];
  const delta = cityAmount(after.power ?? 0) - cityAmount(before.power ?? 0);
  context.power(delta);
  const power =
    (context.state.civilizationSciences ?? []).reduce(
      (sum, entry) =>
        sum +
        cityAmount(
          civilizationScience(context.rules, num(entry, "baseItemID"), num(entry, "level")).power ??
            0,
        ),
      0n,
    ) + delta;

  return {
    ...civilizationScienceView(context.rules, base, level + 1),
    sciencePower: sfs.int(cityInteger(power)),
  };
}

export const civilizationScienceDomain: CityDomain = {
  commands: ["civilization.science.data.init", "race.science.research", "race.science.directly"],
  types: [19],
  async prepare(context, command, params) {
    if (command === "civilization.science.data.init") {
      const bases = [...(context.rules.power.civilizationSciences?.keys() ?? [])]
        .map(Number)
        .filter((base) => !context.rules.power.civilizationSciences?.has(String(base - 1)))
        .sort((a, b) => a - b);

      return {
        event: null,
        response: encode({
          civilization_science: sfs.array(
            bases.flatMap((base) => {
              const level = num(current(context, base), "level");

              if (!context.rules.power.civilizationSciences?.has(String(base + level))) return [];

              const pending = context.state.queues.filter(
                (row) => num(row, "type") === 19 && row.itemId === String(base),
              );

              if (pending.length > 1) throw new GameError(errors.queue, "city_progression");

              return [
                sfs.object(
                  civilizationScienceView(
                    context.rules,
                    base,
                    level,
                    pending.length ? long(pending[0]!, "updateTime") : 0n,
                  ),
                ),
              ];
            }),
          ),
        }),
      };
    }

    if (
      !serverFeature(context.rules, "science_race_switch", {
        kingdomId: context.rules.kingdomId,
        version: "12.06.0",
        now: Number(context.now),
      })
    )
      throw new GameError(errors.unsupported, "city_progression");

    const base = cityInteger(str(params, "itemId"), 1),
      row = current(context, base),
      level = num(row, "level");
    const rule = civilizationScience(context.rules, base, level);
    const next = civilizationScience(context.rules, base, level + 1);

    if (context.state.queues.some((q) => num(q, "type") === 19 && q.itemId === String(base)))
      throw new GameError(errors.occupied, "city_progression");

    civilizationScienceRequirements(context.state, context.rules, rule);
    const payment = cityInteger(int(params, "gold", 0), 0, 1),
      direct = command === "race.science.directly";
    const durationMs = cityAmount(rule.time_research ?? 0) * 1000n;
    context.checkPower(cityAmount(next.power ?? 0) - cityAmount(rule.power ?? 0));
    context.spend(
      researchCosts(rule, () => 0),
      direct || payment === 1,
    );

    for (const pair of rule.science_point?.split("|").filter(Boolean) ?? []) {
      const [id, count, ...extra] = pair.split(";");

      if (!id || extra.length) throw new GameError(errors.invalid, "city_progression");

      context.spendItem(id, cityInteger(count));
    }

    const data = context.data("civilization", {
      target: { level: level + 1, star: 0, progress: 0 },
    });
    const costs = () => ({
      costItem: sfs.array(
        Object.keys(context.items).map((id) =>
          sfs.object({
            itemId: sfs.string(id),
            count: sfs.int(context.economy.quantity?.(id) ?? 0),
          }),
        ),
      ),
      resource: sfs.object(context.resource()),
      gold: sfs.long(context.balance("gold")),
    });

    if (direct) {
      context.accelerate(durationMs);

      return { response: encode({ ...complete(context, base, level + 1), ...costs() }) };
    }

    context.write.civilizationSciences = [row];

    return {
      type: 19,
      itemId: String(base),
      durationMs,
      ready: durationMs === 0n,
      data,
      responseKind: "nested",
      item: encode({ itemId: sfs.string(String(base)) }),
      response: encode(costs()),
    };
  },
  async apply(context, action, activity) {
    const base = cityInteger(activity.itemId, 1),
      row = current(context, base),
      data = progressionActivityData(activity.data);
    const pending = context.state.queues.filter(
      (q) => num(q, "type") === 19 && q.itemId === activity.itemId,
    );

    if (
      pending.length !== 1 ||
      pending[0]!.uuid !== activity.queueId ||
      (data && data.kind !== "civilization") ||
      action === "start"
    )
      throw new GameError(errors.queue, "city_progression");

    civilizationScience(context.rules, base, num(row, "level") + 1);

    if (action === "cancel") {
      context.refund(data);

      return { resource: sfs.object(context.resource()) };
    }

    if (action === "restore" || action === "reschedule")
      return civilizationScienceView(context.rules, base, num(row, "level"), activity.dueAt);

    return complete(context, base, data?.target?.level);
  },
};
