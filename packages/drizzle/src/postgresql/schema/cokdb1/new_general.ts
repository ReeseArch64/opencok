// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, smallint, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const new_general = cokdb1.table("new_general", {
  "id": integer("id").notNull().default(sql.raw("0")),
  "uid": legacyText("uid", {"sqlType":"character varying(96)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
  "exp": integer("exp"),
  "level": integer("level"),
  "quality": integer("quality"),
  "talentpoint": integer("talentpoint"),
  "state": smallint("state"),
  "predatoruid": legacyText("predatoruid", {"sqlType":"character varying(96)","collation":"legacy_meta.ci"}),
  "relivetime": bigint("relivetime", { mode: "bigint" }),
  "buildingUuid": legacyText("buildingUuid", {"sqlType":"character varying(96)","collation":"legacy_meta.ci"}),
  "skillInfo": legacyText("skillInfo", {"sqlType":"character varying(6000)","collation":"legacy_meta.ci"}),
  "createtime": bigint("createtime", { mode: "bigint" }),
  "talent": legacyText("talent", {"sqlType":"character varying(5000)","collation":"legacy_meta.ci"}),
  "serverid": integer("serverid"),
  "robtime": bigint("robtime", { mode: "bigint" }),
  "killtime": bigint("killtime", { mode: "bigint" }),
  "gethomttime": bigint("gethomttime", { mode: "bigint" }),
  "optime": legacyText("optime", {"sqlType":"character varying(200)","collation":"legacy_meta.ci"}),
  "refineproperty": legacyText("refineproperty", {"sqlType":"character varying(300)","collation":"legacy_meta.ci"}),
  "oldrefineproperty": legacyText("oldrefineproperty", {"sqlType":"character varying(300)","collation":"legacy_meta.ci"}),
  "refinegold": integer("refinegold"),
  "refinecard": integer("refinecard"),
  "refinecount": integer("refinecount"),
  "lockproperty": legacyText("lockproperty", {"sqlType":"character varying(60)","collation":"legacy_meta.ci"}),
  "refreshproperty": legacyText("refreshproperty", {"sqlType":"character varying(300)","collation":"legacy_meta.ci"}),
  "breach": legacyText("breach", {"sqlType":"character varying(128)","collation":"legacy_meta.ci"}),
  "star": integer("star").default(sql.raw("1")),
  "baseSkill": legacyText("baseSkill", {"sqlType":"character varying(256)","collation":"legacy_meta.ci"}),
}, (table) => [
  primaryKey({ name: "new_general_PRIMARY", columns: [table["id"], table["uid"]] }),
  uniqueIndex("new_general_PRIMARY_pad").on(sql.raw("\"id\""), sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("new_general_predatoruid_index").on(sql.raw("rtrim(\"predatoruid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("new_general_uid").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
