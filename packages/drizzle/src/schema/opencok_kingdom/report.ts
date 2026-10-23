import { sql } from "drizzle-orm";
import { bigint, check, index, primaryKey, varchar } from "drizzle-orm/pg-core";
import { bytea } from "../../types";
import { opencok_kingdom } from "../namespaces";

export const report = opencok_kingdom.table(
  "report",
  {
    "uid": varchar("uid", { length: 40 }).notNull(),
    "createTime": bigint("createTime", { mode: "bigint" }).notNull(),
    "report": bytea("report").notNull(),
  },
  (table) => [
    primaryKey({ name: "report_PRIMARY", columns: [table["uid"]] }),
    index("report_index_time").on(sql.raw('"createTime"')),
    check("report_report_length", sql.raw('octet_length("report") <= 16777215')),
  ],
);
