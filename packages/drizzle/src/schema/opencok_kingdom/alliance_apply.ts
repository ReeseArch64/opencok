import { sql } from "drizzle-orm";
import { bigint, check, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { bytea } from "../../types";
import { opencok_kingdom } from "../namespaces";

export const alliance_apply = opencok_kingdom.table(
  "alliance_apply",
  {
    "uid": varchar("uid", { length: 40 }).notNull(),
    "userId": varchar("userId", { length: 40 }),
    "allianceId": varchar("allianceId", { length: 40 }),
    "message": bytea("message"),
    "type": integer("type"),
    "applyTime": bigint("applyTime", { mode: "bigint" }).default(sql.raw("0")),
  },
  (table) => [
    primaryKey({ name: "alliance_apply_PRIMARY", columns: [table["uid"]] }),
    index("alliance_apply_index_user").on(sql.raw('"userId"')),
    index("alliance_apply_index_alliance").on(sql.raw('"allianceId"')),
    index("alliance_apply_index_time").on(sql.raw('"applyTime"')),
    check("alliance_apply_message_length", sql.raw('octet_length("message") <= 65535')),
  ],
);
