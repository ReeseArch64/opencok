import { sql } from "drizzle-orm";
import { bigint, check, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { bytea } from "../../types";
import { opencok_global } from "../namespaces";

export const activation_config = opencok_global.table("activation_config", {
  "seriesId": integer("seriesId").notNull(),
  "title": bytea("title"),
  "contents": bytea("contents"),
  "reward": bytea("reward"),
  "num": integer("num"),
  "proUser": varchar("proUser", { length: 40 }),
  "type": integer("type").default(sql.raw("0")),
  "count": integer("count").default(sql.raw("0")),
  "beginTime": bigint("beginTime", { mode: "bigint" }).default(sql.raw("0")),
  "endTime": bigint("endTime", { mode: "bigint" }).default(sql.raw("0")),
  "regStart": bigint("regStart", { mode: "bigint" }).default(sql.raw("0")),
  "regEnd": bigint("regEnd", { mode: "bigint" }).default(sql.raw("0")),
  "country": varchar("country", { length: 256 }).default(sql.raw("''")),
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
