// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const trial_field = cokdb1.table("trial_field", {
  "uid": legacyText("uid", {"sqlType":"character varying(50)","collation":"legacy_meta.ci"}).notNull(),
  "freeTrial": integer("freeTrial").default(sql.raw("0")),
  "freeFresh": bigint("freeFresh", { mode: "bigint" }).default(sql.raw("0")),
  "freeAtk": integer("freeAtk").default(sql.raw("0")),
  "monster": legacyText("monster", {"sqlType":"character varying(50)","collation":"legacy_meta.ci"}).default(sql.raw("''")),
  "blood": integer("blood").default(sql.raw("0")),
  "screen": legacyText("screen", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).default(sql.raw("''")),
  "buyTrial": integer("buyTrial").default(sql.raw("0")),
  "buyAtk": integer("buyAtk").default(sql.raw("0")),
  "chargeAtkTimes": integer("chargeAtkTimes").default(sql.raw("0")),
  "rewardMonster": legacyText("rewardMonster", {"sqlType":"character varying(50)","collation":"legacy_meta.ci"}).default(sql.raw("''")),
}, (table) => [
  primaryKey({ name: "trial_field_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("trial_field_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
