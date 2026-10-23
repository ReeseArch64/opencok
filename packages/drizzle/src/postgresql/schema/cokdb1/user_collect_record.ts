// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_collect_record = cokdb1.table("user_collect_record", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "resource": integer("resource").default(sql.raw("0")),
  "killPeople": integer("killPeople"),
  "train": integer("train"),
  "lastKillTime": bigint("lastKillTime", { mode: "bigint" }),
  "sockByResource": integer("sockByResource"),
  "sockByKill": integer("sockByKill"),
  "sockByTrain": integer("sockByTrain"),
}, (table) => [
  primaryKey({ name: "user_collect_record_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("user_collect_record_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
