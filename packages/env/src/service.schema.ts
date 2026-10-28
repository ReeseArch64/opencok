import { z } from "zod";
import { blankToUndefined } from "./validation";

export const port = (fallback: number) =>
    z.coerce.number().int().min(0).max(65535).default(fallback);

export const timeout = (fallback: number) =>
    z.coerce.number().int().min(100).max(30000).default(fallback);

export const databaseName = z.string().regex(/^[a-z][a-z0-9_]{0,62}$/);

export const redisUrl = z.url({ protocol: /^rediss?$/ }).default("redis://127.0.0.1:6379/0");

export const chatUrl = z.preprocess(
    blankToUndefined,
    z
        .url({ protocol: /^https?$/ })
        .refine((value) => {
            try
            {
                const url = new URL(value);

                return (
                    url.pathname === "/"
                    && !url.username
                    && !url.password
                    && !url.search
                    && !url.hash
                    && url.hostname !== "cok.chat"
                    && !url.hostname.endsWith(".cok.chat")
                );
            }
            catch
            {
                return false;
            }
        })
        .optional(),
);

export const realmSettings = {
    KINGDOM_ID: z.coerce.number().int().positive().max(2147483647).default(1),
    GLOBAL_DATABASE_NAME: databaseName.default("opencok_global"),
};

export const chatMailboxSecrets = z.preprocess(
    (value) => {
        const source = blankToUndefined(value);
        if (typeof source !== "string")
        {
            return source;
        }
        try
        {
            return JSON.parse(source);
        }
        catch
        {
            return source;
        }
    },
    z.record(
        z.string().regex(/^[1-9][0-9]{0,9}$/).refine((value) => Number(value) <= 2147483647),
        z.string().min(1),
    ).refine((value) => new Set(Object.values(value)).size === Object.keys(value).length)
        .optional(),
);
