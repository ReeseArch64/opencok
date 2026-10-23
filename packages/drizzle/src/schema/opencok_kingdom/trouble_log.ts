import { sql } from "drizzle-orm";
import { bigint, index, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const trouble_log = opencok_kingdom.table("trouble_log", {
  "uid": bigint("uid", { mode: "bigint" }),
  "username": varchar("username", { length: 255 }),
  "usetime": bigint("usetime", { mode: "bigint" }),
  "statusid": varchar("statusid", { length: 255 }),
}, (_table) => [
  index("trouble_log_trouble_log_uid_index").on(sql.raw("\"uid\"")),
]);
