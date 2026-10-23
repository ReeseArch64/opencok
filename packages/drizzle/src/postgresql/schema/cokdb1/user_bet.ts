// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyNumber, legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_bet = cokdb1.table("user_bet", {
  "uuid": legacyText("uuid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "matchId": legacyText("matchId", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "vs": legacyText("vs", {"sqlType":"character varying(100)","collation":"legacy_meta.ci"}),
  "resourceType": integer("resourceType"),
  "betNum": integer("betNum"),
  "betSide": legacyText("betSide", {"sqlType":"character varying(50)","collation":"legacy_meta.ci"}),
  "winner": legacyText("winner", {"sqlType":"character varying(50)","collation":"legacy_meta.ci"}),
  "ended": integer("ended").default(sql.raw("0")),
  "rewarded": integer("rewarded").default(sql.raw("0")),
  "odds": legacyNumber("odds", {"sqlType":"numeric(10,2)"}),
}, (table) => [
  primaryKey({ name: "user_bet_PRIMARY", columns: [table["uuid"]] }),
  uniqueIndex("user_bet_PRIMARY_pad").on(sql.raw("rtrim(\"uuid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("user_bet_idx_uid").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("user_bet_idx_mid").on(sql.raw("rtrim(\"matchId\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("user_bet_idx_e").on(sql.raw("\"ended\"")),
  index("user_bet_idx_r").on(sql.raw("\"rewarded\"")),
]);
