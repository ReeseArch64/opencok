import type { Config } from "./config.ts";
import { listenServer } from "@opencok/connection/server";
import { Database } from "@opencok/repositories/game";
import { Cache } from "@opencok/storage/session";
import { Coordination } from "@opencok/storage/coordination";
import { loadRules } from "@opencok/resources/rules";
import { Game } from "@opencok/controllers/game";
import { World } from "@opencok/controllers/world";

export async function startServer(config: Config) {
  const rules = await loadRules(config.resources, config.kingdomId);
  const db = new Database(config);
  return listenServer(config, {
    db,
    cache: new Cache(config),
    coordination: new Coordination(config),
    game: new Game(db, rules, config),
    world: new World(db, config.mapSize, config.kingdomId),
  });
}
