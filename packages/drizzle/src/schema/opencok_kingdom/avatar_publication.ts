import { sql } from "drizzle-orm";
import { bigint, check, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const avatar_publication = opencok_kingdom.table(
  "avatar_publication",
  {
    ownerUid: varchar("ownerUid", { length: 20 }).notNull(),
    revision: bigint("revision", { mode: "bigint" }).notNull(),
  },
  (table) => [
    primaryKey({ name: "avatar_publication_PRIMARY", columns: [table.ownerUid] }),
    check("avatar_publication_revision", sql.raw('"revision" > 0')),
  ],
);
