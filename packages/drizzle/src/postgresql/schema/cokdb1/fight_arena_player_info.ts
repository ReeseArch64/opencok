// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { integer } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const fight_arena_player_info = cokdb1.table("fight_arena_player_info", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "worldId": integer("worldId"),
  "version": integer("version"),
  "score": integer("score"),
  "side": integer("side"),
  "rankScore": integer("rankScore"),
});
