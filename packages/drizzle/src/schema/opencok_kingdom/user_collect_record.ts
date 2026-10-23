import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const user_collect_record = opencok_kingdom.table("user_collect_record", {
  "uid": varchar("uid", { length: 255 }).notNull(),
  "resource": integer("resource").default(sql.raw("0")),
  "killPeople": integer("killPeople"),
  "train": integer("train"),
  "lastKillTime": bigint("lastKillTime", { mode: "bigint" }),
  "sockByResource": integer("sockByResource"),
  "sockByKill": integer("sockByKill"),
  "sockByTrain": integer("sockByTrain"),
}, (table) => [
  primaryKey({ name: "user_collect_record_PRIMARY", columns: [table["uid"]] }),
]);
