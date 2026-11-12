import type { RedisClient } from "bun";
import type { CacheErrorHandler } from "../interfaces/cache";

export type RepositoryCacheOptions = {
    client: Pick<RedisClient, "get" | "send">;
    ttlSeconds?: number;
    onError?: CacheErrorHandler;
};
export type RepositoryOptions = { cache?: RepositoryCacheOptions; };
