// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { bigint, integer, primaryKey } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";
export const time_notice = cokdb1.table("time_notice", {
  "timeType": integer("timeType").notNull(),
  "timeVal": bigint("timeVal", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "time_notice_PRIMARY", columns: [table["timeType"]] }),
]);
