import { sql } from "drizzle-orm";
import { bigint, check, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { bytea } from "../../types";
import { opencok_kingdom } from "../namespaces";

export const alliance_help = opencok_kingdom.table("alliance_help", {
  "helpId": varchar("helpId", { length: 255 }).notNull().default(sql.raw("''")),
  "allianceId": varchar("allianceId", { length: 255 }).notNull(),
  "senderId": varchar("senderId", { length: 255 }).notNull(),
  "content": varchar("content", { length: 255 }),
  "isvalid": integer("isvalid").default(sql.raw("1")),
  "maxcount": integer("maxcount").default(sql.raw("0")),
  "nowcount": integer("nowcount").default(sql.raw("0")),
  "startTime": bigint("startTime", { mode: "bigint" }),
  "reduceSec": integer("reduceSec"),
  "itemId": varchar("itemId", { length: 255 }),
  "level": integer("level"),
  "type": integer("type"),
  "helpers": bytea("helpers"),
  "star": integer("star").default(sql.raw("0")),
  "progress": integer("progress").default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "alliance_help_PRIMARY", columns: [table["helpId"]] }),
  index("alliance_help_allianceId_index").on(sql.raw("\"allianceId\"")),
  index("alliance_help_index_alliance_help").on(sql.raw("\"content\"")),
  check("alliance_help_helpers_length", sql.raw("octet_length(\"helpers\") <= 65535")),
]);
