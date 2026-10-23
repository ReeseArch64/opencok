import { integer, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const user_arena = cokdb1.table("user_arena", {
  "uid": varchar("uid", { length: 255 }),
  "rankScore": integer("rankScore"),
  "state": integer("state"),
  "fightServerId": integer("fightServerId"),
  "worldId": integer("worldId"),
  "version": integer("version"),
  "time": integer("time"),
  "totalWinCount": integer("totalWinCount"),
  "totalLoseCount": integer("totalLoseCount"),
  "serialWinCount": integer("serialWinCount"),
});
