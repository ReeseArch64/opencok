import type {
  WorldMonsterHealth,
  WorldExplorationDetail,
} from "@opencok/contracts/world-monster-detail";
import type { Row } from "@opencok/contracts/rows";
import { errors } from "@opencok/constants/game";
import { GameError } from "@opencok/errors/game";
import type { Rules } from "./game.ts";
import { javaDecimal } from "./java-integer.ts";
import { mailBlank } from "./mail.ts";

function invalid(): never {
  throw new GameError(errors.unsupported, "world_monster_detail");
}
function integer(value: unknown): number {
  if (
    typeof value !== "number" ||
    !Number.isInteger(value) ||
    value < -2147483648 ||
    value > 2147483647
  )
    return invalid();
  return value;
}
function long(value: unknown): bigint {
  if (typeof value !== "bigint" || BigInt.asIntN(64, value) !== value) return invalid();
  return value;
}
function text(value: unknown, limit: number): string {
  if (
    typeof value !== "string" ||
    value.length > limit ||
    !value.isWellFormed() ||
    value.includes("\0")
  )
    return invalid();
  return value;
}
function decimal(value: unknown): number {
  try {
    return Number(javaDecimal(value, 32));
  } catch {
    return invalid();
  }
}
export function worldMonsterMaximum(pointType: number, item: string | null, rules: Rules): number {
  integer(pointType);
  if (pointType !== 9 && pointType !== 15) return 0;
  if (item !== null) text(item, 255);
  if (mailBlank(item)) return 0;
  const monster = rules.world.fieldMonsters?.get(item!);
  if (!monster) return invalid();
  if (monster.NPC === "1") return decimal(monster.Gift);
  if (mailBlank(monster.army)) return 0;
  let total = 0;
  for (const id of monster.army!.split(";").filter(Boolean)) {
    const army = rules.world.armies?.get(id);
    if (!army) return invalid();
    for (const group of (army.arm ?? "").split("|").filter(Boolean)) {
      const parts = group.split(";").filter(Boolean);
      if (parts.length === 2) total = (total + decimal(parts[1])) | 0;
    }
  }
  return total;
}
export function worldMonsterHealth(
  point: Row,
  remote: boolean,
  rules: Rules,
): WorldMonsterHealth | undefined {
  if (typeof remote !== "boolean") return invalid();
  if (remote || integer(point.pointType) !== 15) return undefined;
  return {
    current: integer(point.monsterCurrHP ?? 0),
    maximum: worldMonsterMaximum(
      15,
      point.pointItem == null ? null : text(point.pointItem, 255),
      rules,
    ),
  };
}
export function selectWorldExplorationMarch(
  observer: string,
  point: Row,
  orderedMarches: readonly Row[],
  remote: boolean,
): Row | undefined {
  if (typeof remote !== "boolean") return invalid();
  if (remote || integer(point.pointType) !== 6) return undefined;
  if (!text(observer, 255) || orderedMarches.length > 32767) return invalid();
  const pointId = integer(point.id);
  const ids = new Set<string>();
  let selected: Row | undefined;
  for (const march of orderedMarches) {
    const id = text(march.uuid, 40);
    if (!id || ids.has(id) || march.ownerUid !== observer) return invalid();
    ids.add(id);
    const target = integer(march.targetId);
    if (selected === undefined && target === pointId) selected = march;
  }
  if (!selected || integer(selected.state ?? 0) !== 1) return undefined;
  return selected;
}
export function worldExplorationDetail(
  observer: string,
  point: Row,
  orderedMarches: readonly Row[],
  remote: boolean,
): WorldExplorationDetail | undefined {
  const selected = selectWorldExplorationMarch(observer, point, orderedMarches, remote);
  if (!selected) return undefined;
  const report = selected.exploreReport;
  if (report != null && (!Buffer.isBuffer(report) || report.length > 65535)) return invalid();
  return {
    report: report == null ? null : Buffer.from(report as Buffer),
    startTime: long(selected.marchStartTime),
    endTime: BigInt.asIntN(64, long(selected.arrivalTime ?? 0n) + long(selected.exploreTime ?? 0n)),
  };
}
