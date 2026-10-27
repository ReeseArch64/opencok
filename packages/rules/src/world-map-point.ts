import type { Row } from "@opencok/contracts/rows";
import { num, text } from "@opencok/contracts/rows";
import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import { worldMonsterMaximum } from "./world-monster-detail";
import { javaDecimal } from "./java-integer";
import { mailBlank } from "./mail";
import type { Rules } from "./game";

const utf8 = new TextDecoder("utf-8", { fatal: true });

function integer(value: unknown) {
  if (
    typeof value !== "number" ||
    !Number.isInteger(value) ||
    value < -2147483648 ||
    value > 2147483647
  )
    {throw new GameError(errors.unsupported, "world_monster_detail");}

  return value;
}

function consumedNPC(point: Row) {
  const raw = point.monsterInfo;

  if (raw == null) {return 0;}

  if (!(raw instanceof Uint8Array) || raw.byteLength > 65535)
    {throw new GameError(errors.unsupported, "world_monster_detail");}

  if (!raw.byteLength) {return 0;}

  let value: string;

  try {
    value = utf8.decode(raw);
  } catch {
    return 0;
  }

  let start = 0,
    end = value.length;

  while (start < end && value.charCodeAt(start) <= 32) {start++;}

  while (end > start && value.charCodeAt(end - 1) <= 32) {end--;}

  if (start === end) {return 0;}

  try {
    return Number(javaDecimal(value.slice(start, end), 32));
  } catch {
    throw new GameError(errors.unsupported, "world_monster_detail");
  }
}

export function worldMapMonsterFields(point: Row, rules?: Rules): Readonly<Record<string, number>> {
  const type = num(point, "pointType");

  if (type === 6) {return { mc_state: integer(point.monsterCastleState ?? 0) };}

  if (![9, 15].includes(type) || mailBlank(text(point, "pointItem"))) {return {};}

  if (!rules) {throw new GameError(errors.unsupported, "world_monster_detail");}

  const item = text(point, "pointItem"),
    maximum = worldMonsterMaximum(type, item, rules),
    stored = integer(point.monsterCurrHP ?? 0),
    fields: Record<string, number> = {
      mchp: Math.max(stored > 0 ? stored : maximum, 0),
      mmhp: maximum,
    };

  if (rules.world.fieldMonsters?.get(item)?.NPC === "1")
    {fields.mrn = Math.max((maximum - consumedNPC(point)) | 0, 0);}

  return fields;
}
