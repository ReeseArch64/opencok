import { eq, sql } from "drizzle-orm";
import { expedition_score_owner } from "@opencok/drizzle/schema/opencok_global/expedition_score_owner";
import type { RealmAuthority } from "./realm-authority";
import type { DatabaseClient } from "@opencok/drizzle/contracts/database";

type GlobalTransaction = Parameters<
    Parameters<DatabaseClient<"global">["transaction"]>[0]
>[0];

export async function expeditionScoreVersion(tx: GlobalTransaction, authority: RealmAuthority)
{
    let [owner] = await tx
        .select()
        .from(expedition_score_owner)
        .where(eq(expedition_score_owner.kingdomId, authority.kingdomId))
        .for("update");

    if (
        owner
        && (owner.ownerEpoch > authority.epoch
            || (owner.ownerEpoch === authority.epoch && owner.instanceId !== authority.instance))
    )
    {
        throw new Error("Stale global expedition publisher");
    }

    if (!owner)
    {
        [owner] = await tx
            .insert(expedition_score_owner)
            .values({
                kingdomId: authority.kingdomId,
                ownerEpoch: authority.epoch,
                instanceId: authority.instance,
                sequence: 0n,
            })
            .returning();
    }
    else if (owner.ownerEpoch < authority.epoch)
    {
        [owner] = await tx
            .update(expedition_score_owner)
            .set({ ownerEpoch: authority.epoch, instanceId: authority.instance, sequence: 0n })
            .where(eq(expedition_score_owner.kingdomId, authority.kingdomId))
            .returning();
    }

    const [version] = await tx
        .update(expedition_score_owner)
        .set({ sequence: sql`${expedition_score_owner.sequence}+1` })
        .where(eq(expedition_score_owner.kingdomId, authority.kingdomId))
        .returning();

    if (!version)
    {
        throw new Error("Missing expedition publisher version");
    }

    return version;
}
