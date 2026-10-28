import { sql } from "drizzle-orm";
import { bigint, check, integer, primaryKey, uuid, varchar } from "drizzle-orm/pg-core";
import { opencok_global } from "../namespaces";

export const cn1_profile_session = opencok_global.table(
    "cn1_profile_session",
    {
        ownerUid: varchar("ownerUid", { length: 255 }).notNull(),
        isAddict: integer("isAddict").notNull(),
        onlineMinutes: integer("onlineMinutes").notNull().default(sql.raw("0")),
        authAt: bigint("authAt", { mode: "bigint" }).notNull().default(sql.raw("0")),
        sampledAt: bigint("sampledAt", { mode: "bigint" }).notNull().default(sql.raw("0")),
        offlineAt: bigint("offlineAt", { mode: "bigint" }),
        sessionId: uuid("sessionId"),
    },
    (table) => [
        primaryKey({ name: "cn1_profile_session_PRIMARY", columns: [table.ownerUid] }),
        check("cn1_profile_session_mode", sql.raw("\"isAddict\" BETWEEN 0 AND 2")),
    ],
);
