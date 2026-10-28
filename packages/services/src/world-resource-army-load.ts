import type { GameServices } from "@opencok/contracts/game";
import type { WorldResourceOwnerSnapshot } from "@opencok/contracts/world-resource-owner";
import type { SavedResourceArmy } from "@opencok/messages/world-resource-army";
import { errors } from "@opencok/constants/game";
import { GameError } from "@opencok/errors/game";
import type { RuleContext } from "@opencok/rules/availability";
import type { Rules } from "@opencok/rules/game";
import { mailBlank } from "@opencok/rules/mail";
import {
    resourceSoldierLoadBase,
    resourceModifiedTroopLoad,
} from "@opencok/rules/world-resource-detail";
import { readResourceOwnerLoadEffects } from "./world-resource-owner-effects.ts";

function invalid(): never
{
    throw new GameError(errors.unsupported, "world_resource_detail");
}

export async function readResourceRawArmyLoad(
    army: SavedResourceArmy | null,
    identity: { ownerUid: string; residentOwner: boolean; },
    owner: WorldResourceOwnerSnapshot | undefined,
    rules: Rules,
    environment: Omit<RuleContext, "version">,
    services: Pick<GameServices, "worldPowerEffects" | "emperorVersion" | "expeditionStage">,
    clock: () => bigint,
): Promise<number>
{
    const { ownerUid, residentOwner } = identity;

    if (
        typeof ownerUid !== "string"
        || ownerUid.length > 40
        || mailBlank(ownerUid)
        || !ownerUid.isWellFormed()
        || ownerUid.includes("\0")
        || typeof residentOwner !== "boolean"
        || !army
        || army.owner !== ownerUid
        || !Number.isInteger(army.cachedLoad)
        || army.cachedLoad < -2147483648
        || army.cachedLoad > 2147483647
    )
    {
        return invalid();
    }

    if (!residentOwner && army.cachedLoad > 0)
    {
        return army.cachedLoad;
    }

    if (!Array.isArray(army.soldiers) || army.soldiers.length > 4096)
    {
        return invalid();
    }

    let result = 0;

    for (const soldier of army.soldiers)
    {
        const base = resourceSoldierLoadBase(soldier, rules);

        if (base === undefined)
        {
            continue;
        }

        if (owner ? owner.effects.profile.uid !== ownerUid : residentOwner)
        {
            return invalid();
        }

        const effects = owner
            ? await readResourceOwnerLoadEffects(owner, rules, environment, services, clock)
            : undefined;
        result = (result + resourceModifiedTroopLoad(base, soldier.loadEffect, effects)) | 0;
    }

    return result;
}
