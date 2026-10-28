import { world_favorite } from "@opencok/drizzle/schema/opencok_kingdom/world_favorite";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { server_info } from "@opencok/drizzle/schema/opencok_global/server_info";
import type { WorldFavoriteStore } from "../contracts/world-favorites";
import type { Row } from "../contracts/rows";
import type { DatabaseClient } from "@opencok/drizzle/contracts/database";
import { and, asc, eq, inArray, or, sql } from "drizzle-orm";

function integer(value: unknown): value is number
{
    return (
        typeof value === "number"
        && Number.isInteger(value)
        && value >= -2147483648
        && value <= 2147483647
    );
}

function validate(owner: string, now: number)
{
    if (
        typeof owner !== "string"
        || !owner
        || owner.length > 255
        || owner.includes("\0")
        || !owner.isWellFormed()
        || !Number.isSafeInteger(now)
        || now < 0
    )
    {
        throw new Error("Invalid world favorite query");
    }
}

export function createWorldFavoriteStore(
    db: DatabaseClient<"kingdom">,
    global: DatabaseClient<"global">,
    kingdomId: number,
): WorldFavoriteStore
{
    if (!integer(kingdomId) || kingdomId < 1)
    {
        throw new Error("Invalid world favorite realm");
    }

    const authorized = (profile: Row | undefined, owner: string, now: number) =>
        profile?.uid === owner
        && profile.serverId === kingdomId
        && (profile.banFlag ?? 0) === 0
        && ((profile.banTime ?? 0n) as bigint) <= BigInt(now);
    const profileFields = {
        uid: userprofile.uid,
        serverId: userprofile.serverId,
        banTime: userprofile.banTime,
        banFlag: userprofile.banFlag,
    };

    return {
        async list(owner, now)
        {
            validate(owner, now);
            const snapshot = await db.transaction(
                async (tx) => {
                    const [profile] = await tx
                        .select(profileFields)
                        .from(userprofile)
                        .where(eq(userprofile.uid, owner))
                        .limit(1)
                        .for("share");

                    if (!authorized(profile, owner, now))
                    {
                        return { profile, rows: [] };
                    }

                    const rows = await tx
                        .select()
                        .from(world_favorite)
                        .where(eq(world_favorite.uid, owner))
                        .orderBy(
                            asc(world_favorite.server),
                            sql`${world_favorite.createTime} desc nulls last`,
                            asc(world_favorite.point),
                        )
                        .limit(32768);

                    if (rows.length > 32767 || rows.some((row) => row.uid !== owner))
                    {
                        throw new Error("World favorites exceed transport or ownership bounds");
                    }

                    return { profile, rows };
                },
                { isolationLevel: "repeatable read", accessMode: "read write" },
            );
            const servers = [...new Set(snapshot.rows.map((row) => row.server))];
            const types = servers.length
                ? await global
                    .select({ id: server_info.id, type: server_info.type })
                    .from(server_info)
                    .where(inArray(server_info.id, servers))
                : [];

            if (
                types.some((row) => !servers.includes(row.id) || !integer(row.type))
                || new Set(types.map((row) => row.id)).size !== types.length
            )
            {
                throw new Error("Invalid favorite server metadata");
            }

            return { ...snapshot, serverTypes: new Map(types.map((row) => [row.id, row.type])) };
        },
        async add(owner, input)
        {
            const query = Object.freeze({ ...input });
            validate(owner, query.now);

            if (
                ![query.point, query.server, query.type, query.cityType, query.resType].every(
                    integer,
                )
                || typeof query.name !== "string"
                || query.name.length > 255
                || query.name.includes("\0")
                || !query.name.isWellFormed()
            )
            {
                throw new Error("Invalid world favorite mutation");
            }

            return db.transaction(
                async (tx) => {
                    const [profile] = await tx
                        .select(profileFields)
                        .from(userprofile)
                        .where(eq(userprofile.uid, owner))
                        .limit(1)
                        .for("update");

                    if (!authorized(profile, owner, query.now))
                    {
                        return { profile };
                    }

                    const values = {
                        uid: owner,
                        point: query.point,
                        server: query.server,
                        type: query.type,
                        cityType: query.cityType,
                        resType: query.resType,
                        name: query.name,
                        createTime: BigInt(query.now),
                    };
                    const changed = await tx
                        .insert(world_favorite)
                        .values(values)
                        .onConflictDoUpdate({
                            target: [
                                world_favorite.uid,
                                world_favorite.point,
                                world_favorite.server,
                            ],
                            set: values,
                        })
                        .returning({ uid: world_favorite.uid });

                    if (changed.length !== 1 || changed[0]!.uid !== owner)
                    {
                        throw new Error("World favorite replacement failed");
                    }

                    return { profile };
                },
                { isolationLevel: "read committed", accessMode: "read write" },
            );
        },
        async remove(owner, input, now)
        {
            validate(owner, now);

            if (
                input.length > 32767
                || input.some((key) => !integer(key.point) || !integer(key.server))
            )
            {
                throw new Error("Invalid world favorite selection");
            }

            const keys = [
                ...new Map(input.map((key) => [`${key.point}:${key.server}`, { ...key }])).values(),
            ];
            let owned: Row | undefined;

            try
            {
                return await db.transaction(
                    async (tx) => {
                        const [profile] = await tx
                            .select(profileFields)
                            .from(userprofile)
                            .where(eq(userprofile.uid, owner))
                            .limit(1)
                            .for("update");

                        if (!authorized(profile, owner, now))
                        {
                            return { profile, success: false };
                        }

                        owned = profile;

                        for (let index = 0; index < keys.length; index += 500)
                        {
                            await tx
                                .delete(world_favorite)
                                .where(
                                    and(
                                        eq(world_favorite.uid, owner),
                                        or(
                                            ...keys
                                                .slice(index, index + 500)
                                                .map((key) =>
                                                    and(
                                                        eq(world_favorite.point, key.point),
                                                        eq(world_favorite.server, key.server),
                                                    )
                                                ),
                                        ),
                                    ),
                                );
                        }

                        return { profile, success: true };
                    },
                    { isolationLevel: "read committed", accessMode: "read write" },
                );
            }
            catch
            {
                if (!owned)
                {
                    throw new Error("World favorite deletion unavailable");
                }

                return { profile: owned, success: false };
            }
        },
    };
}

export async function checkWorldFavoriteStore(
    db: DatabaseClient<"kingdom">,
    global: DatabaseClient<"global">,
): Promise<void>
{
    await db.select().from(world_favorite).limit(0);
    await global.select({ id: server_info.id, type: server_info.type }).from(server_info).limit(0);
}
