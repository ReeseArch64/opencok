import { sql } from "drizzle-orm";
import { bigint, check, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { bytea } from "../../types";
import { opencok_global } from "../namespaces";

export const gashrequest = opencok_global.table(
    "gashrequest",
    {
        "tradeid": bigint("tradeid", { mode: "bigint" }).notNull(),
        "method": varchar("method", { length: 20 }),
        "orderinfo": varchar("orderinfo", { length: 200 }),
        "amount": integer("amount"),
        "trans": bytea("trans"),
        "state": integer("state"),
    },
    (table) => [
        primaryKey({ name: "gashrequest_PRIMARY", columns: [table["tradeid"]] }),
        check("gashrequest_trans_length", sql.raw("octet_length(\"trans\") <= 65535")),
    ],
);
