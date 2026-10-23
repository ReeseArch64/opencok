// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyNumber, legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const civilization_castle = cokdb1.table("civilization_castle", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
  "level": integer("level").default(sql.raw("0")),
  "pointId": integer("pointId").default(sql.raw("0")),
  "def": integer("def").default(sql.raw("0")),
  "resourceNum": legacyNumber("resourceNum", {"sqlType":"double precision"}),
  "lastOutputTime": bigint("lastOutputTime", { mode: "bigint" }),
  "robCount": integer("robCount").default(sql.raw("0")),
  "beRobNum": integer("beRobNum").default(sql.raw("0")),
  "lastRefreshDataTime": bigint("lastRefreshDataTime", { mode: "bigint" }),
  "status": integer("status").default(sql.raw("0")),
  "buildTime": bigint("buildTime", { mode: "bigint" }),
  "lastSettleTime": bigint("lastSettleTime", { mode: "bigint" }).default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "civilization_castle_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("civilization_castle_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
