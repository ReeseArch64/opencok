import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const alliance_offical_apply = opencok_kingdom.table(
    "alliance_offical_apply",
    {
        "uuid": varchar("uuid", { length: 40 }).notNull(),
        "userId": varchar("userId", { length: 40 }).notNull().default(sql.raw("''")),
        "allianceId": varchar("allianceId", { length: 40 }).notNull().default(sql.raw("''")),
        "applyType": integer("applyType").notNull().default(sql.raw("0")),
        "applyTime": bigint("applyTime", { mode: "bigint" }).notNull().default(sql.raw("0")),
        "operateType": integer("operateType").notNull().default(sql.raw("0")),
        "operateTime": bigint("operateTime", { mode: "bigint" }).notNull().default(sql.raw("0")),
    },
    (table) => [
        primaryKey({ name: "alliance_offical_apply_PRIMARY", columns: [table["uuid"]] }),
        index("alliance_offical_apply_index_user").on(sql.raw("\"userId\"")),
        index("alliance_offical_apply_index_alliance").on(sql.raw("\"allianceId\"")),
    ],
);
