import { sql } from "drizzle-orm";
import { bigint, check, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const question_match = opencok_kingdom.table(
    "question_match",
    {
        "id": varchar("id", { length: 40 }).notNull(),
        "result": varchar("result", { length: 40 }),
        "startBetTime": bigint("startBetTime", { mode: "bigint" }),
        "startTime": bigint("startTime", { mode: "bigint" }),
        "ended": integer("ended"),
        "betNum": bigint("betNum", { mode: "bigint" }),
        "winningBetNum": bigint("winningBetNum", { mode: "bigint" }),
        "rewardPool": bigint("rewardPool", { mode: "bigint" }),
        "tax": integer("tax"),
        "rewardLimit": integer("rewardLimit"),
    },
    (table) => [
        primaryKey({ name: "question_match_PRIMARY", columns: [table["id"]] }),
        check(
            "question_match_settlement",
            sql.raw(
                `("winningBetNum" IS NULL AND "rewardPool" IS NULL AND "tax" IS NULL AND "rewardLimit" IS NULL) OR ("winningBetNum" IS NOT NULL AND "winningBetNum" >= 0 AND "rewardPool" IS NOT NULL AND "rewardPool" >= 0 AND "tax" IS NOT NULL AND "tax" BETWEEN 0 AND 50 AND "rewardLimit" IS NOT NULL AND "rewardLimit" >= 0 AND coalesce("ended",0) = 1 AND length(coalesce("result",'')) > 0)`,
            ),
        ),
    ],
);
