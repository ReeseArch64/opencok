import { randomBytes, randomUUID } from "node:crypto";
import { and, eq, sql } from "drizzle-orm";
import { game_identity } from "@opencok/drizzle/schema/opencok_global/game_identity";
import { character_provisioning } from "@opencok/drizzle/schema/opencok_global/character_provisioning";
import { account_new } from "@opencok/drizzle/schema/opencok_global/account_new";
import { usermapping } from "@opencok/drizzle/schema/opencok_global/usermapping";
import type { CharacterReservation, ProvisioningStore } from "@opencok/contracts/provisioning";
import { HttpError } from "@opencok/errors/http";
import { starterVersion } from "@opencok/contracts/provisioning";
import { provisionHash } from "@opencok/rules/provisioning";
import type { Database } from "./game.ts";

export function createProvisioningStore(
    db: Database["databases"]["global"]["db"],
    now = Date.now,
): ProvisioningStore
{
    return {
        reserve(identity, input)
        {
            return db.transaction(async (tx) => {
                const timestamp = now();
                await tx
                    .insert(game_identity)
                    .values({ id: randomUUID(), ...identity, createdAt: BigInt(timestamp) })
                    .onConflictDoNothing({ target: [game_identity.issuer, game_identity.subject] });
                const [account] = await tx
                    .select()
                    .from(game_identity)
                    .where(
                        and(
                            eq(game_identity.issuer, identity.issuer),
                            eq(game_identity.subject, identity.subject),
                        ),
                    )
                    .for("update");

                if (!account || account.disabled)
                {
                    throw new HttpError(403, "Identity unavailable");
                }

                const [existing] = await tx
                    .select()
                    .from(character_provisioning)
                    .where(
                        and(
                            eq(character_provisioning.identityId, account.id),
                            eq(character_provisioning.kingdomId, input.kingdomId),
                        ),
                    );

                if (existing)
                {
                    return {
                        reservation: JSON.parse(existing.payload) as CharacterReservation,
                        ready: existing.state === 1,
                    };
                }

                const characters = await tx
                    .select({ realm: character_provisioning.kingdomId })
                    .from(character_provisioning)
                    .where(eq(character_provisioning.identityId, account.id));

                if (characters.length >= 2)
                {
                    throw new HttpError(409, "Character limit reached");
                }

                await tx.execute(
                    sql`select pg_advisory_xact_lock(hashtextextended(${`character-device:${input.kingdomId}:${input.deviceUuid}`}, 0))`,
                );
                const owned = await tx
                    .select({ uid: account_new.gameUid })
                    .from(account_new)
                    .where(
                        and(
                            eq(account_new.uuid, input.deviceUuid),
                            eq(account_new.server, String(input.kingdomId)),
                        ),
                    );
                const pending = await tx
                    .select({ uid: character_provisioning.gameUid })
                    .from(character_provisioning)
                    .where(
                        and(
                            eq(character_provisioning.deviceUuid, input.deviceUuid),
                            eq(character_provisioning.kingdomId, input.kingdomId),
                        ),
                    );

                if (owned.length || pending.length)
                {
                    throw new HttpError(409, "Device already bound in this realm");
                }

                let uid = "";

                for (let attempt = 0; attempt < 8; attempt++)
                {
                    const candidate = (randomBytes(8).readBigUInt64BE() || 1n).toString();

                    if (
                        !(
                            await tx
                                .select({ uid: account_new.gameUid })
                                .from(account_new)
                                .where(eq(account_new.gameUid, candidate))
                        ).length
                    )
                    {
                        uid = candidate;
                        break;
                    }
                }

                if (!uid)
                {
                    throw new Error("Character identity unavailable");
                }

                const reservation: CharacterReservation = {
                    kingdomId: input.kingdomId,
                    deviceUuid: input.deviceUuid,
                    country: input.country,
                    language: input.language,
                    identityId: account.id,
                    gameUid: uid,
                    name: `Lord${uid}`,
                    createdAt: timestamp,
                    preset: starterVersion,
                };
                await tx.insert(character_provisioning).values({
                    identityId: account.id,
                    kingdomId: input.kingdomId,
                    deviceUuid: input.deviceUuid,
                    gameUid: uid,
                    payload: JSON.stringify(reservation),
                    createdAt: BigInt(timestamp),
                });

                return { reservation, ready: false };
            });
        },
        activate(identity, reservation, receipt)
        {
            return db.transaction(async (tx) => {
                const [account] = await tx
                    .select()
                    .from(game_identity)
                    .where(
                        and(
                            eq(game_identity.issuer, identity.issuer),
                            eq(game_identity.subject, identity.subject),
                        ),
                    )
                    .for("update");

                if (!account || account.disabled || account.id !== reservation.identityId)
                {
                    throw new HttpError(403, "Identity unavailable");
                }

                const [row] = await tx
                    .select()
                    .from(character_provisioning)
                    .where(
                        and(
                            eq(character_provisioning.identityId, account.id),
                            eq(character_provisioning.kingdomId, reservation.kingdomId),
                        ),
                    )
                    .for("update");

                if (!row)
                {
                    throw new Error("Missing character reservation");
                }

                const stored = JSON.parse(row.payload) as CharacterReservation;

                if (
                    receipt.gameUid !== row.gameUid
                    || receipt.kingdomId !== row.kingdomId
                    || receipt.requestHash !== provisionHash(stored)
                    || provisionHash(reservation) !== receipt.requestHash
                )
                {
                    throw new Error("Character receipt mismatch");
                }

                if (row.state === 1)
                {
                    return { gameUid: row.gameUid, kingdomId: row.kingdomId, state: "ready" };
                }

                const timestamp = BigInt(now());
                await tx.insert(account_new).values({
                    gameUid: row.gameUid,
                    server: String(row.kingdomId),
                    uuid: stored.deviceUuid,
                    country: stored.country,
                    pf: "Google",
                    gameUserName: stored.name,
                    gameUserLevel: 1,
                    lastTime: timestamp,
                    active: 0,
                });
                await tx.insert(usermapping).values([
                    {
                        gameUid: row.gameUid,
                        mappingType: "device",
                        mappingValue: stored.deviceUuid,
                        lastTime: timestamp,
                        active: 0,
                    },
                    {
                        gameUid: row.gameUid,
                        mappingType: "name",
                        mappingValue: stored.name,
                        lastTime: timestamp,
                        active: 0,
                    },
                ]);
                await tx
                    .update(character_provisioning)
                    .set({ state: 1, activatedAt: timestamp })
                    .where(
                        and(
                            eq(character_provisioning.identityId, account.id),
                            eq(character_provisioning.kingdomId, row.kingdomId),
                        ),
                    );

                return { gameUid: row.gameUid, kingdomId: row.kingdomId, state: "ready" };
            });
        },
    };
}
