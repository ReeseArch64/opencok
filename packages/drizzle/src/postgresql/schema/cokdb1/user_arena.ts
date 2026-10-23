// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { integer } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_arena = cokdb1.table("user_arena", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
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
