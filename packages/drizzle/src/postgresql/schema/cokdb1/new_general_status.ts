// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const new_general_status = cokdb1.table("new_general_status", {
  "uid": legacyText("uid", {"sqlType":"character varying(96)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
  "newGeneralId": integer("newGeneralId").notNull().default(sql.raw("0")),
  "stateId": integer("stateId").notNull().default(sql.raw("0")),
  "startTime": bigint("startTime", { mode: "bigint" }),
  "endTime": bigint("endTime", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "new_general_status_PRIMARY", columns: [table["uid"], table["newGeneralId"], table["stateId"]] }),
  uniqueIndex("new_general_status_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"newGeneralId\""), sql.raw("\"stateId\"")),
]);
