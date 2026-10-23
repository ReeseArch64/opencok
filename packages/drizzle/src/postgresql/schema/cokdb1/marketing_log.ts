// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const marketing_log = cokdb1.table("marketing_log", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "id": legacyText("id", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "network": legacyText("network", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
  "time": bigint("time", { mode: "bigint" }),
  "deviceId": legacyText("deviceId", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
}, (table) => [
  primaryKey({ name: "marketing_log_PRIMARY", columns: [table["uid"], table["id"], table["network"]] }),
  uniqueIndex("marketing_log_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"id\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"network\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
