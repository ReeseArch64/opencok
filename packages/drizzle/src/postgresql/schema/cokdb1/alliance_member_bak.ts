// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const alliance_member_bak = cokdb1.table("alliance_member_bak", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "allianceId": legacyText("allianceId", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "rank": integer("rank"),
  "point": integer("point").default(sql.raw("0")),
  "accPoint": integer("accPoint").default(sql.raw("0")),
  "progress": integer("progress").default(sql.raw("0")),
  "donateTime": bigint("donateTime", { mode: "bigint" }),
  "todaydonate": integer("todaydonate").default(sql.raw("0")),
  "todayprogress": integer("todayprogress").default(sql.raw("0")),
  "jointime": bigint("jointime", { mode: "bigint" }).default(sql.raw("0")),
  "wood": integer("wood").default(sql.raw("0")),
  "stone": integer("stone").default(sql.raw("0")),
  "iron": integer("iron").default(sql.raw("0")),
  "food": integer("food").default(sql.raw("0")),
  "silver": integer("silver").default(sql.raw("0")),
  "gold": integer("gold").default(sql.raw("0")),
  "donateCDTime": bigint("donateCDTime", { mode: "bigint" }).default(sql.raw("0")),
  "donateAvailable": integer("donateAvailable").default(sql.raw("1")),
  "yesterdayLogin": integer("yesterdayLogin").default(sql.raw("0")),
  "fight": integer("fight").default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "alliance_member_bak_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("alliance_member_bak_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("alliance_member_bak_index_allianceId").on(sql.raw("rtrim(\"allianceId\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
