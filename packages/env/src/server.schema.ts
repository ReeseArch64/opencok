import { z } from "zod";
import { blankToUndefined, validateEnvironment } from "./validation";

const port = (fallback: number) => z.coerce.number().int().min(0).max(65535).default(fallback);
const databaseName = z.string().regex(/^[a-z][a-z0-9_]{0,62}$/);

export const serverSchema = z
  .object({
    GAME_HOST: z.string().min(1).default("127.0.0.1"),
    GAME_PORT: port(19933),
    GAME_HEALTH_PORT: port(18090),
    KINGDOM_ID: z.coerce.number().int().positive().max(2147483647).default(1),
    KINGDOM_DATABASE_NAME: z.preprocess(blankToUndefined, databaseName.optional()),
    GLOBAL_DATABASE_NAME: databaseName.default("opencok_global"),
    GAME_REDIS_URL: z.url({ protocol: /^rediss?$/ }).default("redis://127.0.0.1:6379/0"),
    GAME_ZOOKEEPER: z.string().min(1).default("127.0.0.1:2181"),
    GAME_LOGIN_SECRET: z.string().min(1),
    GAME_RESOURCES: z.string().trim().min(1),
    GAME_MAP_SIZE: z.coerce.number().int().min(100).max(4000).default(1200),
    DEPENDENCY_TIMEOUT_MS: z.coerce.number().int().min(100).max(30000).default(5000),
  })
  .readonly();

export type ServerEnvironment = z.infer<typeof serverSchema>;
export const parseServerEnvironment = (source: Readonly<Record<string, string | undefined>>) =>
  validateEnvironment(serverSchema, source);
