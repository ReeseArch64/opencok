import { sfs, type Fields } from "@opencok/messages/sfs";
import { num, text, long, type Row } from "@opencok/contracts/rows";
import type { Rules } from "@opencok/rules/game";
import { researchDefinition } from "@opencok/rules/research";
import { researchSchema } from "@opencok/validations/research";
import { validateFields } from "./validation";

export function research(row: Row, rules: Rules, deadline = 0n): Fields {
  const itemId = text(row, "itemId"),
    level = num(row, "level"),
    rule = researchDefinition(rules, itemId, level);
  const result: Fields = {
    level: sfs.int(level),
    itemId: sfs.string(itemId),
    cd: sfs.long(deadline),
  };
  for (const key of [
    "max_lv",
    "research_need",
    "time_research",
    "building_condition",
    "science_condition",
    "reputation_condition",
    "para1",
    "para2",
    "science_point",
    "vip",
  ])
    if (rule[key] !== undefined) result[key] = sfs.string(rule[key]);
  result.nextPara2 = sfs.string(
    rules.power.sciences?.get(String(Number(itemId) + level + 1))?.para2 ?? "",
  );
  return validateFields(researchSchema, result);
}
export function researchData(rows: readonly Row[], queues: readonly Row[], rules: Rules) {
  if (rows.length > 4096 || queues.length > 256) throw new Error("Research snapshot exceeds bound");
  const records = new Map(rows.map((row) => [text(row, "itemId"), row]));
  if (records.size !== rows.length) throw new Error("Duplicate saved research");
  for (const rule of rules.power.sciences?.values() ?? [])
    if (rule.science_lv === "0" && !records.has(rule.id!))
      records.set(rule.id!, { itemId: rule.id!, level: 0 });
  if (records.size > 4096) throw new Error("Research catalog exceeds bound");
  return sfs.array(
    [...records.values()]
      .sort((a, b) => Number(a.itemId) - Number(b.itemId))
      .map((row) => {
        const pending = queues.filter(
          (queue) => num(queue, "type") === 6 && queue.itemId === row.itemId,
        );
        if (pending.length > 1) throw new Error("Duplicate pending research");
        return sfs.object(
          research(row, rules, pending.length ? long(pending[0]!, "updateTime") : 0n),
        );
      }),
  );
}
