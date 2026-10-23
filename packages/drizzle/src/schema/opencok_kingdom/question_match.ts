import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const question_match = opencok_kingdom.table("question_match", {
  "id": varchar("id", { length: 40 }).notNull(),
  "result": varchar("result", { length: 40 }),
  "startBetTime": bigint("startBetTime", { mode: "bigint" }),
  "startTime": bigint("startTime", { mode: "bigint" }),
  "ended": integer("ended"),
  "betNum": bigint("betNum", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "question_match_PRIMARY", columns: [table["id"]] }),
]);
