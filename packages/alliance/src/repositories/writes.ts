import { eq } from "drizzle-orm";
import { alliance } from "@opencok/drizzle/schema/opencok_kingdom/alliance";
import { alliance_apply } from "@opencok/drizzle/schema/opencok_kingdom/alliance_apply";
import type { AllianceTransaction } from "../contracts/persistence";
import type { AllianceContextWrite } from "../contracts/context-state";
import type { AllianceRecord as Row } from "../contracts/records";
import type { AllianceRecordReaders } from "../contracts/readers";
import { AllianceGovernanceRepository } from "./governance";
import { AllianceMembershipRepository } from "./membership";
import { AllianceApplicationsRepository } from "./applications";
import { AllianceScienceRepository } from "./science";
import { AllianceHelpRepository } from "./help";
import { AllianceGiftRepository } from "./gifts";

export class AllianceWriteRepository
{
    public constructor(private readonly runtime: Pick<AllianceRecordReaders, "text" | "long">)
    {}

    public async write(
        tx: AllianceTransaction,
        owner: string,
        write: AllianceContextWrite,
        participants: readonly string[],
        groups: readonly string[],
    )
    {
        const { text, long } = this.runtime;
        const allowed = new Set(groups);

        await AllianceGovernanceRepository.writeAlliances(tx, owner, allowed, write, text);

        const check = (row: Row, field = "allianceId") => {
            if (!allowed.has(text(row, field)))
            {
                throw new Error("Foreign alliance write");
            }
        };

        await new AllianceGovernanceRepository(tx, { text, check }).writeMembers(
            write,
            participants,
        );

        const membership = new AllianceMembershipRepository(tx, participants, allowed, {
            text,
            check,
        });

        await membership.remove(write);

        await membership.memberships(write);

        await membership.firstJoin(write);

        await new AllianceApplicationsRepository(tx, { text, check }).write(
            write,
            participants,
            allowed,
        );

        await new AllianceScienceRepository(tx, owner, allowed, { text, check }).write(write);

        await new AllianceHelpRepository(tx, participants, { text, long, check }).write(write);

        await new AllianceGiftRepository(tx, owner, participants, { text, check }).write(write);

        await new AllianceApplicationsRepository(tx, { text, check }).updateMail(write, owner);

        await membership.mail(write);

        await new AllianceGovernanceRepository(tx, { text, check }).writeBlacklist(write);

        for (const id of write.deletedAlliances ?? [])
        {
            if (!allowed.has(id))
            {
                throw new Error("Foreign alliance deletion");
            }

            await tx.delete(alliance).where(eq(alliance.uid, id));
            await AllianceScienceRepository.removeAlliance(tx, id);
            await tx.delete(alliance_apply).where(eq(alliance_apply.allianceId, id));
            await AllianceHelpRepository.invalidateAlliance(tx, id);
        }
    }
}
