import { bigint, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const sumsungactivity = cokdb1.table("sumsungactivity", {
  "uid": varchar("uid", { length: 70 }).notNull(),
  "deviceID": varchar("deviceID", { length: 100 }).notNull(),
  "time": bigint("time", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "sumsungactivity_PRIMARY", columns: [table["uid"], table["deviceID"]] }),
]);
