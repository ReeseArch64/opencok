// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { legacyText } from "../../types";
import { cokdb_global } from "../namespaces";
export const ban_move_set = cokdb_global.table("ban_move_set", {
  "country": legacyText("country", {"sqlType":"character varying(256)","collation":"legacy_meta.ci"}),
  "pf": legacyText("pf", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "serverPf": legacyText("serverPf", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "sid": legacyText("sid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "val": legacyText("val", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
});
