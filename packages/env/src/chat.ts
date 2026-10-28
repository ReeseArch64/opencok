import { z } from "zod";
import { loadEnvironment } from "./load";
import { postgresUrl } from "./database.schema";
import { databaseName, chatMailboxSecrets } from "./service.schema";
import { blankToUndefined, validateEnvironment } from "./validation";

export const chatSchema = z.object({
    DATABASE_URL: postgresUrl,
    MONGO_URI: z.preprocess(
        blankToUndefined,
        z
            .url({ protocol: /^mongodb(?:\+srv)?$/ })
            .refine((value) => /^\/[a-zA-Z0-9_-]{1,63}$/.test(new URL(value).pathname))
            .optional(),
    ),
    CHAT_SECRET: z.string().min(1),
    CHAT_MAILBOX_SECRETS: chatMailboxSecrets,
    CHAT_MAILBOX_SECRET: z.preprocess(blankToUndefined, z.string().min(1).optional()),
    GLOBAL_DATABASE_NAME: databaseName.default("opencok_global"),
    CHAT_KINGDOM_DATABASES: z
        .string()
        .default("1:opencok_kingdom_1,2:opencok_kingdom_2")
        .transform((value) =>
            value.split(",").map((entry) => {
                const [id, database] = entry.split(":");

                return { id: Number(id), database };
            })
        )
        .pipe(
            z.array(z.object({ id: z.number().int().positive(), database: databaseName })).min(1),
        ),
}).refine(
    (settings) =>
        Object.values(settings.CHAT_MAILBOX_SECRETS ?? {}).every((secret) =>
            secret !== settings.CHAT_SECRET && secret !== settings.CHAT_MAILBOX_SECRET
        ),
    { path: ["CHAT_MAILBOX_SECRETS"] },
);

export const parseChatEnvironment = (source: Readonly<Record<string, string | undefined>>) =>
    validateEnvironment(chatSchema, source);

export const loadChatEnvironment = () => parseChatEnvironment(loadEnvironment(process.env));
