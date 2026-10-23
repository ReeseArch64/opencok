// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const receive_item = cokdb1.table("receive_item", {
  "id": integer("id").notNull().generatedByDefaultAsIdentity({ name: "receive_item_id_seq", startWith: 1 }),
  "uid": legacyText("uid", {"sqlType":"character varying(50)","collation":"legacy_meta.ci"}).notNull(),
  "senduid": legacyText("senduid", {"sqlType":"character varying(50)","collation":"legacy_meta.ci"}).notNull(),
  "itemId": legacyText("itemId", {"sqlType":"character varying(50)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("'0'")),
  "itemNum": integer("itemNum").notNull().default(sql.raw("0")),
  "createTime": bigint("createTime", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "receive_item_PRIMARY", columns: [table["id"]] }),
]);
