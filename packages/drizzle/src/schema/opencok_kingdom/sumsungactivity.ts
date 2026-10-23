import { bigint, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const sumsungactivity = opencok_kingdom.table(
  "sumsungactivity",
  {
    "uid": varchar("uid", { length: 70 }).notNull(),
    "deviceID": varchar("deviceID", { length: 100 }).notNull(),
    "time": bigint("time", { mode: "bigint" }),
  },
  (table) => [
    primaryKey({ name: "sumsungactivity_PRIMARY", columns: [table["uid"], table["deviceID"]] }),
  ],
);
