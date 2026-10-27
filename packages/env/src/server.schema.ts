import { z } from "zod";
import { blankToUndefined, validateEnvironment } from "./validation";

import { databaseName, redisUrl, realmSettings, chatUrl } from "./service.schema";

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
    CHAT_URL: chatUrl,
    CHAT_SECRET: z.preprocess(
      (value) => (value === "" ? undefined : value),
      z.string().min(1).optional(),
    ),
    GAME_MAIL_TRANSLATION: z
      .enum(["true", "false"])
      .default("true")
      .transform((value) => value === "true"),
    ...realmSettings,
    KINGDOM_DATABASE_NAME: z.preprocess(blankToUndefined, databaseName.optional()),
    REDIS_URL: redisUrl,
    GAME_ZOOKEEPER: z.string().min(1).default("127.0.0.1:2181"),
    GAME_SECRET: z.string().min(1),
  })
  .refine((settings) => !settings.CHAT_URL || !!settings.CHAT_SECRET, {
    message: "Chat signing secret required",
    path: ["CHAT_SECRET"],
  })
  .refine((settings) => !settings.GAME_AVATAR_CHAT_URL || !!settings.GAME_FILES_URL, {
    path: ["GAME_FILES_URL"],
  })
  .refine((settings) => !settings.GAME_AVATAR_CHAT_URL || !!settings.CHAT_SECRET, {
    path: ["CHAT_SECRET"],
  })
  .readonly();

export type ServerEnvironment = z.infer<typeof serverSchema>;

export const parseServerEnvironment = (source: Readonly<Record<string, string | undefined>>) =>
  validateEnvironment(serverSchema, source);
