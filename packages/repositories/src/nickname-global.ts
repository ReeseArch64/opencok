import { account_new } from "@opencok/drizzle/schema/opencok_global/account_new";
import { usermapping } from "@opencok/drizzle/schema/opencok_global/usermapping";
import { DependencyError } from "@opencok/errors/dependency";
import { GameError } from "@opencok/errors/game";
import { mysqlUtf8UnicodeCandidates, mysqlUtf8UnicodeKey } from "@opencok/rules/mysql-unicode";
import { and, DrizzleQueryError, eq, or, sql } from "drizzle-orm";
import type { DatabaseClient } from "@opencok/drizzle/contracts/database";
import { withAvailableNickname, type NicknameGlobalTransaction } from "./nickname-lock.ts";

const nameKey = mysqlUtf8UnicodeKey("name");

const nameCandidates = mysqlUtf8UnicodeCandidates(["name"]);

export async function nicknameAccountUid(
    tx: NicknameGlobalTransaction,
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

export async function writeNicknameGlobal(
    tx: NicknameGlobalTransaction,
    owner: string,
    name: string,
): Promise<void>
{
    const uid = await nicknameAccountUid(tx, owner);

    try
    {
        const updated = await tx
            .update(account_new)
            .set({ gameUserName: name })
            .where(eq(account_new.gameUid, uid))
            .returning({ uid: account_new.gameUid });

        if (updated.length !== 1 || updated[0]!.uid !== uid)
        {
            throw new Error("Nickname account update failed");
        }

        const ownerKey = mysqlUtf8UnicodeKey(owner);
        const candidates = await tx
            .select({ uid: usermapping.gameUid, type: usermapping.mappingType })
            .from(usermapping)
            .where(
                and(
                    sql`${usermapping.gameUid} collate "C" ~ ${
                        mysqlUtf8UnicodeCandidates([owner])
                    }`,
                    sql`${usermapping.mappingType} collate "C" ~ ${nameCandidates}`,
                ),
            );
        const owned = candidates.filter(
            (row) =>
                mysqlUtf8UnicodeKey(row.uid) === ownerKey
                && mysqlUtf8UnicodeKey(row.type) === nameKey,
        );

        for (let offset = 0; offset < owned.length; offset += 500)
        {
            await tx
                .delete(usermapping)
                .where(
                    or(
                        ...owned
                            .slice(offset, offset + 500)
                            .map((row) =>
                                and(
                                    eq(usermapping.gameUid, row.uid),
                                    eq(usermapping.mappingType, row.type),
                                )
                            ),
                    ),
                );
        }

        const inserted = await tx
            .insert(usermapping)
            .values({ gameUid: owner, mappingType: "name", mappingValue: name })
            .returning({
                uid: usermapping.gameUid,
                type: usermapping.mappingType,
                value: usermapping.mappingValue,
            });

        if (
            inserted.length !== 1
            || inserted[0]!.uid !== owner
            || inserted[0]!.type !== "name"
            || inserted[0]!.value !== name
        )
        {
            throw new Error("Nickname mapping insert failed");
        }
    }
    catch
    {
        throw new GameError("E100179");
    }
}

export async function commitNicknameGlobal<T>(
    db: DatabaseClient<"global">,
    owner: string,
    name: string,
    prepare: () => Promise<T>,
): Promise<T>
{
    try
    {
        if (
            typeof owner !== "string"
            || !owner
            || owner.length > 100
            || owner.includes("\0")
            || typeof prepare !== "function"
        )
        {
            throw new Error("Invalid nickname owner");
        }

        mysqlUtf8UnicodeKey(owner);
    }
    catch
    {
        throw new DependencyError("nickname global input");
    }

    return withAvailableNickname(db, name, async (tx) => {
        const prepared = await prepare();
        await writeNicknameGlobal(tx, owner, name);

        return prepared;
    });
}
