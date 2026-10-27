import { randomInt } from "node:crypto";
import { encode, sfs, str, int, type Fields } from "@opencok/messages/sfs";
import { num, long, text, type Row } from "@opencok/contracts/rows";
import { cityInteger } from "@opencok/rules/city-progression";
import { dragonFailure, dragonFeature } from "@opencok/rules/dragon-progression";
import { temporaryEffect } from "@opencok/rules/player-effects";
import type { CityDomain } from "./city-progression";

function talentView(row: Row): Fields {
  return {
    skillid: sfs.string(text(row, "skillId")),
    actTime: sfs.long(long(row, "actTime")),
    endTime: sfs.long(long(row, "endTime")),
    stat: sfs.int(num(row, "stat")),
    level: sfs.int(num(row, "level")),
    exp: sfs.int(num(row, "exp")),
  };
}
export const dragonTalentsDomain: CityDomain = {
  commands: ["dragonskill"],
  types: [],
  async prepare(context, _command, params) {
    if (!dragonFeature(context.rules, "dragon_talentskill", context.now)) dragonFailure();
    const action = str(params, "M__REQUEST_ID__H"),
      rows = context.state.dragons?.talents ?? [];
    if (action === "openUi")
      return {
        response: encode({
          dragonTalentSkill: sfs.array(rows.map((row) => sfs.object(talentView(row)))),
        }),
        event: null,
      };
    const dragonId = cityInteger(str(params, "id"), 1),
      skillId = str(params, "skillId"),
      dragon = context.state.dragons?.dragons.find((row) => num(row, "itemId") === dragonId),
      rule = context.rules.power.dragonSkills?.get(skillId);
    if (!dragon || num(dragon, "dragonState") !== 3 || !rule || Number(rule.type) < 10)
      dragonFailure();
    const saved = rows.find((row) => num(row, "dragonId") === dragonId && row.skillId === skillId);
    const row: Row = saved
      ? { ...saved }
      : {
          uid: context.owner,
          dragonId,
          skillId,
          startTime: 0n,
          actTime: 0n,
          endTime: 9223372036854775807n,
          stat: 0,
          level: 1,
          exp: 0,
          totalExp: 0,
        };
    if (action === "unlock") {
      if (saved || num(dragon, "lv") < cityInteger(rule.talentskill_level_condition ?? 0))
        dragonFailure();
      const base = context.rules.power.dragonBases?.get(String(dragonId));
      const allowed = (base?.talentskill_init ?? "").split("|");
      if (!allowed.includes(skillId) && rule.born_dragon !== String(dragonId)) dragonFailure();
      for (const pair of (rule.talentskill_item_condition ?? "").split("|").filter(Boolean)) {
        const [id, count] = pair.split(";");
        if (!id) dragonFailure();
        context.spendItem(id, cityInteger(count));
      }
    } else if (action === "eatitem") {
      if (!saved || num(row, "level") >= cityInteger(rule.maxLv)) dragonFailure();
      const item = str(params, "itemId"),
        count = cityInteger(int(params, "num"), 1, 32767),
        entry = (context.rules.items.get("dragon")?.k3 ?? "")
          .split("|")
          .map((pair) => pair.split(";"))
          .find((pair) => pair[0] === String(dragonId) && pair[1] === item);
      if (!entry) dragonFailure();
      context.spendItem(item, count);
      const gain = cityInteger(cityInteger(entry[2]) * count);
      row.exp = cityInteger(num(row, "exp") + gain);
      row.totalExp = cityInteger(num(row, "totalExp") + gain);
      for (let guard = 0; guard < 1000; guard++) {
        const threshold = [...(context.rules.advanced.dragonSkillExp?.values() ?? [])].find(
          (entry) => entry.quality === rule.quality && Number(entry.level) === num(row, "level"),
        );
        const required = cityInteger(threshold?.exp, 1);
        if (num(row, "exp") < required) break;
        if (num(row, "level") >= cityInteger(rule.maxLv)) {
          row.exp = required - 1;
          break;
        }
        row.exp = num(row, "exp") - required;
        row.level = num(row, "level") + 1;
      }
    } else if (action === "use") {
      if (
        !saved ||
        (long(row, "endTime") !== 9223372036854775807n && long(row, "endTime") > context.now)
      )
        dragonFailure();
      const type = cityInteger(rule.type, 10, 12);
      if (type === 11) dragonFailure();
      if (type === 10) {
        const status = temporaryEffect(
          context.state.effects.states,
          context.rules,
          context.owner,
          rule.base!,
          context.now,
          1,
          randomInt,
        );
        context.write.states = status.states;
        context.write.deletedStates = status.deleted;
      }
      row.startTime = context.now;
      row.actTime = context.now + BigInt(cityInteger(rule.continued_time)) * 60000n;
      row.endTime = context.now + BigInt(cityInteger(rule.cd_times)) * 60000n;
      row.stat = 2;
    } else dragonFailure();
    (context.write.dragons ??= {}).talents = [row];
    return {
      response: encode(
        action === "eatitem"
          ? { level: sfs.int(num(row, "level")), exp: sfs.int(num(row, "exp")) }
          : { skillInfo: sfs.object(talentView(row)) },
      ),
    };
  },
  async apply() {
    dragonFailure();
  },
};
