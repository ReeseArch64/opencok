// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, check, index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyBytes, legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_mine = cokdb1.table("user_mine", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "fId": legacyText("fId", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "itemId": integer("itemId").default(sql.raw("0")),
  "level": integer("level"),
  "call": integer("call").default(sql.raw("0")),
  "exp": integer("exp"),
  "miner": integer("miner").default(sql.raw("0")),
  "mineTime": bigint("mineTime", { mode: "bigint" }),
  "helpInfo": legacyBytes("helpInfo"),
}, (table) => [
  primaryKey({ name: "user_mine_PRIMARY", columns: [table["uid"], table["fId"]] }),
  uniqueIndex("user_mine_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"fId\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("user_mine_index_fId").on(sql.raw("rtrim(\"fId\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  check("user_mine_helpInfo_length", sql.raw("octet_length(\"helpInfo\") <= 65535")),
]);
