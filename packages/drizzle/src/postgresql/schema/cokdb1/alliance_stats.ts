// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, check, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyBytes, legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const alliance_stats = cokdb1.table("alliance_stats", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"C"}).notNull(),
  "event_type": integer("event_type"),
  "fromUser": legacyText("fromUser", {"sqlType":"character varying(255)","collation":"C"}),
  "toUser": legacyText("toUser", {"sqlType":"character varying(255)","collation":"C"}),
  "createTime": bigint("createTime", { mode: "bigint" }),
  "extraParam": legacyBytes("extraParam"),
}, (table) => [
  primaryKey({ name: "alliance_stats_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("alliance_stats_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"C\"")),
  check("alliance_stats_extraParam_length", sql.raw("octet_length(\"extraParam\") <= 65535")),
]);
