// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { legacyText } from "../../types";
import { cokdb_pay } from "../namespaces";
export const goods = cokdb_pay.table("goods", {
  "id": legacyText("id", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "name": legacyText("name", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "icon": legacyText("icon", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "description": legacyText("description", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "type": legacyText("type", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "type2": legacyText("type2", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
});
