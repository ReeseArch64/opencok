import { integer, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const fight_arena_player_info = opencok_kingdom.table("fight_arena_player_info", {
    "uid": varchar("uid", { length: 255 }),
    "worldId": integer("worldId"),
    "version": integer("version"),
    "score": integer("score"),
    "side": integer("side"),
    "rankScore": integer("rankScore"),
});
