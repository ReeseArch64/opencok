// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const flower_ranking = cokdb1.table("flower_ranking", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "scoreVal": integer("scoreVal"),
  "flowerVal": integer("flowerVal"),
  "eggVal": integer("eggVal"),
  "hideKing": integer("hideKing").default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "flower_ranking_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("flower_ranking_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
