import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const egg_activity = cokdb1.table("egg_activity", {
  "uid": varchar("uid", { length: 40 }).notNull(),
  "curEgg": varchar("curEgg", { length: 10 }).notNull(),
  "eggCd": bigint("eggCd", { mode: "bigint" }).default(sql.raw("0")),
  "exp": integer("exp").default(sql.raw("0")),
  "curExpStage": integer("curExpStage").default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "egg_activity_PRIMARY", columns: [table["uid"]] }),
]);
