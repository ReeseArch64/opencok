import { AllianceQueryRepository } from "./queries";
import { AllianceMembershipRepository } from "./membership";
import { AllianceApplicationsRepository } from "./applications";
import { AllianceGovernanceRepository } from "./governance";
import { AllianceScienceRepository } from "./science";
import { AllianceGiftRepository } from "./gifts";
import { AllianceHelpRepository } from "./help";
import { and, asc, eq, inArray, or } from "drizzle-orm";
import { alliance } from "@opencok/drizzle/schema/opencok_kingdom/alliance";
import { alliance_member } from "@opencok/drizzle/schema/opencok_kingdom/alliance_member";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { user_building } from "@opencok/drizzle/schema/opencok_kingdom/user_building";
import { playerinfo } from "@opencok/drizzle/schema/opencok_kingdom/playerinfo";
import { queue } from "@opencok/drizzle/schema/opencok_kingdom/queue";
import { timed_activity } from "@opencok/drizzle/schema/opencok_kingdom/timed_activity";
import type { MutationCommand } from "@opencok/ledger/contracts/mutation";
import type { AllianceContextState, AllianceSelection } from "../contracts/context-state";
import type { AllianceGameplayState } from "../contracts/gameplay-state";
import type { AlliancePlan, AllianceRepository } from "../contracts/mutation";
import type { AllianceGameplayRuntime } from "../contracts/gameplay-runtime";
import type { AllianceParticipantRepository } from "./participants";
import type { AllianceCommitRepository } from "./commit";

export class AllianceGameplayRepository<TInventory extends AllianceContextState["inventory"]>
    implements AllianceRepository<AllianceGameplayState<TInventory>>
{
    public constructor(
        private readonly runtime: AllianceGameplayRuntime<TInventory>,
        private readonly participants: Pick<AllianceParticipantRepository, "discover">,
        private readonly commit: Pick<AllianceCommitRepository, "apply">,
    )
    {}

    public async execute(
        input: MutationCommand,
        selection: AllianceSelection,
        plan: (state: AllianceGameplayState<TInventory>) => Promise<AlliancePlan>,
    ): Promise<Buffer>
    {
        const { execute, now, executeInventory: executeRealmInventoryTransaction, kingdomId } =
            this.runtime;
        const { ids, groups, participants } = await this.participants.discover(input, selection);

        return execute({ ...input, participants }, async (tx) => {
            const at = BigInt(now());
            const profiles = await tx
                .select()
                .from(userprofile)
                .where(inArray(userprofile.uid, participants));

            if (profiles.some((row) => row.allianceId && !ids.has(row.allianceId)))
            {
                throw new Error("Alliance membership changed; retry operation");
            }

            const alliances = groups.length
                ? await tx
                    .select()
                    .from(alliance)
                    .where(inArray(alliance.uid, groups))
                    .orderBy(asc(alliance.uid))
                    .for("update")
                : [];
            const members = await tx
                .select()
                .from(alliance_member)
                .where(
                    or(
                        inArray(alliance_member.uid, participants),
                        inArray(alliance_member.allianceId, groups),
                    ),
                )
                .orderBy(asc(alliance_member.uid))
                .for("update");

            if (members.some((row) => !participants.includes(row.uid)))
            {
                throw new Error("Alliance participants changed; retry operation");
            }

            const applications = await AllianceApplicationsRepository.read(
                tx,
                participants,
                groups,
            );

            return executeRealmInventoryTransaction(
                tx,
                input.owner,
                async (inventory) => {
                    const result = await plan({
                        now: at,
                        inventory,
                        selection,
                        profiles,
                        alliances,
                        members,
                        applications,
                        lords: await AllianceMembershipRepository.lords(tx, participants),
                        cities: await tx
                            .select()
                            .from(user_building)
                            .where(inArray(user_building.uid, participants)),
                        powers: await tx
                            .select()
                            .from(playerinfo)
                            .where(inArray(playerinfo.uid, participants)),
                        points: await AllianceMembershipRepository.points(tx, participants),
                        marches: await AllianceMembershipRepository.marches(tx, participants),
                        sciences: await AllianceScienceRepository.readSciences(tx, groups),
                        research: await AllianceScienceRepository.readResearch(tx, groups),
                        history: await AllianceScienceRepository.readHistory(tx, input.owner),
                        donations: await AllianceScienceRepository.readDonations(
                            tx,
                            input.owner,
                        ),
                        helps: await AllianceHelpRepository.readGroups(tx, groups),
                        queues: await tx.select().from(queue).where(
                            inArray(queue.ownerId, participants),
                        ),
                        activities: await tx
                            .select({
                                id: timed_activity.id,
                                ownerId: timed_activity.ownerId,
                                queueId: timed_activity.queueId,
                                type: timed_activity.type,
                                itemId: timed_activity.itemId,
                                startedAt: timed_activity.startedAt,
                                dueAt: timed_activity.dueAt,
                                version: timed_activity.version,
                                status: timed_activity.status,
                            })
                            .from(timed_activity)
                            .where(
                                and(
                                    inArray(timed_activity.ownerId, participants),
                                    eq(timed_activity.status, 0),
                                ),
                            ),
                        sharedGifts: await AllianceGiftRepository.readEvent(
                            tx,
                            selection.giftEvent,
                        ),
                        gifts: await AllianceGiftRepository.readOwned(tx, input.owner),
                        mails: await AllianceApplicationsRepository.readMail(
                            tx,
                            selection.mailId,
                        ),
                        directory: await AllianceQueryRepository.directory(
                            tx,
                            input.command,
                            selection,
                        ),
                        directoryTotal: await AllianceQueryRepository.total(tx, selection),
                        candidates: await AllianceQueryRepository.candidates(
                            tx,
                            selection,
                            kingdomId,
                            at,
                        ),
                        blacklist: await AllianceGovernanceRepository.readBlacklist(tx, groups),
                    });
                    await this.commit.apply(tx, input.owner, result, participants, groups, at);

                    return result.inventory;
                },
                input.command,
            );
        });
    }
}
