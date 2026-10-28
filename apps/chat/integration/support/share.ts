import { nicknameAccountUid } from "@opencok/account/repositories/nickname-identity";
import { createDatabases } from "@opencok/drizzle";
import { account_new } from "@opencok/drizzle/schema/opencok_global/account_new";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { alliance_member } from "@opencok/drizzle/schema/opencok_kingdom/alliance_member";
import { mod_authorize } from "@opencok/drizzle/schema/opencok_kingdom/mod_authorize";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { randomUUID } from "node:crypto";
import { DisposablePostgres } from "../../../../packages/drizzle/tests/support/postgres";
import { createChatRepository } from "../../src/composition/chat-persistence";
import { createChatSocialService } from "../../src/composition/share";

export async function withShareDatabase(
    run: (context: {
        databases: ReturnType<typeof createDatabases>;
        repository: ReturnType<typeof createChatRepository>;
        command: (
            owner: string,
            command: Parameters<ReturnType<typeof createChatSocialService>["execute"]>[1],
            params: unknown,
            key?: string,
        ) => Promise<Record<string, unknown>>;
        databaseUrl: string;
        now: () => number;
        advance: (milliseconds: number) => void;
        reconnect: () => Promise<void>;
    }) => Promise<void>,
)
{
    const pg = new DisposablePostgres();
    let databases: ReturnType<typeof createDatabases> | undefined;
    let repository: ReturnType<typeof createChatRepository> | undefined;
    let time = Date.now();
    try
    {
        const admin = await pg.start();
        try
        {
            for (const name of ["opencok_global", "opencok_kingdom_1", "opencok_kingdom_2"])
            {
                await admin.query(`CREATE DATABASE "${name}"`);
            }
        }
        finally
        {
            await admin.end();
        }
        databases = createDatabases(pg.options);
        await migrate(databases.global.db, {
            migrationsFolder:
                new URL("../../../../packages/drizzle/migrations/global", import.meta.url).pathname,
        });
        for (const kingdom of databases.kingdoms.values())
        {
            await migrate(kingdom.db, {
                migrationsFolder:
                    new URL("../../../../packages/drizzle/migrations/kingdom", import.meta.url)
                        .pathname,
            });
        }
        for (
            const [uid, realm, alliance, membership, gm] of [
                ["alice", 1, "guild", "guild", 0],
                ["bob", 1, "guild", "guild", 0],
                ["blocked", 1, "guild", "guild", 0],
                ["stale", 1, "guild", "old", 0],
                ["outsider", 1, "other", "other", 0],
                ["remote", 2, "guild", "guild", 0],
                ["moderator", 1, "", "", -1],
                ["denied", 1, "", "", 1],
            ] as const
        )
        {
            await databases.global.db.insert(account_new).values({
                gameUid: uid,
                server: String(realm),
                uuid: "synthetic",
                gameUserLevel: 1,
                lastTime: 0n,
            });
            await databases.getKingdom(realm).db.insert(userprofile).values({
                uid,
                name: uid,
                country: "BR",
                level: 1,
                exp: 0,
                lang: "pt",
                serverId: realm,
                allianceId: alliance,
                gmFlag: gm,
            });
            if (membership)
            {
                await databases.getKingdom(realm).db.insert(alliance_member).values({
                    uid,
                    allianceId: membership,
                    rank: 1,
                });
            }
        }
        await databases.getKingdom(1).db.insert(mod_authorize).values([{
            uid: "moderator",
            authorize: 1,
        }, { uid: "denied", authorize: 0 }]);
        const databaseUrl =
            `postgres://postgres:${pg.options.password}@127.0.0.1:${pg.options.port}/opencok_global`;
        const open = () =>
            createChatRepository({ nicknameAccountUid, databaseUrl, now: () => new Date(time) });
        repository = open();
        await repository.health();
        await run({
            databases,
            get repository()
            {
                return repository!;
            },
            command: (owner, command, params, key = randomUUID()) =>
                createChatSocialService(repository!.social!).execute(owner, command, params, key),
            databaseUrl,
            now: () => time,
            advance: (milliseconds) => {
                time += milliseconds;
            },
            reconnect: async () => {
                await repository!.close();
                repository = open();
                await repository.health();
            },
        });
    }
    finally
    {
        await repository?.close();
        await databases?.close();
        await pg.stop();
    }
}
