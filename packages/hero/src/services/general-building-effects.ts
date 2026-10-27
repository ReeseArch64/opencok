import type { WorldResourceOwnerSnapshot } from "@opencok/contracts/world-point-detail";
import { legacyObjectOrder } from "@opencok/messages/legacy-object-order";
import type { RuleContext } from "@opencok/rules/availability";
import type { Rules } from "@opencok/rules/game";
import type { NewGeneralBuildingState } from "@opencok/hero/rules/new-general-building";
import {
  equippedGeneralBuildingEffect,
  type NewGeneralEquipmentModifier,
} from "@opencok/hero/rules/new-general-equipment";
import { newGeneralPrestigeLevel } from "@opencok/hero/rules/new-general-prestige";
import { restoredResourceGenerals } from "@opencok/hero/services/world-resource-generals";
import {
  ownerInteger as integer,
  ownerText as text,
  ownerLong as long,
  ownerRecords as bounded,
} from "@opencok/services/world-resource-owner-values";
import { resourceOwnerRuleContext } from "@opencok/services/world-resource-owner-context";

export function restoredResourceBuilding(
  snapshot: WorldResourceOwnerSnapshot,
  rules: Rules,
  buildingItemId = 400000,
  selectedBuildingUuid?: string,
): NewGeneralBuildingState {
  integer(buildingItemId);
  const keys: string[] = [];
  const selected = new Map<string, { itemId: number; level: unknown; star: unknown }>();

  for (const row of bounded(snapshot.buildings)) {
    const uuid = text(row.uuid, 40);

    if (uuid === null) throw new Error("Missing saved building UUID");

    keys.push(uuid);
    selected.set(uuid, { itemId: integer(row.itemId), level: row.level, star: row.star });
  }

  const ordered = legacyObjectOrder(keys);
  const buildingUuid = ordered.find(
    (uuid) =>
      selected.get(uuid)!.itemId === buildingItemId &&
      (selectedBuildingUuid === undefined || uuid === selectedBuildingUuid),
  );
  const mainUuid = ordered.find((uuid) => selected.get(uuid)!.itemId === 400000);

  return {
    buildingUuid,
    buildingUuids: new Set(ordered),
    get mainBuildingLevel() {
      const main = mainUuid === undefined ? undefined : selected.get(mainUuid);

      return main ? (integer(main.level) + integer(main.star)) | 0 : 0;
    },
    get playerLevel() {
      return integer(snapshot.effects.profile.level);
    },
    get prestigeLevel() {
      return newGeneralPrestigeLevel(
        integer(snapshot.effects.profile.civilizationType),
        bounded(snapshot.effects.prestige).map((row) => ({
          civilizationType: integer(row.civilizationType),
          prestigeValue: long(row.prestigeValue),
        })),
        rules,
      );
    },
    get offices() {
      return bounded(snapshot.newGenerals.offices).map((row) => ({
        id: integer(row.id),
        officeId: text(row.officeId, 40),
        position: integer(row.position),
        startTime: long(row.startTime),
      }));
    },
  };
}

export function resourceGeneralBuildingEffect(
  snapshot: WorldResourceOwnerSnapshot,
  rules: Rules,
  context: Omit<RuleContext, "version">,
  effect: number,
  resolve: (id: NewGeneralEquipmentModifier) => number,
  clock: () => bigint,
  buildingItemId = 400000,
  selectedBuildingUuid?: string,
): number {
  const ownerContext = resourceOwnerRuleContext(snapshot, context);

  return equippedGeneralBuildingEffect(
    () => {
      const building = restoredResourceBuilding(
        snapshot,
        rules,
        buildingItemId,
        selectedBuildingUuid,
      );

      return {
        building,
        orderedGenerals:
          building.buildingUuid === undefined
            ? []
            : restoredResourceGenerals(snapshot.newGenerals, rules),
      };
    },
    rules,
    ownerContext,
    effect,
    resolve,
    clock,
  );
}
