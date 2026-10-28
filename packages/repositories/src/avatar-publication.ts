import { sql } from "drizzle-orm";
import type { Database } from "./game.ts";

type Transaction = Parameters<Parameters<Database["kingdom"]["db"]["transaction"]>[0]>[0];

export async function nextAvatarRevision(tx: Transaction, owner: string): Promise<bigint>
{
    const result = await tx.execute<{ revision: string; }>(sql`
    insert into opencok_kingdom.avatar_publication ("ownerUid", revision) values (${owner}, 1)
    on conflict ("ownerUid") do update set revision=opencok_kingdom.avatar_publication.revision+1
    returning revision::text`);
    const value = result.rows[0]?.revision;

    if (result.rows.length !== 1 || typeof value !== "string" || !/^[1-9][0-9]*$/.test(value))
    {
        throw new Error("Invalid avatar publication revision");
    }

    const revision = BigInt(value);

    if (revision > 9223372036854775807n)
    {
        throw new Error("Avatar publication exhausted");
    }

    return revision;
}
