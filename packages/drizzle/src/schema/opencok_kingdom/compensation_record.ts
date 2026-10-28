import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const compensation_record = opencok_kingdom.table(
    "compensation_record",
    {
        "uid": varchar("uid", { length: 255 }).notNull(),
        "count": integer("count").default(sql.raw("0")),
        "lastCompensateTime": bigint("lastCompensateTime", { mode: "bigint" }),
        "isFirstOnFire": integer("isFirstOnFire").default(sql.raw("1")),
    },
    (table) => [
        primaryKey({ name: "compensation_record_PRIMARY", columns: [table["uid"]] }),
        index("compensation_record_time_index").on(sql.raw("\"lastCompensateTime\"")),
    ],
);
