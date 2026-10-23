import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const general_challenge_layer = opencok_kingdom.table("general_challenge_layer", {
  "id": integer("id").notNull().default(sql.raw("0")),
  "uid": varchar("uid", { length: 96 }).notNull().default(sql.raw("''")),
  "count": integer("count"),
  "buycount": integer("buycount"),
  "finishcount": integer("finishcount"),
  "monsterid": integer("monsterid"),
  "challengetime": bigint("challengetime", { mode: "bigint" }),
  "resettime": bigint("resettime", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "general_challenge_layer_PRIMARY", columns: [table["id"], table["uid"]] }),
]);
