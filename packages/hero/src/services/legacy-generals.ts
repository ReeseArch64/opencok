import { randomInt, randomUUID } from "node:crypto";
import { sfs, str, int, type Fields } from "@opencok/messages/sfs";
import { num, text, long, type Row } from "@opencok/contracts/rows";
import { cityInteger, cityAmount } from "@opencok/rules/city-progression";
import { generalFailure } from "@opencok/hero/rules/general-progression";
import { chooseWeight } from "@opencok/rules/equipment";
import { ownGeneralSnapshots } from "@opencok/hero/rules/profile-generals";
import { generalInfo } from "@opencok/hero/mappings/profile-generals";
import { decodeGeneralAbilities } from "@opencok/hero/services/profile-generals";
import type { CityProgressionContext } from "@opencok/services/city-progression-context";

export function recruitLegacyGeneral(context: CityProgressionContext, id: string) {
  const rule = context.rules.power.generals?.get(id),
    level = num(context.state.profile, "level");

  if (
    !rule ||
    context.state.effects.generals.some((row) => row.generalId === id) ||
    context.state.effects.generals.length >= 256
  )
    generalFailure();

  const row: Row = {
    uid: context.owner,
    uuid: randomUUID(),
    generalId: id,
    level,
    color: cityInteger(rule.color, 0, 5),
    status: context.state.effects.generals.filter((row) => row.status === 1).length < 3 ? 1 : 0,
    exp: 0,
    time: context.now,
    ability: null,
    abilityIndex: 1,
    plusSkillPoint: 0,
  };
  const write = (context.write.generalRoster ??= {});
  write.legacy = [...(write.legacy ?? []), row];
  context.power(cityAmount(rule.power ?? 0) * BigInt(level));
  const [view] = ownGeneralSnapshots(
    [row],
    context.state.skills,
    new Map([[String(row.uuid), decodeGeneralAbilities(row.ability)]]),
    context.owner,
    context.rules,
    Number(context.now),
  );

  return generalInfo(view!);
}

export function legacyGeneralCommand(
  context: CityProgressionContext,
  command: string,
  params: Fields,
): Fields {
  const generals = context.state.effects.generals,
    write = (context.write.generalRoster ??= {});

  if (command === "general.pick") {
    const pos = cityInteger(int(params, "pos"), 1, 6),
      saved = context.state.generalRoster?.tavern;

    if (!saved || text(saved, `generalId${pos}`)) generalFailure();

    const picks = [1, 2, 3, 4, 5, 6].filter((i) => text(saved, `generalId${i}`)).length;

    if (picks >= cityInteger(context.rules.items.get("tavern_base")?.k1, 1, 6)) generalFailure();

    const rule = context.rules.general.recruits?.get(String(41002 + picks));

    if (!rule) generalFailure();

    const ids = text(saved, "generals").split(",").filter(Boolean);

    if (!ids.length || ids.length > 256 || new Set(ids).size !== ids.length) generalFailure();

    let candidates = ids;
    const selectedColors = new Set(
      [1, 2, 3, 4, 5, 6].map(
        (i) => context.rules.power.generals?.get(text(saved, `generalId${i}`))?.color,
      ),
    );
    const safety =
      num(saved, "resetResult") === 2
        ? rule.safety1
        : num(saved, "resetResult") === 1 &&
            Number(rule.safety2?.split(";")[0]) === num(saved, "payTimes")
          ? rule.safety2?.split(";")[1]
          : undefined;

    if (safety !== undefined && !selectedColors.has(safety))
      candidates = ids.filter((id) => context.rules.power.generals?.get(id)?.color === safety);

    if (!candidates.length) generalFailure();

    const colors = ["white", "green", "blue", "violet"].map((key) => cityInteger(rule[key] ?? 0));
    const byColor = [0, 1, 2, 3].map((color) =>
      candidates.filter((id) => context.rules.power.generals?.get(id)?.color === String(color)),
    );

    for (let color = 3; color > 0; color--)
      if (!byColor[color]!.length) {
        colors[color - 1]! += colors[color]!;
        colors[color] = 0;
      }

    for (let color = 0; color < 3; color++)
      if (!byColor[color]!.length) {
        colors[color + 1]! += colors[color]!;
        colors[color] = 0;
      }

    const color = chooseWeight(colors, randomInt),
      choices = byColor[color]!;
    const id =
      safety !== undefined && !selectedColors.has(safety)
        ? candidates.at(-1)!
        : choices[randomInt(choices.length)]!;

    if (picks > 0) context.economy.gold(-cityAmount(rule.cost));

    write.tavern = {
      ...saved,
      [`generalId${pos}`]: id,
      generals: ids.filter((other) => other !== id).join(","),
    };

    return {
      general: sfs.string(id),
      times: sfs.int(num(saved, "free")),
      addFreeTime: sfs.long(long(saved, "addFreeTime")),
      gold: sfs.long(context.balance("gold")),
    };
  }

  if (command === "general.recruit") {
    const pos = cityInteger(int(params, "pos"), 1, 6),
      saved = context.state.generalRoster?.tavern,
      id = saved && text(saved, `generalId${pos}`);

    if (!saved || !id || num(saved, `recruit${pos}`) !== 0) generalFailure();

    const view = recruitLegacyGeneral(context, id);
    write.tavern = { ...saved, [`recruit${pos}`]: 1 };

    return view;
  }

  const source = generals.find(
    (row) => row.uuid === str(params, command === "general.fire" ? "uuid" : "src"),
  );

  if (!source || num(source, "status") === 2) generalFailure();

  if (command === "general.fire") {
    if (generals.length <= 1) generalFailure();

    write.deletedLegacy = [text(source, "uuid")];
    context.power(
      -cityAmount(context.rules.power.generals?.get(text(source, "generalId"))?.power ?? 0) *
        BigInt(num(source, "level")),
    );
    const replacement = generals
      .filter((row) => row !== source && num(row, "status") === 0)
      .sort((a, b) =>
        Number(
          cityAmount(context.rules.power.generals?.get(text(b, "generalId"))?.power ?? 0) *
            BigInt(num(b, "level")) -
            cityAmount(context.rules.power.generals?.get(text(a, "generalId"))?.power ?? 0) *
              BigInt(num(a, "level")),
        ),
      )[0];

    if (replacement && num(source, "status") === 1) write.legacy = [{ ...replacement, status: 1 }];
  } else if (command === "general.def.ch") {
    if (num(source, "status") !== 0) generalFailure();

    const destination = str(params, "dst", "");

    if (destination) {
      const previous = generals.find((row) => row.uuid === destination && row.status === 1);

      if (!previous || previous === source) generalFailure();

      write.legacy = [
        { ...source, status: 1 },
        { ...previous, status: 0 },
      ];
    } else {
      if (generals.filter((row) => row.status === 1).length >= 3) generalFailure();

      write.legacy = [{ ...source, status: 1 }];
    }
  } else generalFailure();

  return {};
}

export function rewardLegacyGenerals(
  context: CityProgressionContext,
  id: string,
  count: number,
): Fields[] {
  const pending = context.write.generalRoster?.legacy ?? [],
    owned = [...context.state.effects.generals, ...pending];

  if (owned.some((row) => text(row, "generalId") === id)) return [];

  const rule = context.rules.power.generals?.get(id);
  cityInteger(count, 1, 256);

  if (!rule || owned.length + count > 256) generalFailure();

  const rows: Row[] = [],
    views: Fields[] = [];
  let defense = owned.filter((row) => num(row, "status") === 1).length;

  for (let index = 0; index < count; index++) {
    const row: Row = {
      uid: context.owner,
      uuid: randomUUID(),
      generalId: id,
      level: 1,
      color: cityInteger(rule.color, 0, 5),
      status: defense++ < 3 ? 1 : 0,
      exp: 0,
      time: context.now,
      ability: null,
      abilityIndex: 1,
      plusSkillPoint: 0,
    };
    rows.push(row);
    const [view] = ownGeneralSnapshots(
      [row],
      context.state.skills,
      new Map([[String(row.uuid), decodeGeneralAbilities(row.ability)]]),
      context.owner,
      context.rules,
      Number(context.now),
    );
    views.push(generalInfo(view!));
  }

  const write = (context.write.generalRoster ??= {});
  write.legacy = [...pending, ...rows];
  context.power(cityAmount(rule.power ?? 0) * BigInt(count));

  return views;
}
