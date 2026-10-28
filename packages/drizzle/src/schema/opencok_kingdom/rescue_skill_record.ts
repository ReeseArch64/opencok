import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const rescue_skill_record = opencok_kingdom.table(
    "rescue_skill_record",
    {
        "uuid": varchar("uuid", { length: 255 }).notNull(),
        "uid": varchar("uid", { length: 255 }),
        "marchUuid": varchar("marchUuid", { length: 255 }),
        "targetUid": varchar("targetUid", { length: 255 }),
        "marchType": integer("marchType"),
        "targetType": integer("targetType"),
        "attackTime": bigint("attackTime", { mode: "bigint" }),
        "returnTime": bigint("returnTime", { mode: "bigint" }).default(sql.raw("0")),
        "activate": integer("activate").default(sql.raw("0")),
        "saved": integer("saved").default(sql.raw("0")),
        "attack": integer("attack").default(sql.raw("0")),
    },
    (table) => [
        primaryKey({ name: "rescue_skill_record_PRIMARY", columns: [table["uuid"]] }),
        index("rescue_skill_record_uid_idx").on(sql.raw("\"uid\"")),
        index("rescue_skill_record_tuid_idx").on(sql.raw("\"targetUid\"")),
        index("rescue_skill_record_att_time_idx").on(sql.raw("\"attackTime\"")),
        index("rescue_skill_record_return_time_idx").on(sql.raw("\"returnTime\"")),
        index("rescue_skill_record_muid_idx").on(sql.raw("\"marchUuid\"")),
    ],
);
