// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { bigint, integer } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const luck_draw_history = cokdb1.table("luck_draw_history", {
  "gameUid": legacyText("gameUid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "roleName": legacyText("roleName", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
  "allianceId": legacyText("allianceId", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
  "allianceName": legacyText("allianceName", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
  "type": integer("type"),
  "itemId": legacyText("itemId", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "time": bigint("time", { mode: "bigint" }),
});
