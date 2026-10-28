import { eq } from "drizzle-orm";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { user_resource } from "@opencok/drizzle/schema/opencok_kingdom/user_resource";
import type { MutationCommand, MutationEvent, EconomyPosting } from "@opencok/contracts/mutation";
import { validatePosting } from "@opencok/ledger/posting";
import { createMutationExecutor } from "./mutation.ts";
import type { RealmAuthority } from "./realm-authority.ts";
import type { DatabaseClient } from "@opencok/drizzle/contracts/database";

const profileAssets = [
    "gold",
    "paidGold",
    "paidSpecialGold",
    "dmmGold",
    "dmmPaidGold",
    "dmmPaidSpecialGold",
] as const;

const resourceAssets = [
    "wood",
    "stone",
    "iron",
    "food",
    "woodbind",
    "stonebind",
    "ironbind",
    "foodbind",
] as const;

export type EconomyAsset =
    | `profile.${(typeof profileAssets)[number]}`
    | `resource.${(typeof resourceAssets)[number]}`;

export interface EconomyPlan
{
    changes: readonly { asset: EconomyAsset; delta: bigint; reason: string; }[];
    response: Uint8Array;
    events?: readonly MutationEvent[];
}

export function createEconomyMutationExecutor(
    db: DatabaseClient<"kingdom">,
    authority: RealmAuthority,
    now = Date.now,
)
{
    const execute = createMutationExecutor(db, authority, now);

    return (
        input: MutationCommand,
        plan: (balances: Readonly<Record<EconomyAsset, bigint>>) => Promise<EconomyPlan>,
    ) => {
        const command = { ...input, request: Buffer.from(input.request) };

        return execute(command, async (tx) => {
            const [profile] = await tx
                .select()
                .from(userprofile)
                .where(eq(userprofile.uid, command.owner))
                .for("update");
            const [resource] = await tx
                .select()
                .from(user_resource)
                .where(eq(user_resource.uid, command.owner))
                .for("update");

            if (!profile || !resource)
            {
                throw new Error("Missing economic account");
            }

            const balances = {} as Record<EconomyAsset, bigint>;

            for (const asset of profileAssets)
            {
                balances[`profile.${asset}`] = profile[asset] ?? 0n;
            }

            for (const asset of resourceAssets)
            {
                balances[`resource.${asset}`] = resource[asset] ?? 0n;
            }

            const result = await plan(Object.freeze(balances));

            if (result.changes.length > 256)
            {
                throw new Error("Economic posting limit exceeded");
            }

            const postings: EconomyPosting[] = [];
            const profileUpdate: Partial<typeof userprofile.$inferInsert> = {};
            const resourceUpdate: Partial<typeof user_resource.$inferInsert> = {};
            const seen = new Set<string>();

            for (const change of result.changes)
            {
                if (
                    !Object.hasOwn(balances, change.asset)
                    || seen.has(change.asset)
                    || typeof change.delta !== "bigint"
                )
                {
                    throw new Error("Invalid economic asset");
                }

                seen.add(change.asset);
                const before = balances[change.asset];
                const posting = {
                    account: command.owner,
                    asset: change.asset,
                    before,
                    after: before + change.delta,
                    reason: change.reason,
                };
                validatePosting(posting);
                postings.push(posting);
                const field = change.asset.split(".")[1]!;

                if (change.asset.startsWith("profile."))
                {
                    Object.assign(profileUpdate, { [field]: posting.after });
                }
                else
                {
                    Object.assign(resourceUpdate, { [field]: posting.after });
                }
            }

            if (Object.keys(profileUpdate).length)
            {
                await tx.update(userprofile).set(profileUpdate).where(
                    eq(userprofile.uid, command.owner),
                );
            }

            if (Object.keys(resourceUpdate).length)
            {
                await tx
                    .update(user_resource)
                    .set(resourceUpdate)
                    .where(eq(user_resource.uid, command.owner));
            }

            return { response: result.response, postings, events: result.events };
        });
    };
}
