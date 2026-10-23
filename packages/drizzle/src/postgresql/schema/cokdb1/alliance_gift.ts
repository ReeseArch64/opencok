// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const alliance_gift = cokdb1.table("alliance_gift", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
  "allianceid": legacyText("allianceid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "level": integer("level"),
  "typeId": integer("typeId").notNull(),
  "time": bigint("time", { mode: "bigint" }),
  "expiretime": integer("expiretime"),
}, (table) => [
  primaryKey({ name: "alliance_gift_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("alliance_gift_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
