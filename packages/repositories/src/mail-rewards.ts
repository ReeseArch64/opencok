import type { InventoryPlan } from "@opencok/contracts/inventory";
import type { MutationResult } from "@opencok/ledger/contracts/mutation";
import type { Row } from "@opencok/contracts/rows";
import type { MutationTransaction } from "./mutation";
import { server_info } from "@opencok/drizzle/schema/opencok_global/server_info";
import { and, asc, eq, inArray, lt, gt, or, sql } from "drizzle-orm";
import { mail } from "@opencok/drizzle/schema/opencok_kingdom/mail";
import { mail_update } from "@opencok/drizzle/schema/opencok_kingdom/mail_update";
import { command_receipt } from "@opencok/drizzle/schema/opencok_kingdom/command_receipt";
import type { MailRewardExecutor } from "@opencok/contracts/mail-rewards";
import { GameError } from "@opencok/errors/game";
import { errors, MOBILE_CLIENT_VERSION } from "@opencok/constants/game";
import { versionAtLeast } from "@opencok/rules/availability";
import { createMutationExecutor, appendMutationRecords } from "./mutation.ts";
import { executeInventoryTransaction } from "./inventory.ts";
import type { RealmAuthority } from "./realm-authority.ts";
import type { DatabaseClient } from "@opencok/drizzle/contracts/database";

function category(label: number)
{
    switch (label)
    {
        case 0:
            return or(lt(mail.type, 13), gt(mail.type, 16));
        case 1:
            return inArray(mail.type, [14, 15, 16]);
        case 2:
            return eq(mail.type, 13);
        case 3:
            return inArray(mail.type, [6, 7, 8, 9, 30]);
        case 4:
            return inArray(mail.type, [23, 24]);
        case 5:
            return eq(mail.type, 32);
        case 6:
            return inArray(mail.type, [13, 14, 15, 16]);
        default:
            throw new GameError(errors.invalid);
    }
}

export function createMailRewardExecutor(
    db: DatabaseClient<"kingdom">,
    authority: RealmAuthority,
    now = Date.now,
    allowed: () => Promise<boolean> = async () => true,
    confirmed?: (
        tx: MutationTransaction,
        owner: string,
        entry: Row,
        inventory: InventoryPlan,
        now: number,
    ) => Promise<MutationResult | undefined>,
): MailRewardExecutor
{
    const execute = createMutationExecutor(db, authority, now);

    return async (input, selection, grant, combine) => {
        const command = { ...input, request: Buffer.from(input.request) };
        const ids = [...selection.ids],
            labels = [...selection.labels],
            batch = selection.batch;

        if (
            ids.length > 64
            || labels.length > 7
            || new Set(ids).size !== ids.length
            || ids.some((id) => !id || id.length > 40 || id.includes("\0") || !id.isWellFormed())
            || (!batch && (ids.length !== 1 || labels.length))
        )
        {
            throw new GameError(errors.invalid);
        }

        if (!(await allowed()))
        {
            throw new GameError(errors.unsupported);
        }

        return execute(command, async (tx) => {
            const owner = command.owner;
            const readClaim = async (id: string) => {
                const receipt = (
                    await tx
                        .select()
                        .from(command_receipt)
                        .where(
                            and(
                                eq(command_receipt.kingdomId, authority.kingdomId),
                                eq(command_receipt.ownerUid, owner),
                                eq(command_receipt.requestId, `mail-claim:${id}`),
                            ),
                        )
                )[0];

                if (receipt && receipt.command !== "mail.reward.claim")
                {
                    throw new Error("Mail claim identity conflict");
                }

                return receipt;
            };

            if (!batch)
            {
                const existing = await readClaim(ids[0]!);

                if (existing)
                {
                    return { response: existing.response };
                }
            }

            const filters = [
                ...(ids.length ? [inArray(mail.uid, ids)] : []),
                ...labels.map(category),
            ];
            const entries = filters.length
                ? await tx
                    .select()
                    .from(mail)
                    .where(
                        and(
                            eq(mail.toUser, owner),
                            batch ? eq(mail.rewardStatus, 0) : undefined,
                            or(...filters),
                        ),
                    )
                    .orderBy(asc(mail.uid))
                    .limit(65)
                    .for("update")
                : [];

            if (
                entries.length > 64
                || entries.reduce(
                        (size, entry) => size + Buffer.byteLength(entry.rewardId ?? ""),
                        0,
                    ) > 262144
            )
            {
                throw new GameError(errors.invalid);
            }

            if (!batch && !entries.length)
            {
                throw new GameError(errors.missing);
            }

            const responses: Buffer[] = [],
                claimed: string[] = [];

            for (const entry of entries)
            {
                if (entry.rewardStatus !== 0 || (await readClaim(entry.uid)))
                {
                    if (!batch)
                    {
                        throw new GameError("E100147");
                    }

                    continue;
                }

                if (!entry.rewardId?.trim())
                {
                    if (!batch)
                    {
                        throw new GameError(errors.invalid);
                    }

                    continue;
                }

                if (
                    entry.type === 16
                    && (entry.fromUser === "2.0.8"
                        || !entry.fromUser
                        || !versionAtLeast(MOBILE_CLIENT_VERSION, entry.fromUser))
                )
                {
                    if (!batch)
                    {
                        throw new GameError(errors.unsupported);
                    }

                    continue;
                }

                const captured = now();
                const result = await executeInventoryTransaction(
                    tx,
                    owner,
                    (state) => grant(state, entry, captured),
                    "mail.reward",
                    undefined,
                    undefined,
                    (inventory) =>
                        confirmed?.(tx, owner, entry, inventory, captured)
                            ?? Promise.resolve(undefined),
                );
                await tx
                    .update(mail)
                    .set({ status: 1, rewardStatus: 1 })
                    .where(
                        and(
                            eq(mail.uid, entry.uid),
                            eq(mail.toUser, owner),
                            eq(mail.rewardStatus, 0),
                        ),
                    );
                await tx
                    .insert(mail_update)
                    .values({ toUser: owner, mailUid: entry.uid, updateTime: BigInt(captured) })
                    .onConflictDoUpdate({
                        target: [mail_update.toUser, mail_update.mailUid],
                        set: {
                            updateTime:
                                sql`greatest(${mail_update.updateTime}, excluded."updateTime")`,
                        },
                    });
                const response = await appendMutationRecords(
                    tx,
                    authority,
                    {
                        owner,
                        requestId: `mail-claim:${entry.uid}`,
                        command: "mail.reward.claim",
                        request: Buffer.from(
                            JSON.stringify({
                                uid: entry.uid,
                                reward: entry.rewardId,
                                createTime: String(entry.createTime),
                            }),
                        ),
                    },
                    result,
                    BigInt(captured),
                );
                responses.push(response);
                claimed.push(entry.uid);
            }

            return { response: batch ? combine(responses, claimed) : responses[0]! };
        });
    };
}

export async function mailRewardRealmAllowed(
    db: DatabaseClient<"global">,
    kingdomId: number,
): Promise<boolean>
{
    if (kingdomId > 999999)
    {
        return true;
    }

    const [realm] = await db
        .select({ type: server_info.type })
        .from(server_info)
        .where(eq(server_info.id, kingdomId));

    return realm?.type !== 13 && realm?.type !== 14;
}
