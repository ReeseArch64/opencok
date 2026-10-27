import type { WorldPointDetailSnapshot } from "@opencok/contracts/world-point-detail";
import type { GameServices } from "@opencok/contracts/game";
import type { Rules } from "@opencok/rules/game";
import { decodeWorldResourceArmy } from "@opencok/messages/world-resource-army";
import {
  resourceArmyLoad,
  resourceRemaining,
  resourceSavedCollection,
  resourceOwnerDetail,
  resourceGroupDetail,
} from "@opencok/rules/world-resource-detail";
import { worldResourceOwner, worldResourceGroup } from "@opencok/mappings/world-resource-detail";
import { readResourceRawArmyLoad } from "./world-resource-army-load.ts";
import { restoredResourcePlunder } from "./world-resource-detail.ts";
import { restoredSharedCollectionTime } from "@opencok/rules/world-resource-detail";
import { sfs, type Fields } from "@opencok/messages/sfs";
import { mailBlank } from "@opencok/rules/mail";

export async function occupiedResourceFields(
  state: WorldPointDetailSnapshot,
  rules: Rules,
  now: number,
  services: Pick<GameServices, "worldPowerEffects" | "emperorVersion" | "expeditionStage">,
  clock: () => number,
): Promise<Fields> {
  const point = state.point!;

  if (point.pointType !== 3 && point.pointType !== 37) return {};

  const remaining = resourceRemaining(point.resInitValue as number, point.resCostValue as number);
  const group = state.resourceGroup?.map((row) => {
    if (
      row.targetId !== point.id ||
      row.worldId !== point.worldId ||
      row.state !== 1 ||
      typeof row.uuid !== "string"
    )
      throw new Error("Foreign shared collection march");

    return { ...resourceSavedCollection(row), armyLoad: 0, uuid: row.uuid };
  });
  const body: Fields = {};

  if (
    !mailBlank(point.ownerId as string | null) &&
    !mailBlank(point.ownerMarchUUid as string | null)
  ) {
    if (!state.resource) throw new Error("Missing resource snapshot");

    const row = state.resource.march;

    if (row) {
      if (
        row.uuid !== point.ownerMarchUUid ||
        row.ownerUid !== point.ownerId ||
        row.targetId !== point.id ||
        row.worldId !== point.worldId ||
        !Buffer.isBuffer(row.armyInfo)
      )
        throw new Error("Foreign resource march");

      const army = decodeWorldResourceArmy(row.armyInfo);
      const rawArmyLoad = await readResourceRawArmyLoad(
        army,
        { ownerUid: row.ownerUid as string, residentOwner: false },
        state.resource.owner,
        rules,
        { kingdomId: state.kingdomId, now },
        services,
        () => BigInt(clock()),
      );
      const armyLoad = resourceArmyLoad(
        {
          rawArmyLoad,
          pointType: point.pointType,
          pointItem: point.pointItem as string | null,
          plunder: restoredResourcePlunder(row.plunderRes as string | null, point.pointType),
        },
        rules,
      );
      const collection = { ...resourceSavedCollection(row), armyLoad };
      const maxCollectTime =
        point.pointType === 37
          ? restoredSharedCollectionTime(
              remaining,
              collection,
              row.arrivalTime as bigint | null,
              group ?? [],
              BigInt(clock()),
              group?.some((entry) => entry.uuid === row.uuid) ?? false,
            )
          : 0n;
      Object.assign(
        body,
        worldResourceOwner(
          resourceOwnerDetail(point.pointType, remaining, { ...collection, maxCollectTime }),
        ),
      );
    }
  }

  if (point.pointType === 37 && !state.remote) {
    if (!group) throw new Error("Missing shared resource snapshot");

    Object.assign(
      body,
      worldResourceGroup(resourceGroupDetail(remaining, group, () => BigInt(clock()))),
    );
    body.existMember = sfs.int((point.monsterCurrHP as number) ?? 0);
  }

  return body;
}
