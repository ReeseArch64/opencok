import { sql } from "drizzle-orm";
import { index, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_global } from "../namespaces";

export const mod_info = opencok_global.table(
  "mod_info",
  {
    "uid": varchar("uid", { length: 100 }).notNull(),
    "lang": varchar("lang", { length: 40 }).notNull(),
    "server": varchar("server", { length: 255 }),
  },
  (table) => [
    primaryKey({ name: "mod_info_PRIMARY", columns: [table["uid"]] }),
    index("mod_info_mod_info_fk_01").on(sql.raw('"server"')),
    index("mod_info_lang_index").on(sql.raw('"lang"')),
  ],
);
