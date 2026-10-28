import { account_new } from "@opencok/drizzle/schema/opencok_global/account_new";
import { usermapping } from "@opencok/drizzle/schema/opencok_global/usermapping";
import { DependencyError } from "@opencok/errors/dependency";
import { mysqlUtf8UnicodeCandidates, mysqlUtf8UnicodeKey } from "@opencok/rules/mysql-unicode";
import { nicknameTrim } from "@opencok/rules/nickname";
import { and, DrizzleQueryError, ne, sql } from "drizzle-orm";
import type { Database } from "./game.ts";

const nameTypeKey = mysqlUtf8UnicodeKey("name");

const nameTypeCandidates = mysqlUtf8UnicodeCandidates(["name"]);

export async function nicknameOccupied(
    db: Database["databases"]["global"]["db"],
    name: string,
): Promise<boolean>
{
    try
    {
        return await readNicknameOccupation(db, name);
    }
    catch (error)
    {
        const cause = error instanceof DrizzleQueryError ? error.cause : error;

        if (
            cause
            && typeof cause === "object"
            && "code" in cause
            && typeof cause.code === "string"
            && /^[0-9A-Z]{5}$/.test(cause.code)
        )
        {
            return false;
        }

        throw new DependencyError("nickname availability");
    }
}

export async function readNicknameOccupation(
    db: Pick<Database["databases"]["global"]["db"], "select">,
    name: string,
): Promise<boolean>
{
    const nameKey = mysqlUtf8UnicodeKey(name);
    const mappings = await db
        .select({
            uid: usermapping.gameUid,
            type: usermapping.mappingType,
            value: usermapping.mappingValue,
        })
        .from(usermapping)
        .where(
            and(
                sql`${usermapping.mappingType} collate "C" ~ ${nameTypeCandidates}`,
                sql`${usermapping.mappingValue} collate "C" ~ ${
                    mysqlUtf8UnicodeCandidates([name])
                }`,
            ),
        );
    const ids = mappings
        .filter(
            (row) =>
                mysqlUtf8UnicodeKey(row.type) === nameTypeKey
                && row.value !== null
                && mysqlUtf8UnicodeKey(row.value) === nameKey,
        )
        .map((row) => nicknameTrim(row.uid));

    if (!ids.length)
    {
        return false;
    }

    const keys = new Set(ids.map(mysqlUtf8UnicodeKey));
    const accounts = await db
        .select({ uid: account_new.gameUid })
        .from(account_new)
        .where(
            and(
                sql`${account_new.gameUid} collate "C" ~ ${mysqlUtf8UnicodeCandidates(ids)}`,
                ne(account_new.active, -1),
            ),
        );

    return accounts.some((row) => keys.has(mysqlUtf8UnicodeKey(row.uid)));
}
