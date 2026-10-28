import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const pic_upload_record = opencok_kingdom.table(
    "pic_upload_record",
    {
        "uid": varchar("uid", { length: 255 }).notNull(),
        "picVer": integer("picVer").default(sql.raw("0")),
        "updateTime": bigint("updateTime", { mode: "bigint" }).default(
            sql.raw("9223372036854775807"),
        ),
        "report": integer("report").default(sql.raw("0")),
        "banCount": integer("banCount").default(sql.raw("0")),
        "banTime": bigint("banTime", { mode: "bigint" }).default(sql.raw("0")),
        "stat": integer("stat").default(sql.raw("0")),
    },
    (table) => [
        primaryKey({ name: "pic_upload_record_PRIMARY", columns: [table["uid"]] }),
        index("pic_upload_record_time_idx").on(sql.raw("\"updateTime\"")),
        index("pic_upload_record_report_idx").on(sql.raw("\"report\"")),
        index("pic_upload_record_stat_idx").on(sql.raw("\"stat\"")),
    ],
);
