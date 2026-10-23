import { z } from "zod";

export const port = (fallback: number) =>
  z.coerce.number().int().min(0).max(65535).default(fallback);
export const timeout = (fallback: number) =>
  z.coerce.number().int().min(100).max(30000).default(fallback);
export const databaseName = z.string().regex(/^[a-z][a-z0-9_]{0,62}$/);
export const redisUrl = z.url({ protocol: /^rediss?$/ }).default("redis://127.0.0.1:6379/0");
export const realmSettings = {
  KINGDOM_ID: z.coerce.number().int().positive().max(2147483647).default(1),
  GLOBAL_DATABASE_NAME: databaseName.default("opencok_global"),
};
