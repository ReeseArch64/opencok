import type { Row } from "@opencok/contracts/rows";
import type { WorldResourceOwnerSnapshot } from "@opencok/contracts/world-point-detail";
import { legacyIntegerOrder, legacyObjectOrder } from "@opencok/messages/legacy-object-order";
import type { Rules } from "@opencok/rules/game";
import { validateNewGeneralContent } from "@opencok/rules/new-general-effects";
import type {
  NewGeneralEquipment,
  NewGeneralEquippedState,
} from "@opencok/rules/new-general-equipment";
import type { NewGeneralStatus } from "@opencok/rules/new-general-status";

function integer(value: unknown): number {
  if (value === null) return 0;
  if (
    typeof value !== "number" ||
    !Number.isInteger(value) ||
    value < -2147483648 ||
    value > 2147483647
  )
    throw new Error("Invalid saved general integer");
  return value;
}
function text(value: unknown, limit: number): string | null {
  if (value === null) return null;
  if (typeof value !== "string" || value.length > limit)
    throw new Error("Invalid saved general text");
  return value;
}
function long(value: unknown): bigint | null {
  if (value === null) return null;
  if (typeof value !== "bigint" || BigInt.asIntN(64, value) !== value)
    throw new Error("Invalid saved general long");
  return value;
}
function bounded(rows: readonly Row[]): readonly Row[] {
  if (rows.length > 4096) throw new Error("Too many saved general records");
  return rows;
}

export function restoredResourceGenerals(
  snapshot: WorldResourceOwnerSnapshot["newGenerals"],
  rules: Rules,
): NewGeneralEquippedState[] {
  if (typeof snapshot.moved !== "boolean") throw new Error("Invalid general transfer state");
  const ids: number[] = [];
  const selected = new Map<
    number,
    {
      general: NewGeneralEquippedState;
      statuses: NewGeneralStatus[];
      equipment: Map<string, NewGeneralEquipment>;
      slots: string[];
    }
  >();
  for (const row of bounded(snapshot.generals)) {
    const state = integer(row.state);
    if (state < -128 || state > 127) throw new Error("Invalid saved general byte");
    const statuses: NewGeneralStatus[] = [];
    const general: NewGeneralEquippedState = {
      id: integer(row.id),
      state,
      buildingUuid: text(row.buildingUuid, 96),
      star: integer(row.star),
      baseSkill: text(row.baseSkill, 256),
      talent: text(row.talent, 5000),
      opTime: text(row.opTime, 200),
      refinement: text(row.refinement, 300),
      statuses,
      orderedEquipment: [],
    };
    validateNewGeneralContent(general);
    ids.push(general.id);
    selected.set(general.id, { general, statuses, equipment: new Map(), slots: [] });
  }
  if (!snapshot.moved) {
    for (const row of bounded(snapshot.statuses)) {
      const entry = selected.get(integer(row.newGeneralId));
      if (!entry) continue;
      entry.statuses.push({
        stateId: integer(row.stateId),
        startTime: long(row.startTime),
        endTime: long(row.endTime),
      });
    }
    for (const row of bounded(snapshot.equipment)) {
      const generalId = integer(row.generalId);
      if (generalId <= 0) continue;
      const entry = selected.get(generalId);
      if (!entry) continue;
      const itemId = integer(row.itemId);
      const rule = rules.power.equipment?.get(String(itemId));
      if (!rule) throw new Error("Missing general equipment binding rule");
      if (entry.general.state === 4) continue;
      if (typeof rule.site !== "string" || rule.site.length > 65535)
        throw new Error("Missing or oversized general equipment site");
      entry.slots.push(rule.site);
      entry.equipment.set(rule.site, {
        itemId,
        extraProperty: text(row.extraProperty, 255),
      });
    }
  }
  return legacyIntegerOrder(ids).map((id) => {
    const entry = selected.get(id)!;
    entry.general.orderedEquipment = legacyObjectOrder(entry.slots).map((site) =>
      entry.equipment.get(site)!,
    );
    return entry.general;
  });
}
