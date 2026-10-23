import { sql } from "drizzle-orm";
import { integer, primaryKey, text, varchar } from "drizzle-orm/pg-core";
import { opencok_pay } from "../namespaces";

export const packs = opencok_pay.table(
  "packs",
  {
    "Id": integer("Id")
      .notNull()
      .generatedByDefaultAsIdentity({ "name": "packs_Id_seq", "startWith": 96 }),
    "name": varchar("name", { length: 100 }),
    "description": varchar("description", { length: 255 })
      .notNull()
      .default(sql.raw("'NRAGON MOD SHOP'")),
    "contents": text("contents"),
    "images": varchar("images", { length: 255 }).notNull().default(sql.raw("'novia'")),
    "gold": integer("gold").default(sql.raw("0")),
    "price": integer("price").default(sql.raw("1000")),
    "items": text("items"),
    "group": varchar("group", { length: 255 }),
    "pack_type": varchar("pack_type", { length: 255 }).notNull().default(sql.raw("'gold'")),
    "status": integer("status").notNull().default(sql.raw("0")),
    "popup_image": varchar("popup_image", { length: 255 }).notNull().default(sql.raw("'novia'")),
  },
  (table) => [primaryKey({ name: "packs_PRIMARY", columns: [table["Id"]] })],
);
