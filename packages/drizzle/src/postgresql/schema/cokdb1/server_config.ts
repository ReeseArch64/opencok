// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const server_config = cokdb1.table("server_config", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"C"}).notNull(),
  "stat": integer("stat").notNull().default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "server_config_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("server_config_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"C\"")),
]);
