import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const user_pay_lottery = cokdb1.table("user_pay_lottery", {
  "uid": varchar("uid", { length: 40 }).notNull(),
  "totalGold": integer("totalGold"),
  "lastGold": integer("lastGold"),
  "lastLuckyNum": integer("lastLuckyNum"),
  "lastBonus": integer("lastBonus"),
  "count": integer("count"),
  "lastTime": bigint("lastTime", { mode: "bigint" }),
  "shareTime": bigint("shareTime", { mode: "bigint" }),
  "luckyNum": integer("luckyNum"),
}, (table) => [
  primaryKey({ name: "user_pay_lottery_PRIMARY", columns: [table["uid"]] }),
]);
