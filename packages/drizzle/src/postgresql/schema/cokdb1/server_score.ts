// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const server_score = cokdb1.table("server_score", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
  "id": integer("id").notNull(),
  "activity": legacyText("activity", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
  "readyTime": bigint("readyTime", { mode: "bigint" }),
  "beginTime": bigint("beginTime", { mode: "bigint" }),
  "endTime": bigint("endTime", { mode: "bigint" }),
  "rewad": integer("rewad").default(sql.raw("0")),
  "round": integer("round").default(sql.raw("1")),
}, (table) => [
  primaryKey({ name: "server_score_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("server_score_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
