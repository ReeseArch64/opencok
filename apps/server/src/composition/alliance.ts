import { errors } from "@opencok/constants/game";
import { GameError } from "@opencok/errors/game";
import { AllianceGovernanceService } from "@opencok/alliance/services/governance";
import { AllianceMembershipPolicy } from "@opencok/alliance/rules/membership";
import { AllianceGovernanceMapper } from "@opencok/alliance/mappings/governance";
import type { AllianceGovernanceContext } from "@opencok/alliance/contracts/governance";
import { AllianceScienceService } from "@opencok/alliance/services/science";
import { AllianceSciencePolicy } from "@opencok/alliance/rules/science";
import { AllianceScienceMapper } from "@opencok/alliance/mappings/science";
import type { AllianceScienceContext } from "@opencok/alliance/contracts/science";
import { rankingCalendar } from "@opencok/rules/community-ranking";
import { AllianceGiftService } from "@opencok/alliance/services/gifts";
import { AllianceGiftPolicy } from "@opencok/alliance/rules/gifts";
import { AllianceGiftMapper } from "@opencok/alliance/mappings/gifts";
import type { AllianceGiftContext } from "@opencok/alliance/contracts/gifts";
import type { RealmInventoryPlanner } from "@opencok/services/inventory-runtime";
import { inventoryWeighted } from "@opencok/economy/rules/inventory";
import { activityEconomy } from "@opencok/economy/services/activity-economy";
import { randomUUID, randomInt } from "node:crypto";
import { AllianceHelpService } from "@opencok/alliance/services/help";
import { AllianceHelpPolicy } from "@opencok/alliance/rules/help-generation";
import { AllianceHelpMapper } from "@opencok/alliance/mappings/help";
import type { AllianceHelpContext } from "@opencok/alliance/contracts/help";
import type { Rules } from "@opencok/rules/game";
import type { AllianceRepository } from "@opencok/contracts/alliance-gameplay";
import type { InventoryEffects } from "@opencok/services/inventory-runtime";
import { AllianceService } from "@opencok/services/alliances";
import { publishAllianceMutation as publishSharedAllianceMutation } from "@opencok/services/alliance-publication";
import { text, num, long } from "@opencok/contracts/rows";
import { cityInteger } from "@opencok/rules/city-progression";
import { cityBuildingParameter } from "@opencok/rules/military";
import { allianceFailure } from "@opencok/rules/alliance";

export function createRealmAllianceHelp(context: AllianceHelpContext<Rules>)
{
    return new AllianceHelpService(
        context,
        { text, num, long, cityInteger, cityBuildingParameter, allianceFailure, randomUUID },
        new AllianceHelpPolicy({ allianceFailure }),
        new AllianceHelpMapper({ text, num, long }),
    );
}

export function createRealmAllianceGifts(context: AllianceGiftContext<RealmInventoryPlanner>)
{
    return new AllianceGiftService(
        context,
        {
            text,
            num,
            long,
            cityInteger,
            allianceFailure,
            inventoryWeighted,
            activityEconomy,
            randomUUID,
        },
        new AllianceGiftPolicy({ cityInteger, allianceFailure }),
        new AllianceGiftMapper({ text, num, long }),
    );
}

export function createRealmAllianceScience(context: AllianceScienceContext<RealmInventoryPlanner>)
{
    const policy = new AllianceSciencePolicy({ num, cityInteger, allianceFailure });

    return new AllianceScienceService(
        context,
        {
            text,
            num,
            long,
            cityInteger,
            allianceFailure,
            randomInt,
            rankingCalendar,
            activityEconomy,
        },
        policy,
        new AllianceScienceMapper({ text, num, long }, policy),
    );
}

export function createRealmAllianceGovernance(context: AllianceGovernanceContext)
{
    const runtime = {
        text,
        num,
        long,
        cityInteger,
        allianceFailure,
        errors,
        unsupportedFailure: (): never => {
            throw new GameError(errors.unsupported);
        },
    };

    return new AllianceGovernanceService(
        context,
        runtime,
        new AllianceMembershipPolicy(runtime),
        new AllianceGovernanceMapper({ text }),
    );
}

export function createRealmAllianceService(
    repository: AllianceRepository,
    rules: Rules,
    effects: InventoryEffects,
    forbidden: (value: string) => boolean | Promise<boolean> = () => false,
)
{
    return new AllianceService(
        repository,
        rules,
        effects,
        createRealmAllianceHelp,
        createRealmAllianceGifts,
        createRealmAllianceScience,
        createRealmAllianceGovernance,
        forbidden,
    );
}

export function publishAllianceMutation(
    read: Parameters<typeof publishSharedAllianceMutation>[0],
    payload: Parameters<typeof publishSharedAllianceMutation>[1],
    publish: Parameters<typeof publishSharedAllianceMutation>[2],
    rules: Rules,
)
{
    return publishSharedAllianceMutation(
        read,
        payload,
        publish,
        rules,
        new AllianceHelpMapper({ text, num, long }),
        new AllianceScienceMapper(
            { text, num, long },
            new AllianceSciencePolicy({ num, cityInteger, allianceFailure }),
        ),
    );
}
