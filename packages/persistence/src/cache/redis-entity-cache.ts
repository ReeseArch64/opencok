import { randomUUID } from "node:crypto";
import type { CacheCodec, EntityCache } from "../interfaces/cache";
import type { RepositoryCacheOptions } from "../types/repository-options";
import { repositoryConfig } from "../config/repositories";
import { cacheTtlValidator, publicIdValidator } from "../validators/repository";

const commitLoad = `
if redis.call('GET', KEYS[2]) == ARGV[1] then
    redis.call('SET', KEYS[1], ARGV[2], 'EX', ARGV[3])
    redis.call('DEL', KEYS[2])
    return 1
end
return 0`;

export class RedisEntityCache<T> implements EntityCache<T>
{
    private readonly ttlSeconds: number;
    constructor(
        private readonly namespace: string,
        private readonly codec: CacheCodec<T>,
        private readonly options: RepositoryCacheOptions,
    )
    {
        this.ttlSeconds = cacheTtlValidator.parse(
            options.ttlSeconds ?? repositoryConfig.cacheTtlSeconds,
        );
    }
    private key(publicId: string): string
    {
        return `${repositoryConfig.cacheKeyPrefix}:${this.namespace}:{${
            publicIdValidator.parse(publicId)
        }}`;
    }
    async remember(publicId: string, load: () => Promise<T | null>): Promise<T | null>
    {
        const key = this.key(publicId);
        const token = randomUUID();
        let canCache = false;
        try
        {
            const cached = await this.options.client.get(key);
            if (cached !== null)
            {
                return this.codec.decode(cached);
            }
            await this.options.client.send("SET", [
                `${key}:load`,
                token,
                "EX",
                String(this.ttlSeconds),
            ]);
            canCache = true;
        }
        catch (error)
        {
            this.options.onError?.(error);
        }
        const value = await load();
        if (canCache && value !== null)
        {
            try
            {
                await this.options.client.send("EVAL", [
                    commitLoad,
                    "2",
                    key,
                    `${key}:load`,
                    token,
                    this.codec.encode(value),
                    String(this.ttlSeconds),
                ]);
            }
            catch (error)
            {
                this.options.onError?.(error);
            }
        }
        return value;
    }
    async invalidate(publicId: string): Promise<void>
    {
        const key = this.key(publicId);
        try
        {
            await this.options.client.send("DEL", [key, `${key}:load`]);
        }
        catch (error)
        {
            this.options.onError?.(error);
        }
    }
}
