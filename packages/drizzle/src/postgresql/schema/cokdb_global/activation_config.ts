// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, check, integer, primaryKey } from "drizzle-orm/pg-core";
import { legacyBytes, legacyText } from "../../types";
import { cokdb_global } from "../namespaces";
export const activation_config = cokdb_global.table("activation_config", {
  "seriesId": integer("seriesId").notNull(),
  "title": legacyBytes("title"),
  "contents": legacyBytes("contents"),
  "reward": legacyBytes("reward"),
  "num": integer("num"),
  "proUser": legacyText("proUser", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
  "type": integer("type").default(sql.raw("0")),
  "count": integer("count").default(sql.raw("0")),
  "beginTime": bigint("beginTime", { mode: "bigint" }).default(sql.raw("0")),
  "endTime": bigint("endTime", { mode: "bigint" }).default(sql.raw("0")),
  "regStart": bigint("regStart", { mode: "bigint" }).default(sql.raw("0")),
  "regEnd": bigint("regEnd", { mode: "bigint" }).default(sql.raw("0")),
  "country": legacyText("country", {"sqlType":"character varying(256)","collation":"legacy_meta.ci"}).default(sql.raw("''")),
  "bLvMin": integer("bLvMin").default(sql.raw("0")),
  "bLvMax": integer("bLvMax").default(sql.raw("0")),
  "uLvMin": integer("uLvMin").default(sql.raw("0")),
  "uLvMax": integer("uLvMax").default(sql.raw("0")),
  "powerMin": bigint("powerMin", { mode: "bigint" }).default(sql.raw("0")),
  "powerMax": bigint("powerMax", { mode: "bigint" }).default(sql.raw("0")),
  "payGold": integer("payGold").default(sql.raw("0")),
  "deviceLimit": integer("deviceLimit").default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "activation_config_PRIMARY", columns: [table["seriesId"]] }),
  check("activation_config_title_length", sql.raw("octet_length(\"title\") <= 65535")),
  check("activation_config_contents_length", sql.raw("octet_length(\"contents\") <= 65535")),
  check("activation_config_reward_length", sql.raw("octet_length(\"reward\") <= 65535")),
]);
