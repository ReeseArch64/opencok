// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_gift = cokdb1.table("user_gift", {
  "uuid": legacyText("uuid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "giftId": legacyText("giftId", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "allianceId": legacyText("allianceId", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "gifttype": integer("gifttype").notNull(),
  "valid": integer("valid").notNull().default(sql.raw("1")),
  "level": integer("level"),
  "item": legacyText("item", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "num": integer("num"),
  "para": integer("para").default(sql.raw("0")),
  "time": bigint("time", { mode: "bigint" }).notNull(),
  "expiretime": integer("expiretime"),
  "exp": integer("exp").default(sql.raw("0")),
  "description": legacyText("description", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
}, (table) => [
  primaryKey({ name: "user_gift_PRIMARY", columns: [table["uuid"]] }),
  uniqueIndex("user_gift_PRIMARY_pad").on(sql.raw("rtrim(\"uuid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
