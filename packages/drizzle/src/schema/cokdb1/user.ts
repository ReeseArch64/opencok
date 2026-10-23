import { sql } from "drizzle-orm";
import { bigint, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const user = cokdb1.table("user", {
  "id": bigint("id", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "age": bigint("age", { mode: "bigint" }),
  "email": varchar("email", { length: 255 }),
  "name": varchar("name", { length: 255 }),
}, (table) => [
  primaryKey({ name: "user_PRIMARY", columns: [table["id"]] }),
]);
