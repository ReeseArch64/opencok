import { RedisClient, type RedisOptions } from "bun";

export async function connectRedis(
    uri = process.env.REDIS_URL ?? "redis://127.0.0.1:6379",
    options: RedisOptions = {},
): Promise<RedisClient>
{
    const client = new RedisClient(uri, {
        connectionTimeout: 5_000,
        maxRetries: 3,
        ...options,
        enableOfflineQueue: false,
    });
    try
    {
        await client.connect();
        return client;
    }
    catch (error)
    {
        client.close();
        throw error;
    }
}
