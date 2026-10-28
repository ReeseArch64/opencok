import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const wishing_tree = opencok_kingdom.table(
    "wishing_tree",
    {
        "uid": varchar("uid", { length: 32 }).notNull().default(sql.raw("''")),
        "totalNum": bigint("totalNum", { mode: "bigint" }),
        "type_1": integer("type_1"),
        "type_2": integer("type_2"),
        "type_3": integer("type_3"),
        "type_4": integer("type_4"),
        "type_5": integer("type_5"),
        "type_6": integer("type_6"),
        "type_7": integer("type_7"),
        "type_8": integer("type_8"),
        "type_9": integer("type_9"),
        "type_10": integer("type_10"),
        "refreshtime": bigint("refreshtime", { mode: "bigint" }),
        "rewardtime": bigint("rewardtime", { mode: "bigint" }),
        "rewardid": integer("rewardid"),
        "type_11": integer("type_11").default(sql.raw("0")),
        "type_12": integer("type_12").default(sql.raw("0")),
        "type_13": integer("type_13").default(sql.raw("0")),
        "type_14": integer("type_14").default(sql.raw("0")),
        "type_15": integer("type_15").default(sql.raw("0")),
        "type_16": integer("type_16").default(sql.raw("0")),
        "type_17": integer("type_17").default(sql.raw("0")),
        "type_18": integer("type_18").default(sql.raw("0")),
        "type_19": integer("type_19").default(sql.raw("0")),
        "type_20": integer("type_20").default(sql.raw("0")),
    },
    (table) => [primaryKey({ name: "wishing_tree_PRIMARY", columns: [table["uid"]] })],
);
