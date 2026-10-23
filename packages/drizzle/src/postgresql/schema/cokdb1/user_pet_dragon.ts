// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, check, index, integer, primaryKey, smallint, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_pet_dragon = cokdb1.table("user_pet_dragon", {
  "uuid": legacyText("uuid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "itemId": integer("itemId").notNull(),
  "dragonState": smallint("dragonState").notNull().default(sql.raw("0")),
  "friendly": integer("friendly").default(sql.raw("0")),
  "clickBubbleTimesForDay": smallint("clickBubbleTimesForDay").default(sql.raw("0")),
  "clickBubbleTotalTimes": integer("clickBubbleTotalTimes").default(sql.raw("0")),
  "gainEggTime": bigint("gainEggTime", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "clickEggTime": bigint("clickEggTime", { mode: "bigint" }).default(sql.raw("0")),
  "lastClickBubbleTime": bigint("lastClickBubbleTime", { mode: "bigint" }).default(sql.raw("0")),
  "useFlag": smallint("useFlag").notNull().default(sql.raw("0")),
  "friendShipDecreaseTime": bigint("friendShipDecreaseTime", { mode: "bigint" }).default(sql.raw("0")),
  "travelData": legacyText("travelData", {"sqlType":"character varying(2000)","collation":"legacy_meta.ci"}),
  "communicateData": legacyText("communicateData", {"sqlType":"character varying(500)","collation":"legacy_meta.ci"}),
  "exp": integer("exp").default(sql.raw("0")),
  "initFriendShipFlag": smallint("initFriendShipFlag").default(sql.raw("0")),
  "lastUpLevelTime": bigint("lastUpLevelTime", { mode: "bigint" }).default(sql.raw("0")),
  "lv": smallint("lv").default(sql.raw("1")),
  "nickName": legacyText("nickName", {"sqlType":"character varying(128)","collation":"legacy_meta.ci"}),
}, (table) => [
  primaryKey({ name: "user_pet_dragon_PRIMARY", columns: [table["uuid"]] }),
  uniqueIndex("user_pet_dragon_PRIMARY_pad").on(sql.raw("rtrim(\"uuid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("user_pet_dragon_index_uid").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  check("user_pet_dragon_dragonState_range", sql.raw("\"dragonState\" BETWEEN -128 AND 127")),
  check("user_pet_dragon_useFlag_range", sql.raw("\"useFlag\" BETWEEN -128 AND 127")),
  check("user_pet_dragon_initFriendShipFlag_range", sql.raw("\"initFriendShipFlag\" BETWEEN -128 AND 127")),
]);
