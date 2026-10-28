import { sql } from "drizzle-orm";
import { integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_global } from "../namespaces";

export const mycardrequest = opencok_global.table(
    "mycardrequest",
    {
        "factradeseq": varchar("factradeseq", { length: 40 }).notNull(),
        "authcode": varchar("authcode", { length: 200 }).notNull(),
        "method": varchar("method", { length: 20 }),
        "methodparam": varchar("methodparam", { length: 10 }),
        "tradeseq": varchar("tradeseq", { length: 200 }),
        "orderInfo": varchar("orderInfo", { length: 300 }).notNull(),
        "amount": integer("amount").notNull(),
        "state": integer("state").default(sql.raw("0")),
    },
    (table) => [primaryKey({ name: "mycardrequest_PRIMARY", columns: [table["factradeseq"]] })],
);
