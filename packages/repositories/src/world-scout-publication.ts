import { eq } from "drizzle-orm";
import { mail } from "@opencok/drizzle/schema/opencok_kingdom/mail";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import type { WorldScoutMailReader } from "@opencok/contracts/world-scout-publication";
import type { DatabaseClient } from "@opencok/drizzle/contracts/database";

const identifier = (value: string) =>
    typeof value === "string"
    && value.length > 0
    && value.length <= 40
    && value.isWellFormed()
    && !value.includes("\0");

export function createWorldScoutMailReader(
    db: DatabaseClient<"kingdom">,
    kingdomId: number,
): WorldScoutMailReader
{
    if (!Number.isInteger(kingdomId) || kingdomId < 1 || kingdomId > 2147483647)
    {
        throw new Error("Invalid scout publication realm");
    }

    return async (recipient, mailUid) => {
        if (!identifier(recipient) || !/^[a-f0-9]{32}00$/.test(mailUid))
        {
            throw new Error("Invalid scout publication query");
        }

        const [saved] = await db
            .select({ mail, realm: userprofile.serverId })
            .from(userprofile)
            .leftJoin(mail, eq(mail.uid, mailUid))
            .where(eq(userprofile.uid, recipient))
            .limit(1);

        if (!saved || saved.realm !== kingdomId)
        {
            throw new Error("Scout publication recipient is not resident");
        }

        if (saved.mail && (saved.mail.uid !== mailUid || saved.mail.toUser !== recipient))
        {
            throw new Error("Scout publication recipient does not own mail");
        }

        return { kingdomId, realm: saved.realm, mail: saved.mail ?? undefined };
    };
}
