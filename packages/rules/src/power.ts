import { calculateGeneralPower, calculateHeroPower } from "@opencok/hero/rules/hero-power";
import { sumInt } from "@opencok/rules/player-power-values";
import { record } from "@opencok/rules/player-power-values";
import { integer } from "@opencok/rules/player-power-values";
import { i64 } from "@opencok/rules/player-power-values";
import { i32 } from "@opencok/rules/player-power-values";
import type { PlayerPower, PowerContext, PowerSnapshot } from "@opencok/contracts/power";

import { long, num, text, type Row } from "@opencok/contracts/rows";
import { errors } from "@opencok/constants/game";
import { GameError } from "@opencok/errors/game";
import type { Rule, Rules } from "./game.ts";

function decimal(value: unknown): number {
  const source = String(value ?? "0").trim();

  if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/.test(source))
    throw new GameError(errors.unsupported, "power_rule");

  const result = Number(source);

  if (!Number.isFinite(result)) throw new GameError(errors.unsupported, "power_rule");

  return result;
}

function numberToLong(value: number): bigint {
  if (Number.isNaN(value)) return 0n;

  if (value >= 9223372036854775808) return 9223372036854775807n;

  if (value <= -9223372036854775808) return -9223372036854775808n;

  return BigInt(Math.trunc(value));
}

function unitPower(rows: readonly Row[], rules: Rules, army: boolean): bigint {
  let total = 0;

  for (const row of rows) {
    const count = army
      ? i32(["free", "pve", "defence", "march"].reduce((sum, key) => sum + integer(row[key]), 0n))
      : Number(integer(row.num));
    const power = decimal(record(rules.arms, text(row, "armyId")).power);
    total += power * count;
  }

  return numberToLong(total);
}

function researchPower(
  rows: readonly Row[],
  catalog: Map<string, Rule> | undefined,
  key: string,
  offset = 0n,
): number {
  return sumInt(rows, (row) => {
    const id = String(i32(integer(row[key]) + integer(row.level) + offset));

    return integer(record(catalog, id).power);
  });
}

function titlePower(state: PowerSnapshot, rules: Rules, context: PowerContext): number {
  const title = state.knight;

  if (!title) return 0;

  const contract = Number(integer(title.contract_activity_title, -1n));
  let active = -1;

  if (
    contract !== -1 &&
    (context.contractTitleExpiries.get(String(contract)) ?? 0n) > BigInt(context.now)
  )
    active = contract;

  if (active === -1) {
    active = Number(integer(title.activity_title, -1n));

    if (active === -1) return 0;

    const rule = record(rules.power.titles, String(active));

    if (rule.type !== "2") {
      if (rule.activate_array === undefined) throw new GameError(errors.unsupported, "power_rule");

      const requirements = rule.activate_array.split(";");
      const available = requirements.every((id) =>
        state.items.some(
          (item) =>
            text(item, "itemId") === id &&
            integer(item.count) > 0n &&
            (long(item, "vanishTime") === 0n || long(item, "vanishTime") > BigInt(context.now)),
        ),
      );

      if (!available) return 0;
    }
  }

  const power = record(rules.power.titles, String(active)).power;

  return power?.trim() ? Math.max(0, Number(integer(power))) : 0;
}

function dragonPower(state: PowerSnapshot, rules: Rules, context: PowerContext): bigint {
  if (!context.dragonLevelUp) return 0n;

  const dragons = state.dragons.filter((row) => integer(row.dragonState) === 3n);

  if (!dragons.length) return 0n;

  if (context.dragonScience && !Number.isFinite(context.dragonAttackPercent))
    throw new GameError(errors.unsupported, "power_effect");

  const global = record(rules.items, "dragon_new");

  for (const key of ["k10", "k11", "k12"])
    if (global[key] === undefined) throw new GameError(errors.unsupported, "power_rule");

  const divisor = Math.fround(decimal(global.k10));
  const exponent = Math.fround(decimal(global.k11));
  const multiplier = Math.fround(decimal(global.k12));
  let total = 0n;

  for (const row of dragons) {
    const base = record(rules.power.dragonBases, text(row, "itemId"));

    if (base.initFight === undefined) throw new GameError(errors.unsupported, "power_rule");

    const levels = [...(rules.power.dragonLevels?.values() ?? [])].filter(
      (rule) =>
        integer(rule.base_id) === integer(row.itemId) && integer(rule.level) === integer(row.lv),
    );

    if (levels.length !== 1) throw new GameError(errors.unsupported, "power_rule");

    if (levels[0]!.attack === undefined) throw new GameError(errors.unsupported, "power_rule");

    let attack = Math.fround(decimal(levels[0]!.attack));

    if (context.dragonScience) {
      const percent = Math.fround(context.dragonAttackPercent!);
      const bonus = Math.max(Math.fround(percent / 100), 0);
      attack = Math.fround(attack * Math.fround(1 + bonus));
    }

    const power =
      Math.pow(Math.fround(attack / divisor), exponent) * multiplier +
      Number(integer(base.initFight));
    total = i64(total + numberToLong(power));
  }

  return total > 0n ? total : 0n;
}

export function calculatePlayerPower(
  state: PowerSnapshot,
  rules: Rules,
  context: PowerContext,
): PlayerPower {
  const playerPower = Number(
    integer(record(rules.roles, String(i32(100100n + integer(state.profile.level)))).power),
  );
  const heroPower = calculateGeneralPower(state.generals, rules);
  const armyPower = unitPower(state.armies, rules, true);
  const fortPower = unitPower(state.walls, rules, false);
  const buildingPower = sumInt(state.buildings, (row) =>
    integer(
      rules.building(text(row, "itemId"), num(row, "level"), num(row, "star"), num(row, "progress"))
        .power,
    ),
  );
  const sciencePower = researchPower(state.sciences, rules.power.sciences, "itemId");
  const civilizationSciencePower = sumInt(state.civilizationSciences, (row) => {
    const id = String(i32(integer(row.baseItemID) + integer(row.level)));
    const rule = rules.power.civilizationSciences?.get(id);

    return rule ? integer(rule.power) : 0n;
  });
  const sagatower_science = researchPower(
    state.sagaSciences,
    rules.power.sagaSciences,
    "itemid",
    100000n,
  );
  const equipPower = Math.max(
    0,
    sumInt(
      state.equipment.filter((row) => integer(row.on) === 1n),
      (row) => {
        const raw = record(rules.power.equipment, text(row, "itemId")).power;

        return raw?.trim() ? integer(raw) : 0n;
      },
    ),
  );
  const knight_title = titlePower(state, rules, context);
  const petDragonPower = dragonPower(state, rules, context);
  const prinessPower = calculateHeroPower(state.heroes, rules);
  const questpower = Number(integer(state.statistics?.questPower));
  const total = i64(
    BigInt(i32(BigInt(questpower) + BigInt(playerPower) + BigInt(heroPower))) +
      armyPower +
      BigInt(buildingPower) +
      BigInt(civilizationSciencePower) +
      BigInt(sciencePower) +
      fortPower +
      BigInt(equipPower) +
      BigInt(knight_title) +
      petDragonPower +
      BigInt(sagatower_science) +
      prinessPower,
  );

  return {
    playerPower,
    heroPower,
    armyPower,
    buildingPower,
    sciencePower,
    civilizationSciencePower,
    fortPower,
    questpower,
    equipPower,
    knight_title,
    petDragonPower,
    sagatower_science,
    prinessPower,
    total,
  };
}
