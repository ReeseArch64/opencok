import { sql } from "drizzle-orm";
import { bigint, check, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { bytea } from "../../types";
import { opencok_kingdom } from "../namespaces";

export const alliance_stats = opencok_kingdom.table("alliance_stats", {
  "uid": varchar("uid", { length: 255 }).notNull(),
  "event_type": integer("event_type"),
  "fromUser": varchar("fromUser", { length: 255 }),
  "toUser": varchar("toUser", { length: 255 }),
  "createTime": bigint("createTime", { mode: "bigint" }),
  "extraParam": bytea("extraParam"),
}, (table) => [
  primaryKey({ name: "alliance_stats_PRIMARY", columns: [table["uid"]] }),
  check("alliance_stats_extraParam_length", sql.raw("octet_length(\"extraParam\") <= 65535")),
]);
