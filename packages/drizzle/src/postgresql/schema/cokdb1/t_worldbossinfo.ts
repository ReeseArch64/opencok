// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, check, integer, primaryKey, smallint, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const t_worldbossinfo = cokdb1.table("t_worldbossinfo", {
  "id": legacyText("id", {"sqlType":"character varying(36)","collation":"C"}).notNull(),
  "bossid": integer("bossid"),
  "level": smallint("level"),
  "type": smallint("type"),
  "weeklyresettime": bigint("weeklyresettime", { mode: "bigint" }),
  "weeklytimes": smallint("weeklytimes"),
  "dailyresettime": bigint("dailyresettime", { mode: "bigint" }),
  "dailytimes": smallint("dailytimes"),
}, (table) => [
  primaryKey({ name: "t_worldbossinfo_PRIMARY", columns: [table["id"]] }),
  uniqueIndex("t_worldbossinfo_PRIMARY_pad").on(sql.raw("rtrim(\"id\", ' ') COLLATE \"C\"")),
  check("t_worldbossinfo_type_range", sql.raw("\"type\" BETWEEN -128 AND 127")),
]);
