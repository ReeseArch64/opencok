import { parseArgs } from "node:util";

export function persistenceOptions()
{
    const { values } = parseArgs({
        args: Bun.argv.slice(2),
        options: {
            "postgres-host": { type: "string", default: "localhost" },
            "postgres-port": { type: "string", default: "5432" },
            "mongodb-uri": {
                type: "string",
                default: "mongodb://mongo:mongo@127.0.0.1:27017/?authSource=admin",
            },
            "redis-url": {
                type: "string",
                default: process.env.REDIS_URL ?? "redis://127.0.0.1:6379",
            },
        },
        strict: true,
        allowPositionals: false,
    });
    const port = Number(values["postgres-port"]);
    if (!Number.isInteger(port) || port < 1 || port > 65535)
    {
        throw new Error("Porta PostgreSQL inválida");
    }
    return {
        postgres: { host: values["postgres-host"], port },
        mongodbUri: values["mongodb-uri"],
        redisUrl: values["redis-url"],
    };
}
