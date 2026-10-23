// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, check, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyBytes, legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_sock = cokdb1.table("user_sock", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "socks": bigint("socks", { mode: "bigint" }).default(sql.raw("0")),
  "reward": legacyBytes("reward"),
  "level": integer("level").default(sql.raw("0")),
  "refreshtime": bigint("refreshtime", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "user_sock_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("user_sock_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  check("user_sock_reward_length", sql.raw("octet_length(\"reward\") <= 65535")),
]);
