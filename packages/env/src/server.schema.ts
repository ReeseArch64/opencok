import { z } from "zod";
import { blankToUndefined, validateEnvironment } from "./validation";

import { timeout, databaseName, redisUrl, realmSettings } from "./service.schema";

export const serverSchema = z
  .object({
    PROVISIONING_SIGNING_SECRET: z.preprocess(blankToUndefined, z.string().min(32).optional()),
    GAME_FILES_URL: z.preprocess(
      blankToUndefined,
      z
        .url({ protocol: /^https?$/ })
        .refine((value) => {
          try {
            const url = new URL(value);

            return (
              url.pathname === "/" && !url.username && !url.password && !url.search && !url.hash
            );
          } catch {
            return false;
          }
        })
        .optional(),
    ),
    GAME_AVATAR_CHAT_URL: z.preprocess(
      blankToUndefined,
      z
        .url({ protocol: /^https?$/ })
        .refine((value) => {
          try {
            const url = new URL(value);

            return (
              url.pathname === "/_internal/avatar-profile" &&
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
    GAME_NICKNAME_CHAT_URL: z.preprocess(
      blankToUndefined,
      z
        .url({ protocol: /^https?$/ })
        .refine((value) => {
          try {
            const url = new URL(value);

            return (
              url.pathname === "/_internal/nickname" &&
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
    GAME_MAIL_CHAT_URL: z.preprocess(
      blankToUndefined,
      z
        .url({ protocol: /^https?$/ })
        .refine((value) => {
          try {
            const url = new URL(value);

            return (
              url.pathname === "/_internal/mailbox" &&
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
    GAME_CHAT_SESSION_URL: z.preprocess(
      blankToUndefined,
      z
        .url({ protocol: /^https?$/ })
        .refine((value) => {
          try {
            const url = new URL(value);

            return (
              url.pathname === "/external/session" &&
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
    CHAT_SIGNING_SECRET: z.preprocess(
      (value) => (value === "" ? undefined : value),
      z.string().min(1).optional(),
    ),
    GAME_MAIL_TRANSLATION: z
      .enum(["true", "false"])
      .default("true")
      .transform((value) => value === "true"),
    GAME_CROSS_SEARCH: z
      .enum(["true", "false"])
      .default("true")
      .transform((value) => value === "true"),
    GAME_CHAT_INTERVAL: z.coerce.number().int().min(0).max(2147483647).default(1),
    GAME_FEED_MAX_COUNT: z.coerce.number().int().min(0).max(2147483647).default(3),
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
    REDIS_URL: redisUrl,
    GAME_ZOOKEEPER: z.string().min(1).default("127.0.0.1:2181"),
    GAME_LOGIN_SECRET: z.string().min(1),
    GAME_MAP_SIZE: z.coerce.number().int().min(100).max(4000).default(1200),
    DEPENDENCY_TIMEOUT_MS: timeout(5000),
  })
  .refine((settings) => !settings.GAME_NICKNAME_CHAT_URL || !!settings.CHAT_SIGNING_SECRET, {
    message: "Nickname chat signing secret required",
    path: ["CHAT_SIGNING_SECRET"],
  })
  .refine((settings) => !settings.GAME_MAIL_CHAT_URL || !!settings.CHAT_SIGNING_SECRET, {
    message: "Mailbox chat signing secret required",
    path: ["CHAT_SIGNING_SECRET"],
  })
  .refine((settings) => !settings.GAME_CHAT_SESSION_URL || !!settings.CHAT_SIGNING_SECRET, {
    path: ["CHAT_SIGNING_SECRET"],
  })
  .refine((settings) => !settings.GAME_AVATAR_CHAT_URL || !!settings.GAME_FILES_URL, {
    path: ["GAME_FILES_URL"],
  })
  .refine((settings) => !settings.GAME_AVATAR_CHAT_URL || !!settings.CHAT_SIGNING_SECRET, {
    path: ["CHAT_SIGNING_SECRET"],
  })
  .readonly();

export type ServerEnvironment = z.infer<typeof serverSchema>;

export const parseServerEnvironment = (source: Readonly<Record<string, string | undefined>>) =>
  validateEnvironment(serverSchema, source);
