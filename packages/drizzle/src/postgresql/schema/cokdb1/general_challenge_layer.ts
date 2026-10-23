// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const general_challenge_layer = cokdb1.table("general_challenge_layer", {
  "id": integer("id").notNull().default(sql.raw("0")),
  "uid": legacyText("uid", {"sqlType":"character varying(96)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
  "count": integer("count"),
  "buycount": integer("buycount"),
  "finishcount": integer("finishcount"),
  "monsterid": integer("monsterid"),
  "challengetime": bigint("challengetime", { mode: "bigint" }),
  "resettime": bigint("resettime", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "general_challenge_layer_PRIMARY", columns: [table["id"], table["uid"]] }),
  uniqueIndex("general_challenge_layer_PRIMARY_pad").on(sql.raw("\"id\""), sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
