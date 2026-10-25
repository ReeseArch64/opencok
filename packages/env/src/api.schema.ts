import { z } from "zod";
import { blankToUndefined, validateEnvironment } from "./validation";

import { port, timeout, redisUrl, realmSettings } from "./service.schema";

const optionalPath = z.preprocess(blankToUndefined, z.string().optional());
export const apiSchema = z
  .object({
    ...realmSettings,
    FIREBASE_PROJECT_ID: z.preprocess(
      blankToUndefined,
      z
        .string()
        .regex(/^[a-z][a-z0-9-]{4,61}[a-z0-9]$/)
        .optional(),
    ),
    PROVISIONING_SIGNING_SECRET: z.preprocess(blankToUndefined, z.string().min(32).optional()),
    API_PROVISIONING_REALMS: z.preprocess(
      blankToUndefined,
      z
        .string()
        .transform((value, ctx) => {
          try {
            return JSON.parse(value) as unknown;
          } catch {
            ctx.addIssue({ code: "custom", message: "Invalid realm configuration" });
            return z.NEVER;
          }
        })
        .pipe(
          z
            .array(
              z.strictObject({
                id: z.number().int().positive().max(2147483647),
                url: z.url({ protocol: /^https?$/ }).refine((value) => {
                  const url = new URL(value);
                  return (
                    url.pathname === "/_internal/characters" &&
                    !url.username &&
                    !url.password &&
                    !url.search &&
                    !url.hash
                  );
                }),
              }),
            )
            .min(1)
            .max(2)
            .refine((realms) => new Set(realms.map((realm) => realm.id)).size === realms.length),
        )
        .optional(),
    ),
    API_CHAT_URL: z.preprocess(
      blankToUndefined,
      z
        .url({ protocol: /^https?$/ })
        .refine((value) => {
          try {
            const url = new URL(value);
            return (
              url.pathname === "/" &&
              !url.username &&
              !url.password &&
              !url.search &&
              !url.hash &&
              url.hostname !== "cok.chat" &&
              !url.hostname.endsWith(".cok.chat")
            );
          } catch {
            return false;
          }
        })
        .optional(),
    ),
    API_FILES_ENABLED: z
      .enum(["true", "false"])
      .default("false")
      .transform((value) => value === "true"),
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
  .refine(
    (settings) =>
      [
        settings.FIREBASE_PROJECT_ID,
        settings.PROVISIONING_SIGNING_SECRET,
        settings.API_PROVISIONING_REALMS,
      ].filter(Boolean).length %
        3 ===
      0,
    { message: "Complete provisioning configuration required", path: ["API_PROVISIONING_REALMS"] },
  )
  .readonly();

export type ApiEnvironment = z.infer<typeof apiSchema>;
export const parseApiEnvironment = (source: Readonly<Record<string, string | undefined>>) =>
  validateEnvironment(apiSchema, source);
