// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const hero_office = cokdb1.table("hero_office", {
  "id": integer("id").notNull(),
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "officeId": legacyText("officeId", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
  "position": integer("position").default(sql.raw("0")),
  "startTime": bigint("startTime", { mode: "bigint" }).default(sql.raw("0")),
  "lastRefreshExpTime": bigint("lastRefreshExpTime", { mode: "bigint" }).default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "hero_office_PRIMARY", columns: [table["id"], table["uid"]] }),
  uniqueIndex("hero_office_PRIMARY_pad").on(sql.raw("\"id\""), sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("hero_office_uid_index").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
