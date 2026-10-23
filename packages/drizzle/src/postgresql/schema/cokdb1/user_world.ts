// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, check, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyBytes, legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_world = cokdb1.table("user_world", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "pointId": integer("pointId").notNull(),
  "worldId": integer("worldId").notNull().default(sql.raw("0")),
  "color": integer("color"),
  "monsterLock": legacyBytes("monsterLock"),
  "lastCityDefTime": bigint("lastCityDefTime", { mode: "bigint" }).notNull(),
  "attMonsterStamina": integer("attMonsterStamina"),
  "lastStaminaTime": bigint("lastStaminaTime", { mode: "bigint" }),
  "lastMoveCityTime": bigint("lastMoveCityTime", { mode: "bigint" }).default(sql.raw("0")),
  "srcServerPointId": integer("srcServerPointId"),
  "ckfConfirmAccessNextRound": integer("ckfConfirmAccessNextRound"),
  "ckfNeedLeave": integer("ckfNeedLeave"),
  "ckfAccessTimes": integer("ckfAccessTimes").default(sql.raw("0")),
  "ckfLastPlayRound": integer("ckfLastPlayRound"),
  "ckfProtectTime": bigint("ckfProtectTime", { mode: "bigint" }),
  "ckfWinStreak": integer("ckfWinStreak").default(sql.raw("0")),
  "cdfAreaId": integer("cdfAreaId").default(sql.raw("0")),
  "ckfLeaveABFServerTime": bigint("ckfLeaveABFServerTime", { mode: "bigint" }),
  "ckfThroneFightFlag": integer("ckfThroneFightFlag").default(sql.raw("0")),
  "resSearchCount": integer("resSearchCount").default(sql.raw("0")),
  "searchFlushTime": bigint("searchFlushTime", { mode: "bigint" }).default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "user_world_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("user_world_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  check("user_world_monsterLock_length", sql.raw("octet_length(\"monsterLock\") <= 65535")),
]);
