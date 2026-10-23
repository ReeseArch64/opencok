// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const world_flush_resource_new_tmp = cokdb1.table("world_flush_resource_new_tmp", {
  "id": integer("id").notNull(),
  "pointType": integer("pointType").notNull(),
  "pointItem": legacyText("pointItem", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "resLevel": integer("resLevel").notNull().default(sql.raw("0")),
  "resCostValue": integer("resCostValue").notNull().default(sql.raw("0")),
  "resInitValue": integer("resInitValue").notNull(),
  "flushTime": bigint("flushTime", { mode: "bigint" }).default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "world_flush_resource_new_tmp_PRIMARY", columns: [table["id"]] }),
]);
