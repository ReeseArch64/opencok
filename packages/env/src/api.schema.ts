import { z } from "zod";
import { blankToUndefined, validateEnvironment } from "./validation";

import { port, timeout, redisUrl, realmSettings } from "./service.schema";

const optionalPath = z.preprocess(blankToUndefined, z.string().optional());
export const apiSchema = z
  .object({
    ...realmSettings,
    API_HOST: z.string().min(1).default("127.0.0.1"),
    API_PORT: port(8082),
    API_DEPENDENCY_TIMEOUT_MS: timeout(3000),
    API_REDIS_URL: redisUrl,
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
  })
  .readonly();

export type ApiEnvironment = z.infer<typeof apiSchema>;
export const parseApiEnvironment = (source: Readonly<Record<string, string | undefined>>) =>
  validateEnvironment(apiSchema, source);
