import { sql } from "drizzle-orm";
import { index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const score_act_record = opencok_kingdom.table(
    "score_act_record",
    {
        "uid": varchar("uid", { length: 255 }).notNull(),
        "actId": varchar("actId", { length: 40 }).notNull(),
        "level": integer("level"),
        "score": integer("score").notNull().default(sql.raw("0")),
        "finishFlag": integer("finishFlag").default(sql.raw("0")),
        "rewardFlag": varchar("rewardFlag", { length: 255 }),
    },
    (table) => [
        primaryKey({ name: "score_act_record_PRIMARY", columns: [table["uid"], table["actId"]] }),
        index("score_act_record_actid_idx").on(sql.raw("\"actId\"")),
        index("score_act_record_rw_idx").on(sql.raw("\"rewardFlag\"")),
        index("score_act_record_lv_idx").on(sql.raw("\"level\"")),
    ],
);
