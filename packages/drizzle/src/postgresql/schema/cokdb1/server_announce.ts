// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, check, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyBytes, legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const server_announce = cokdb1.table("server_announce", {
  "serverId": legacyText("serverId", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "randomGeneral": legacyBytes("randomGeneral"),
  "lastMoniterPushTime": bigint("lastMoniterPushTime", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "server_announce_PRIMARY", columns: [table["serverId"]] }),
  uniqueIndex("server_announce_PRIMARY_pad").on(sql.raw("rtrim(\"serverId\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  check("server_announce_randomGeneral_length", sql.raw("octet_length(\"randomGeneral\") <= 65535")),
]);
