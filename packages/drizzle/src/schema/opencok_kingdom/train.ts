import { bigint, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const train = opencok_kingdom.table(
  "train",
  {
    "uid": varchar("uid", { length: 40 }).notNull(),
    "id": varchar("id", { length: 20 }).notNull(),
    "genUid": varchar("genUid", { length: 40 }),
    "finishTrain": bigint("finishTrain", { mode: "bigint" }).notNull(),
    "endTime": bigint("endTime", { mode: "bigint" }).notNull(),
  },
  (table) => [primaryKey({ name: "train_PRIMARY", columns: [table["uid"], table["id"]] })],
);
