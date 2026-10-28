import { createDatabase } from "@opencok/drizzle";
import { requireEnv } from "@opencok/env/database";
import { loadRules } from "@opencok/resources/rules";
import { moderateAvatar as commit } from "@opencok/repositories/avatar-moderation";
import { moderateAvatar } from "@opencok/services/avatar-moderation";

let database: ReturnType<typeof createDatabase<"kingdom">> | undefined;
try
{
    const [realm, owner, expected, decision, operationId, extra] = process.argv.slice(2);
    if (
        extra !== undefined
        || !realm
        || !/^[1-9][0-9]*$/.test(realm)
        || !owner
        || !expected
        || !/^-?(0|[1-9][0-9]*)$/.test(expected)
        || (decision !== "approve" && decision !== "reject")
        || !operationId
        || requireEnv("DATABASE_ROLE") !== "kingdom"
    )
    {
        throw new Error("Invalid operator arguments");
    }
    const kingdomId = Number(realm);
    database = createDatabase("kingdom", {
        connectionString: requireEnv("DATABASE_URL"),
        max: 1,
        connectionTimeoutMillis: 5000,
        statement_timeout: 10000,
        query_timeout: 12000,
    });
    const rules = await loadRules(undefined, kingdomId);
    const result = await moderateAvatar(
        { owner, operationId, expectedPicVer: Number(expected), decision },
        rules,
        Date.now(),
        (request, now, interval) => commit(database!.db, kingdomId, request, now, interval),
    );
    console.log(
        JSON.stringify({
            operationId: result.operationId,
            picVer: result.picVer,
            changed: result.changed,
        }),
    );
}
catch
{
    console.error(
        "Avatar moderation failed; verify realm database, current version, stable operation ID and catalogs",
    );
    process.exitCode = 1;
}
finally
{
    await database?.close();
}
