import { and, eq, inArray } from "drizzle-orm";
import { mail } from "@opencok/drizzle/schema/opencok_kingdom/mail";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { alliance_member } from "@opencok/drizzle/schema/opencok_kingdom/alliance_member";
import { alliance_apply } from "@opencok/drizzle/schema/opencok_kingdom/alliance_apply";
import type { DatabaseClient } from "@opencok/drizzle/contracts/database";
import type { MutationCommand } from "@opencok/ledger/contracts/mutation";
import type { AllianceSelection } from "../contracts/context-state";
import { AllianceApplicationsMapper } from "../mappings/applications";

export class AllianceParticipantRepository
{
    public constructor(private readonly db: DatabaseClient<"kingdom">)
    {}

    public async discover(input: MutationCommand, selection: AllianceSelection)
    {
        const db = this.db;
        const seed = [input.owner, ...(selection.playerId ? [selection.playerId] : [])];
        const initial = await db.select().from(userprofile).where(
            inArray(userprofile.uid, seed),
        );
        const ids = new Set(
            initial.map((row) => row.allianceId).filter((id): id is string => Boolean(id)),
        );

        if (selection.allianceId)
        {
            ids.add(selection.allianceId);
        }

        if (selection.mailId)
        {
            const [message] = await db
                .select()
                .from(mail)
                .where(and(eq(mail.uid, selection.mailId), eq(mail.toUser, input.owner)));

            if (message && [17, 25].includes(message.type))
            {
                const data = AllianceApplicationsMapper.mailData(message.contents);

                if (message.type === 17 && typeof data.allianceId === "string")
                {
                    ids.add(data.allianceId);
                }

                if (message.type === 25 && typeof data.applicantId === "string")
                {
                    seed.push(data.applicantId);
                }
            }

            const [application] = await db
                .select()
                .from(alliance_apply)
                .where(eq(alliance_apply.uid, selection.mailId));

            if (application?.allianceId)
            {
                ids.add(application.allianceId);
            }

            if (application?.userId)
            {
                seed.push(application.userId);
            }
        }

        const groups = [...ids].sort();
        const previous = groups.length
            ? await db
                .select({ uid: alliance_member.uid })
                .from(alliance_member)
                .where(inArray(alliance_member.allianceId, groups))
                .limit(2049)
            : [];
        const participants = [...new Set([...seed, ...previous.map((row) => row.uid)])].sort();

        return { ids, groups, participants };
    }
}
