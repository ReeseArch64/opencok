import { z } from "zod";
import { blankToUndefined, validateEnvironment } from "./validation";

const optionalPath = z.preprocess(blankToUndefined, z.string().optional());
export const apiSchema = z
  .object({
    KINGDOM_ID: z.coerce.number().int().positive().max(2147483647).default(1),
    API_HOST: z.string().min(1).default("127.0.0.1"),
    API_PORT: z.coerce.number().int().min(0).max(65535).default(8082),
    API_DEPENDENCY_TIMEOUT_MS: z.coerce.number().int().min(100).max(30000).default(3000),
    API_REDIS_URL: z.url({ protocol: /^rediss?$/ }).default("redis://127.0.0.1:6379/0"),
    API_SERVERS_FILE: optionalPath,
    API_GAME_HOST: z.preprocess(
      blankToUndefined,
      z
        .string()
        .regex(/^[a-zA-Z0-9._:-]+$/)
        .refine((value) => !["0.0.0.0", "::"].includes(value))
        .optional(),
    ),
    API_GAME_PORT: z.preprocess(
      blankToUndefined,
      z.coerce.number().int().min(1).max(65535).optional(),
    ),
    GLOBAL_DATABASE_NAME: z
      .string()
      .regex(/^[a-z][a-z0-9_]{0,62}$/)
      .default("opencok_global"),
  })
  .readonly();

export type ApiEnvironment = z.infer<typeof apiSchema>;
export const parseApiEnvironment = (source: Readonly<Record<string, string | undefined>>) =>
  validateEnvironment(apiSchema, source);
