import type { Rules } from "@opencok/rules/game";
import type { GameServices } from "@opencok/contracts/game";
import type { PlayerEffectSnapshot } from "@opencok/contracts/power";
import type { WorldResourceOwnerSnapshot } from "@opencok/contracts/world-resource-owner";
import type { Row } from "@opencok/world/contracts/rows";
import type { WorldPointOwnerSnapshot } from "@opencok/world/contracts/world-point-detail";
import {
    WorldPointDetailService,
    restoredExplorationMarch,
} from "@opencok/world/services/world-point-detail";
import { WorldSpecialDetailService } from "@opencok/world/services/world-special-detail";
import {
    createWorldPointDetailStore,
    checkWorldPointDetailStore,
} from "@opencok/world/repositories/world-point-detail";
import {
    worldPointOccupied,
    worldPointOwnerBase,
    worldCityDetail,
} from "@opencok/world/rules/world-point-detail";
import { readPlayerEffects } from "@opencok/repositories/power";
import {
    readWorldResourceOwner,
    checkWorldResourceOwnerStore,
} from "@opencok/repositories/world-resource-owner";
import { javaDecimal } from "@opencok/rules/java-integer";
import { mailBlank } from "@opencok/rules/mail";
import { resourceRemaining, neutralResourceStart } from "@opencok/rules/world-resource-detail";
import { occupiedResourceFields } from "@opencok/services/world-resource-query";
import { territorySoldierCapacity } from "@opencok/services/world-territory-capacity";
import { barbarianArmyPlan, barbarianPower } from "@opencok/rules/world-barbarian-detail";
import {
    worldMonsterHealth,
    worldExplorationDetail,
    selectWorldExplorationMarch,
} from "@opencok/rules/world-monster-detail";
import {
    worldMonsterHealth as healthFields,
    worldMonsterExploration,
} from "@opencok/mappings/world-monster-detail";
import { worldNeutralResource } from "@opencok/mappings/world-resource-detail";
import { playerGameEffect } from "@opencok/rules/power-resolver";
import { worldPowerEffects } from "@opencok/rules/power-world";
import { generalSkillPoints } from "@opencok/hero/services/general-power";
import { decodeWorldPowerEffects } from "@opencok/services/power";

type DetailServices = Pick<
    GameServices,
    "worldPowerEffects" | "emperorVersion" | "expeditionStage" | "worldTurretKills"
>;

const readers = {
    readPlayerEffects,
    readResourceOwner: readWorldResourceOwner,
    checkResourceOwner: checkWorldResourceOwnerStore,
    mailBlank,
};

export function createRealmWorldPointDetailStore(
    databases: Parameters<typeof createWorldPointDetailStore>[0],
    kingdomId: number,
)
{
    return createWorldPointDetailStore(databases, kingdomId, readers);
}

export function checkRealmWorldPointDetailStore(
    db: Parameters<typeof checkWorldPointDetailStore>[0],
)
{
    return checkWorldPointDetailStore(db, readers);
}

export function createRealmWorldPointDetailPolicy()
{
    return {
        worldPointOccupied: (point: Row) => worldPointOccupied(point, mailBlank),
        worldPointOwnerBase: (point: Row, owner: WorldPointOwnerSnapshot, remote: boolean) =>
            worldPointOwnerBase(point, owner, remote, mailBlank),
        worldCityDetail: (
            observer: unknown,
            target: unknown,
            duel: unknown,
            effect: number,
            multiplier: string | undefined,
        ) => worldCityDetail(observer, target, duel, effect, multiplier, javaDecimal),
    };
}

export function createRealmExplorationSelector()
{
    return (observer: string, point: Row, marches: readonly Row[]) =>
        restoredExplorationMarch(observer, point, marches, selectWorldExplorationMarch);
}

export function createRealmWorldSpecialDetailService(rules: Rules, services: DetailServices = {})
{
    return new WorldSpecialDetailService<WorldResourceOwnerSnapshot>({
        mailBlank,
        javaDecimal,
        resourceRemaining,
        allianceBuildings: () => rules.world.allianceBuildings,
        territorySoldierCapacity: (snapshot, kingdomId, now) =>
            territorySoldierCapacity(snapshot, rules, kingdomId, now, services),
    });
}

export function createRealmWorldPointDetailService(rules: Rules, services: DetailServices = {})
{
    const policy = createRealmWorldPointDetailPolicy();
    const special = createRealmWorldSpecialDetailService(rules, services);

    return new WorldPointDetailService<
        PlayerEffectSnapshot,
        WorldResourceOwnerSnapshot,
        NonNullable<ReturnType<typeof barbarianArmyPlan>>
    >({
        mailBlank,
        javaDecimal,
        cityFeature: () => rules.items.get("lost_battle"),
        occupied: policy.worldPointOccupied,
        ownerBase: policy.worldPointOwnerBase,
        cityDetail: policy.worldCityDetail,
        resourceRemaining,
        selectExploration: selectWorldExplorationMarch,
        specialFields: (snapshot, observer, now) => special.fields(snapshot, observer, now),
        occupiedResourceFields: (snapshot, now, clock) =>
            occupiedResourceFields(snapshot, rules, now, services, clock),
        monsterHealth: (point, remote) => healthFields(worldMonsterHealth(point, remote, rules)),
        explorationDetail: (observer, point, marches, remote) =>
            worldMonsterExploration(worldExplorationDetail(observer, point, marches, remote)),
        neutralResource: (point, march) =>
            worldNeutralResource(neutralResourceStart(point, march, rules)),
        barbarianArmyPlan: (row, now) => barbarianArmyPlan(row, rules, now),
        barbarianPower: (plan, remaining) => barbarianPower(plan, remaining, rules),
        hasWorldEffects: () => Boolean(services.worldPowerEffects),
        worldEffects: async (context) =>
            worldPowerEffects(
                decodeWorldPowerEffects(await services.worldPowerEffects!()),
                rules,
                context,
            ),
        emperorVersion: () => services.emperorVersion?.(),
        cityEffect: (snapshot, context, world, emperor) =>
            playerGameEffect(
                snapshot,
                rules,
                context,
                generalSkillPoints(snapshot.generals),
                world,
                emperor,
                37,
            ),
    }, () => services.worldTurretKills);
}
