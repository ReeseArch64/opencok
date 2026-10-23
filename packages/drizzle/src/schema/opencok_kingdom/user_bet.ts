import { sql } from "drizzle-orm";
import { index, integer, numeric, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const user_bet = opencok_kingdom.table(
  "user_bet",
  {
    "uuid": varchar("uuid", { length: 255 }).notNull(),
    "uid": varchar("uid", { length: 255 }),
    "matchId": varchar("matchId", { length: 255 }),
    "vs": varchar("vs", { length: 100 }),
    "resourceType": integer("resourceType"),
    "betNum": integer("betNum"),
    "betSide": varchar("betSide", { length: 50 }),
    "winner": varchar("winner", { length: 50 }),
    "ended": integer("ended").default(sql.raw("0")),
    "rewarded": integer("rewarded").default(sql.raw("0")),
    "odds": numeric("odds", { precision: 10, scale: 2, mode: "number" }),
  },
  (table) => [
    primaryKey({ name: "user_bet_PRIMARY", columns: [table["uuid"]] }),
    index("user_bet_idx_uid").on(sql.raw('"uid"')),
    index("user_bet_idx_mid").on(sql.raw('"matchId"')),
    index("user_bet_idx_e").on(sql.raw('"ended"')),
    index("user_bet_idx_r").on(sql.raw('"rewarded"')),
  ],
);
