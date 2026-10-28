import { sql } from "drizzle-orm";
import { bigint, check, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { bytea } from "../../types";
import { opencok_kingdom } from "../namespaces";

export const user_mine = opencok_kingdom.table(
    "user_mine",
    {
        "uid": varchar("uid", { length: 40 }).notNull(),
        "fId": varchar("fId", { length: 40 }).notNull(),
        "itemId": integer("itemId").default(sql.raw("0")),
        "level": integer("level"),
        "call": integer("call").default(sql.raw("0")),
        "exp": integer("exp"),
        "miner": integer("miner").default(sql.raw("0")),
        "mineTime": bigint("mineTime", { mode: "bigint" }),
        "helpInfo": bytea("helpInfo"),
    },
    (table) => [
        primaryKey({ name: "user_mine_PRIMARY", columns: [table["uid"], table["fId"]] }),
        index("user_mine_index_fId").on(sql.raw("\"fId\"")),
        check("user_mine_helpInfo_length", sql.raw("octet_length(\"helpInfo\") <= 65535")),
    ],
);
