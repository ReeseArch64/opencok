import { account_new } from "@opencok/drizzle/schema/opencok_global/account_new";
import { DependencyError } from "@opencok/errors/dependency";
import { GameError } from "@opencok/errors/game";
import { mysqlUtf8UnicodeCandidates, mysqlUtf8UnicodeKey } from "@opencok/rules/mysql-unicode";
import { DrizzleQueryError, eq, sql } from "drizzle-orm";
import type { DatabaseClient } from "@opencok/drizzle/contracts/database";

export async function nicknameAccountUid(
    tx: Pick<DatabaseClient<"global">, "select">,
    owner: string,
): Promise<string>
{
    try
    {
        const key = mysqlUtf8UnicodeKey(owner);
        const candidates = await tx
            .select({ uid: account_new.gameUid })
            .from(account_new)
            .where(
                sql`${account_new.gameUid} collate "C" ~ ${mysqlUtf8UnicodeCandidates([owner])}`,
            );
        const matches = candidates.filter((row) => mysqlUtf8UnicodeKey(row.uid) === key);

        if (!matches.length)
        {
            throw new GameError("E100123");
        }

        if (matches.length !== 1)
        {
            throw new DependencyError("ambiguous nickname account");
        }

        const uid = matches[0]!.uid;
        const rows = await tx
            .select({ uid: account_new.gameUid })
            .from(account_new)
            .where(eq(account_new.gameUid, uid))
            .for("update");

        if (!rows.length)
        {
            throw new GameError("E100123");
        }

        if (rows.length !== 1 || rows[0]!.uid !== uid)
        {
            throw new DependencyError("nickname account selection");
        }

        return uid;
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
            throw new GameError("E100123");
        }

        throw error;
    }
}
