// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { integer, primaryKey } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb_pay } from "../namespaces";
export const packs = cokdb_pay.table("packs", {
  "Id": integer("Id").notNull().generatedByDefaultAsIdentity({ name: "packs_Id_seq", startWith: 96 }),
  "name": legacyText("name", {"sqlType":"character varying(100)","collation":"legacy_meta.ci"}),
  "description": legacyText("description", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("'NRAGON MOD SHOP'")),
  "contents": legacyText("contents", {"sqlType":"text","collation":"legacy_meta.ci"}),
  "images": legacyText("images", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("'novia'")),
  "gold": integer("gold").default(sql.raw("0")),
  "price": integer("price").default(sql.raw("1000")),
  "items": legacyText("items", {"sqlType":"text","collation":"legacy_meta.ci"}),
  "group": legacyText("group", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "pack_type": legacyText("pack_type", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("'gold'")),
  "status": integer("status").notNull().default(sql.raw("0")),
  "popup_image": legacyText("popup_image", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("'novia'")),
}, (table) => [
  primaryKey({ name: "packs_PRIMARY", columns: [table["Id"]] }),
]);
