import { sql } from "drizzle-orm";
import { bigint, check, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { bytea } from "../../types";
import { opencok_kingdom } from "../namespaces";

export const alliance_battle_record = opencok_kingdom.table("alliance_battle_record", {
  "uuid": varchar("uuid", { length: 40 }).notNull().default(sql.raw("''")),
  "attAllianceId": varchar("attAllianceId", { length: 40 }).notNull().default(sql.raw("''")),
  "defAllianceId": varchar("defAllianceId", { length: 40 }).notNull().default(sql.raw("''")),
  "type": integer("type").notNull(),
  "report": bytea("report").notNull(),
  "timeStamp": bigint("timeStamp", { mode: "bigint" }).notNull(),
}, (table) => [
  primaryKey({ name: "alliance_battle_record_PRIMARY", columns: [table["uuid"]] }),
  check("alliance_battle_record_report_length", sql.raw("octet_length(\"report\") <= 65535")),
]);
