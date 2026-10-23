import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, smallint, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const new_general = opencok_kingdom.table(
  "new_general",
  {
    "id": integer("id").notNull().default(sql.raw("0")),
    "uid": varchar("uid", { length: 96 }).notNull().default(sql.raw("''")),
    "exp": integer("exp"),
    "level": integer("level"),
    "quality": integer("quality"),
    "talentpoint": integer("talentpoint"),
    "state": smallint("state"),
    "predatoruid": varchar("predatoruid", { length: 96 }),
    "relivetime": bigint("relivetime", { mode: "bigint" }),
    "buildingUuid": varchar("buildingUuid", { length: 96 }),
    "skillInfo": varchar("skillInfo", { length: 6000 }),
    "createtime": bigint("createtime", { mode: "bigint" }),
    "talent": varchar("talent", { length: 5000 }),
    "serverid": integer("serverid"),
    "robtime": bigint("robtime", { mode: "bigint" }),
    "killtime": bigint("killtime", { mode: "bigint" }),
    "gethomttime": bigint("gethomttime", { mode: "bigint" }),
    "optime": varchar("optime", { length: 200 }),
    "refineproperty": varchar("refineproperty", { length: 300 }),
    "oldrefineproperty": varchar("oldrefineproperty", { length: 300 }),
    "refinegold": integer("refinegold"),
    "refinecard": integer("refinecard"),
    "refinecount": integer("refinecount"),
    "lockproperty": varchar("lockproperty", { length: 60 }),
    "refreshproperty": varchar("refreshproperty", { length: 300 }),
    "breach": varchar("breach", { length: 128 }),
    "star": integer("star").default(sql.raw("1")),
    "baseSkill": varchar("baseSkill", { length: 256 }),
  },
  (table) => [
    primaryKey({ name: "new_general_PRIMARY", columns: [table["id"], table["uid"]] }),
    index("new_general_predatoruid_index").on(sql.raw('"predatoruid"')),
    index("new_general_uid").on(sql.raw('"uid"')),
  ],
);
