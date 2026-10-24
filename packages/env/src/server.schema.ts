import { z } from "zod";
import { blankToUndefined, validateEnvironment } from "./validation";

import { port, timeout, databaseName, redisUrl, realmSettings } from "./service.schema";

export const serverSchema = z
  .object({
    GAME_MAIL_TRANSLATION: z
      .enum(["true", "false"])
      .default("true")
      .transform((value) => value === "true"),
    GAME_HOST: z.string().min(1).default("127.0.0.1"),
    GAME_PORT: port(19933),
    GAME_HEALTH_PORT: port(18090),
    ...realmSettings,
    KINGDOM_DATABASE_NAME: z.preprocess(blankToUndefined, databaseName.optional()),
    GAME_PLAYER_KINGDOMS: z.preprocess(
      blankToUndefined,
      z
        .string()
        .transform((value) =>
          value.split(",").map((entry) => {
            const parts = entry.split(":");
            return { id: Number(parts[0]), database: parts.length === 2 ? parts[1] : undefined };
          }),
        )
        .pipe(
          z
            .array(
              z.object({
                id: z.number().int().positive().max(2147483647),
                database: databaseName,
              }),
            )
            .min(1)
            .max(2)
            .refine(
              (realms) =>
                new Set(realms.map((realm) => realm.id)).size === realms.length &&
                new Set(realms.map((realm) => realm.database)).size === realms.length,
            ),
        )
        .optional(),
    ),
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
