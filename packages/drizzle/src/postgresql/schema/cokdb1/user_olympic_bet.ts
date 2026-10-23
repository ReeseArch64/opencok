// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_olympic_bet = cokdb1.table("user_olympic_bet", {
  "uuid": legacyText("uuid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "questionId": legacyText("questionId", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "resourceType": integer("resourceType").notNull(),
  "betNum": integer("betNum").notNull(),
  "betCountry": legacyText("betCountry", {"sqlType":"character varying(10)","collation":"legacy_meta.ci"}).notNull(),
  "result": legacyText("result", {"sqlType":"character varying(10)","collation":"legacy_meta.ci"}),
  "ended": integer("ended"),
  "rewarded": integer("rewarded"),
  "reward": integer("reward"),
}, (table) => [
  primaryKey({ name: "user_olympic_bet_PRIMARY", columns: [table["uuid"]] }),
  uniqueIndex("user_olympic_bet_PRIMARY_pad").on(sql.raw("rtrim(\"uuid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
