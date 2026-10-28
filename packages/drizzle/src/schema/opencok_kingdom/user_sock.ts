import { sql } from "drizzle-orm";
import { bigint, check, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { bytea } from "../../types";
import { opencok_kingdom } from "../namespaces";

export const user_sock = opencok_kingdom.table(
    "user_sock",
    {
        "uid": varchar("uid", { length: 255 }).notNull(),
        "socks": bigint("socks", { mode: "bigint" }).default(sql.raw("0")),
        "reward": bytea("reward"),
        "level": integer("level").default(sql.raw("0")),
        "refreshtime": bigint("refreshtime", { mode: "bigint" }),
    },
    (table) => [
        primaryKey({ name: "user_sock_PRIMARY", columns: [table["uid"]] }),
        check("user_sock_reward_length", sql.raw("octet_length(\"reward\") <= 65535")),
    ],
);
