import { z } from "zod";
import { blankToUndefined, validateEnvironment } from "./validation";

import { port, timeout, databaseName, redisUrl, realmSettings } from "./service.schema";

export const serverSchema = z
  .object({
    GAME_HOST: z.string().min(1).default("127.0.0.1"),
    GAME_PORT: port(19933),
    GAME_HEALTH_PORT: port(18090),
    ...realmSettings,
    KINGDOM_DATABASE_NAME: z.preprocess(blankToUndefined, databaseName.optional()),
    GAME_REDIS_URL: redisUrl,
    GAME_ZOOKEEPER: z.string().min(1).default("127.0.0.1:2181"),
    GAME_LOGIN_SECRET: z.string().min(1),
    GAME_RESOURCES: z.string().trim().min(1),
    GAME_MAP_SIZE: z.coerce.number().int().min(100).max(4000).default(1200),
    DEPENDENCY_TIMEOUT_MS: timeout(5000),
  })
  .readonly();

export type ServerEnvironment = z.infer<typeof serverSchema>;
export const parseServerEnvironment = (source: Readonly<Record<string, string | undefined>>) =>
  validateEnvironment(serverSchema, source);
