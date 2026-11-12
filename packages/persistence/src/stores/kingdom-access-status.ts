import type { RedisClient } from "bun";
import { KingdomAccessStatus } from "../enums/kingdom-access-status";
import { kingdomDatabase } from "../factories/kingdom-database";

export const kingdomAccessStatusTtlSeconds = 60;

export function kingdomAccessStatusKey(kingdomId: number): string
{
    return `opencok:global:${kingdomDatabase(kingdomId)}:access-status`;
}

export class KingdomAccessStatusStore
{
    constructor(private readonly client: Pick<RedisClient, "get" | "send" | "del">)
    {}

    async get(kingdomId: number): Promise<KingdomAccessStatus>
    {
        const value = await this.client.get(kingdomAccessStatusKey(kingdomId));
        return Object.values(KingdomAccessStatus).includes(value as KingdomAccessStatus)
            ? value as KingdomAccessStatus
            : KingdomAccessStatus.Closed;
    }

    async set(
        kingdomId: number,
        status: KingdomAccessStatus,
        ttlSeconds = kingdomAccessStatusTtlSeconds,
        onlyIfMissing = false,
    ): Promise<void>
    {
        const key = kingdomAccessStatusKey(kingdomId);
        if (!Object.values(KingdomAccessStatus).includes(status))
        {
            throw new RangeError("Status de acesso ao reino inválido");
        }
        if (!Number.isSafeInteger(ttlSeconds) || ttlSeconds < 1)
        {
            throw new RangeError("TTL do status de acesso inválido");
        }
        await this.client.send("SET", [
            key,
            status,
            "EX",
            String(ttlSeconds),
            ...(onlyIfMissing ? ["NX"] : []),
        ]);
    }

    async clear(kingdomId: number): Promise<void>
    {
        await this.client.del(kingdomAccessStatusKey(kingdomId));
    }
}
