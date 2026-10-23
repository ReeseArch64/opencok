// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_region_recall = cokdb1.table("user_region_recall", {
  "uid": legacyText("uid", {"sqlType":"character varying(32)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
  "level": integer("level"),
  "ladder": integer("ladder"),
  "receivedaynum": integer("receivedaynum"),
  "receivetime": bigint("receivetime", { mode: "bigint" }),
  "begintime": bigint("begintime", { mode: "bigint" }),
  "endtime": bigint("endtime", { mode: "bigint" }),
  "country": legacyText("country", {"sqlType":"character varying(32)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
  "reward": legacyText("reward", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
}, (table) => [
  primaryKey({ name: "user_region_recall_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("user_region_recall_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
