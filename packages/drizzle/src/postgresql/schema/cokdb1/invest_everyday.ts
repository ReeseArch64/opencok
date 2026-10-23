// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const invest_everyday = cokdb1.table("invest_everyday", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
  "tableid": integer("tableid").notNull(),
  "level": integer("level").notNull(),
  "isreceive": legacyText("isreceive", {"sqlType":"character varying(128)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
  "beginTime": bigint("beginTime", { mode: "bigint" }).default(sql.raw("0")),
  "receiveTime": bigint("receiveTime", { mode: "bigint" }).default(sql.raw("0")),
  "endactive": integer("endactive").default(sql.raw("0")),
  "promptTime": bigint("promptTime", { mode: "bigint" }).default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "invest_everyday_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("invest_everyday_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
