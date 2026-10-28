import { AllianceContext } from "@opencok/alliance/services/context";
import { playerGameEffect } from "@opencok/rules/power-resolver";
import { generalSkillPoints } from "@opencok/hero/services/general-power";
import { AllianceQueryService } from "@opencok/alliance/services/queries";
import { AllianceSnapshotService } from "@opencok/alliance/services/snapshot";
import { AllianceQueryMapper } from "@opencok/alliance/mappings/queries";
import { AllianceSnapshotMapper } from "@opencok/alliance/mappings/snapshot";
import type { AllianceQueryContext } from "@opencok/alliance/contracts/queries";
import type { AllianceSnapshotContext } from "@opencok/alliance/contracts/snapshot";
import { AllianceMembershipService } from "@opencok/alliance/services/membership";
import { AllianceMembershipMapper } from "@opencok/alliance/mappings/membership";
import type { AllianceMembershipContext } from "@opencok/alliance/contracts/membership";
import { previewRewards } from "@opencok/rules/rewards";
import { javaMailBytes } from "@opencok/rules/avatar-mail";
import { AllianceApplicationsService } from "@opencok/alliance/services/applications";
import { AllianceApplicationsMapper } from "@opencok/alliance/mappings/applications";
import type { AllianceApplicationContext } from "@opencok/alliance/contracts/applications";
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
import type { AllianceRepository, AllianceState } from "@opencok/contracts/alliance-gameplay";
import type { InventoryEffects } from "@opencok/services/inventory-runtime";
import { AllianceService } from "@opencok/alliance/services/alliance";
import { AllianceIdentity } from "@opencok/alliance/services/identity";
import { AllianceCommandValidation } from "@opencok/alliance/validations/command";
import { AllianceMutationMapper } from "@opencok/alliance/mappings/mutation";
import { createInventoryPlanner } from "@opencok/services/inventory-runtime";
import { AlliancePublicationService } from "@opencok/alliance/services/publication";
import { AlliancePublicationMapper } from "@opencok/alliance/mappings/publication";
import { AlliancePublicationRepository } from "@opencok/alliance/repositories/publication";
import type {
    AlliancePublicationReader,
    AlliancePublisher,
} from "@opencok/alliance/contracts/publication";
import type { DatabaseClient } from "@opencok/drizzle/contracts/database";
import { fenceRealmTransaction, type RealmAuthority } from "@opencok/repositories/realm-authority";
import { allianceScienceEffects } from "@opencok/rules/power-memberships";
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

export function createRealmAllianceApplications(context: AllianceApplicationContext)
{
    const runtime = { text, num, long, randomUUID, allianceFailure, errors };

    return new AllianceApplicationsService(
        context,
        runtime,
        new AllianceMembershipPolicy({ ...runtime, cityInteger }),
        new AllianceApplicationsMapper(runtime),
    );
}

export function createRealmAllianceMembership(
    context: AllianceMembershipContext<Rules, RealmInventoryPlanner>,
)
{
    const runtime = {
        text,
        num,
        long,
        randomUUID,
        randomInt,
        allianceFailure,
        errors,
        previewRewards,
        javaMailBytes,
        activityEconomy,
    };

    return new AllianceMembershipService(
        context,
        runtime,
        new AllianceMembershipPolicy({ ...runtime, cityInteger }),
        new AllianceMembershipMapper({
            allianceFailure,
            allianceStableId: AllianceIdentity.stableId,
        }),
    );
}

export function createRealmAllianceQueries(context: AllianceQueryContext)
{
    const runtime = {
        text,
        num,
        long,
        allianceFailure,
        unsupportedFailure: (): never => {
            throw new GameError(errors.unsupported);
        },
    };

    return new AllianceQueryService(context, runtime, new AllianceQueryMapper(runtime));
}

export function createRealmAllianceSnapshot(context: AllianceSnapshotContext)
{
    const runtime = { text, num, long, allianceFailure };
    const policy = new AllianceMembershipPolicy({ ...runtime, cityInteger, errors });

    return new AllianceSnapshotService(
        context,
        runtime,
        new AllianceSnapshotMapper(runtime, policy),
    );
}

export function createRealmAllianceContext(
    owner: string,
    state: AllianceState,
    rules: Rules,
    ledger: RealmInventoryPlanner,
    effects: InventoryEffects,
)
{
    const runtime = {
        text,
        num,
        long,
        cityInteger,
        allianceFailure,
        errors,
        activityEconomy,
        effect: async (id: number) => {
            const effectState = await state.inventory.effects();

            return playerGameEffect(
                effectState,
                rules,
                { kingdomId: rules.kingdomId, version: "12.06.0", now: Number(state.now) },
                generalSkillPoints(effectState.generals),
                await effects.world(),
                await effects.emperor(),
                id as Parameters<typeof playerGameEffect>[6],
            );
        },
    };

    return new AllianceContext(
        owner,
        state,
        rules,
        ledger,
        runtime,
        new AllianceMembershipPolicy(runtime),
        {
            help: createRealmAllianceHelp,
            gifts: createRealmAllianceGifts,
            science: createRealmAllianceScience,
            governance: createRealmAllianceGovernance,
            applicationsFactory: createRealmAllianceApplications,
            membershipFactory: createRealmAllianceMembership,
            queriesFactory: createRealmAllianceQueries,
            snapshotFactory: createRealmAllianceSnapshot,
        },
    );
}

export function createRealmAllianceService(
    repository: AllianceRepository,
    rules: Rules,
    effects: InventoryEffects,
    forbidden: (value: string) => boolean | Promise<boolean> = () => false,
)
{
    const runtime = {
        text,
        num,
        long,
        cityInteger,
        allianceFailure,
        errors,
        randomUUID,
        createInventoryPlanner,
        unsupportedFailure: (): never => {
            throw new GameError(errors.unsupported);
        },
    };
    const policy = new AllianceMembershipPolicy(runtime);

    return new AllianceService(
        repository,
        rules,
        effects,
        createRealmAllianceContext,
        createRealmAllianceGifts,
        runtime,
        new AllianceCommandValidation(runtime, policy, forbidden),
        new AllianceMutationMapper(runtime),
        policy,
    );
}

export function createAlliancePublicationReader(
    db: DatabaseClient<"kingdom">,
    authority: RealmAuthority,
)
{
    const repository = new AlliancePublicationRepository(
        db,
        authority.kingdomId,
        (tx) => fenceRealmTransaction(tx, authority),
    );

    return (id: string, players?: readonly string[]) => repository.read(id, players);
}

export function publishAllianceMutation(
    read: AlliancePublicationReader,
    payload: Buffer,
    publish: AlliancePublisher,
    rules: Rules,
)
{
    const runtime = { text, num, long, cityInteger, allianceFailure, errors };

    return new AlliancePublicationService(
        read,
        publish,
        rules,
        { ...runtime, scienceEffects: (sciences) => allianceScienceEffects(sciences, rules) },
        new AlliancePublicationMapper(runtime, new AllianceMembershipPolicy(runtime)),
        new AllianceHelpMapper(runtime),
        new AllianceScienceMapper(runtime, new AllianceSciencePolicy(runtime)),
    ).deliver(payload);
}
