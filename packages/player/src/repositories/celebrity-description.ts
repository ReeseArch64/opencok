import type { createDatabases } from "@opencok/drizzle";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { celebrity } from "@opencok/drizzle/schema/opencok_kingdom/celebrity";
import { DependencyError } from "@opencok/errors/dependency";
import { mysqlUtf8UnicodeCandidates, mysqlUtf8UnicodeKey } from "@opencok/rules/mysql-unicode";
import { eq, sql } from "drizzle-orm";
import { nicknameTrim } from "@opencok/rules/nickname";
import type { DatabaseClient } from "@opencok/drizzle/contracts/database";

export async function readCelebrityDescription(
    databases: Pick<ReturnType<typeof createDatabases>, "kingdoms" | "getKingdom">,
    uid: string,
    kingdomId: number,
): Promise<Buffer | null>
{
    if (
        typeof uid !== "string"
        || uid.length > 65535
        || !Number.isInteger(kingdomId)
        || kingdomId < -2147483648
        || kingdomId > 2147483647
    )
    {
        throw new DependencyError("celebrity description input");
    }

    if (!databases.kingdoms.has(kingdomId))
    {
        return null;
    }

    try
    {
        const key = mysqlUtf8UnicodeKey(uid);
        const pattern = mysqlUtf8UnicodeCandidates([uid]);
        const db = databases.getKingdom(kingdomId).db;
        const profiles = await db
            .select({ uid: userprofile.uid, flag: userprofile.gmFlag })
            .from(userprofile)
            .where(sql`${userprofile.uid} collate "C" ~ ${pattern}`);
        const matchingProfiles = profiles.filter((row) => mysqlUtf8UnicodeKey(row.uid) === key);

        if (matchingProfiles.length > 1)
        {
            throw new Error("Ambiguous celebrity target");
        }

        const profile = matchingProfiles[0];

        if (!profile || (profile.flag ?? 0) !== 11)
        {
            return null;
        }

        const rows = await db
            .select({ uid: celebrity.uid, description: celebrity.description })
            .from(celebrity)
            .where(sql`${celebrity.uid} collate "C" ~ ${pattern}`);
        const matches = rows.filter((row) => mysqlUtf8UnicodeKey(row.uid) === key);

        if (matches.length > 1)
        {
            throw new Error("Ambiguous celebrity description");
        }

        const row = matches[0];

        if (!row)
        {
            return null;
        }

        if (row.description === null)
        {
            return null;
        }

        if (!Buffer.isBuffer(row.description) || row.description.length > 65535)
        {
            throw new Error("Invalid celebrity bytes");
        }

        return Buffer.from(row.description);
    }
    catch
    {
        throw new DependencyError("celebrity description");
    }
}

export async function saveCelebrityDescription(
    db: DatabaseClient<"kingdom">,
    owner: string,
    kingdomId: number,
    now: number,
    readDescription: () => Buffer | null,
): Promise<void>
{
    if (
        typeof owner !== "string"
        || !owner
        || owner.length > 255
        || owner.includes("\0")
        || !owner.isWellFormed()
        || !Number.isSafeInteger(now)
        || now < 0
        || !Number.isInteger(kingdomId)
        || kingdomId < 1
        || typeof readDescription !== "function"
    )
    {
        throw new DependencyError("celebrity save input");
    }

    await db.transaction(
        async (tx) => {
            const [profile] = await tx
                .select({
                    uid: userprofile.uid,
                    realm: userprofile.serverId,
                    flag: userprofile.gmFlag,
                    banFlag: userprofile.banFlag,
                    banTime: userprofile.banTime,
                })
                .from(userprofile)
                .where(eq(userprofile.uid, owner))
                .limit(1)
                .for("update");

            if (
                !profile
                || profile.uid !== owner
                || profile.realm !== kingdomId
                || (profile.banFlag ?? 0) !== 0
                || (profile.banTime ?? 0n) > BigInt(now)
            )
            {
                throw new DependencyError("celebrity save owner");
            }

            if ((profile.flag ?? 0) !== 11)
            {
                return;
            }

            const key = mysqlUtf8UnicodeKey(owner);
            const candidates = await tx
                .select({ uid: celebrity.uid })
                .from(celebrity)
                .where(sql`${celebrity.uid} collate "C" ~ ${mysqlUtf8UnicodeCandidates([owner])}`);
            const matches = candidates.filter((row) => mysqlUtf8UnicodeKey(row.uid) === key);

            if (matches.length > 1)
            {
                throw new DependencyError("ambiguous celebrity save");
            }

            const description = readDescription();

            if (
                description !== null
                && (!Buffer.isBuffer(description) || description.length > 65535)
            )
            {
                throw new DependencyError("celebrity save bytes");
            }

            const existing = matches[0];
            const written = existing
                ? await tx
                    .update(celebrity)
                    .set({ description })
                    .where(eq(celebrity.uid, existing.uid))
                    .returning({ uid: celebrity.uid })
                : await tx
                    .insert(celebrity)
                    .values({ uid: nicknameTrim(owner), description })
                    .returning({ uid: celebrity.uid });

            if (written.length !== 1 || written[0]!.uid !== (existing?.uid ?? nicknameTrim(owner)))
            {
                throw new DependencyError("celebrity save result");
            }
        },
        { isolationLevel: "read committed", accessMode: "read write" },
    );
}
