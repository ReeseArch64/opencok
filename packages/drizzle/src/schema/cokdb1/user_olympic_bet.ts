import { integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const user_olympic_bet = cokdb1.table("user_olympic_bet", {
  "uuid": varchar("uuid", { length: 40 }).notNull(),
  "uid": varchar("uid", { length: 40 }).notNull(),
  "questionId": varchar("questionId", { length: 40 }).notNull(),
  "resourceType": integer("resourceType").notNull(),
  "betNum": integer("betNum").notNull(),
  "betCountry": varchar("betCountry", { length: 10 }).notNull(),
  "result": varchar("result", { length: 10 }),
  "ended": integer("ended"),
  "rewarded": integer("rewarded"),
  "reward": integer("reward"),
}, (table) => [
  primaryKey({ name: "user_olympic_bet_PRIMARY", columns: [table["uuid"]] }),
]);
