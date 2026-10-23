import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const compensate_record = opencok_kingdom.table(
  "compensate_record",
  {
    "uuid": varchar("uuid", { length: 255 }).notNull(),
    "uid": varchar("uid", { length: 255 }),
    "lostPower": bigint("lostPower", { mode: "bigint" }),
    "time": bigint("time", { mode: "bigint" }),
    "rewardTime": bigint("rewardTime", { mode: "bigint" }),
    "rewardStatus": integer("rewardStatus"),
    "reward": varchar("reward", { length: 255 }),
    "num": integer("num"),
  },
  (table) => [
    primaryKey({ name: "compensate_record_PRIMARY", columns: [table["uuid"]] }),
    index("compensate_record_time_idx").on(sql.raw('"time"')),
    index("compensate_record_uid_idx").on(sql.raw('"uid"')),
  ],
);
