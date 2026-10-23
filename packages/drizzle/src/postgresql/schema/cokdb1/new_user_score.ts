// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyNumber, legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const new_user_score = cokdb1.table("new_user_score", {
  "uuid": legacyText("uuid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "score": legacyNumber("score", {"sqlType":"double precision"}).notNull(),
  "takeReward": legacyText("takeReward", {"sqlType":"character varying(500)","collation":"legacy_meta.ci"}),
  "rankingrewardstage": legacyText("rankingrewardstage", {"sqlType":"character varying(300)","collation":"legacy_meta.ci"}).default(sql.raw("''")),
  "kingdomrewardstage": legacyText("kingdomrewardstage", {"sqlType":"character varying(300)","collation":"legacy_meta.ci"}).default(sql.raw("''")),
  "stage": integer("stage").default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "new_user_score_PRIMARY", columns: [table["uuid"]] }),
  uniqueIndex("new_user_score_PRIMARY_pad").on(sql.raw("rtrim(\"uuid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("new_user_score_uid_idx").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("new_user_score_uid_stage_index").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"stage\"")),
]);
