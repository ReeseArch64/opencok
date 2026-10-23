import { integer, varchar } from "drizzle-orm/pg-core";
import { cokdb_global } from "../namespaces";

export const pay_lottery = cokdb_global.table("pay_lottery", {
  "uid": varchar("uid", { length: 255 }),
  "remainGold": integer("remainGold"),
  "startTime": integer("startTime"),
  "endTime": integer("endTime"),
  "count": varchar("count", { length: 255 }),
});
