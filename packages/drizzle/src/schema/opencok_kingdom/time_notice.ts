import { bigint, integer, primaryKey } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const time_notice = opencok_kingdom.table(
  "time_notice",
  {
    "timeType": integer("timeType").notNull(),
    "timeVal": bigint("timeVal", { mode: "bigint" }),
  },
  (table) => [primaryKey({ name: "time_notice_PRIMARY", columns: [table["timeType"]] })],
);
