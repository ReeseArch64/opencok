// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const server_transfer = cokdb1.table("server_transfer", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "cdTime": bigint("cdTime", { mode: "bigint" }),
  "transferTime": bigint("transferTime", { mode: "bigint" }),
  "times": integer("times"),
  "beforeServers": legacyText("beforeServers", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).default(sql.raw("''")),
}, (table) => [
  primaryKey({ name: "server_transfer_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("server_transfer_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
