// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const kingdom_position = cokdb1.table("kingdom_position", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
  "positionId": legacyText("positionId", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
  "time": bigint("time", { mode: "bigint" }),
  "chNameFlag": integer("chNameFlag"),
  "preKingUid": legacyText("preKingUid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
  "relinquishEndTime": bigint("relinquishEndTime", { mode: "bigint" }),
  "currResourceType": integer("currResourceType"),
  "chBannerFlag": integer("chBannerFlag"),
  "chThronePicFlag": integer("chThronePicFlag"),
  "appointedTime": bigint("appointedTime", { mode: "bigint" }).default(sql.raw("0")),
  "valid": integer("valid").default(sql.raw("0")),
  "cemeteryBlessTime": bigint("cemeteryBlessTime", { mode: "bigint" }).default(sql.raw("0")),
  "serverId": integer("serverId").default(sql.raw("0")),
  "isSmall": integer("isSmall").notNull().default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "kingdom_position_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("kingdom_position_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
