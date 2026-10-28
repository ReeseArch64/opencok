import type { Config } from "./config.ts";
import type { Rules } from "@opencok/rules/game";
import { RealmApplication } from "./realm-application.ts";

export { RealmDependencies } from "./realm-dependencies.ts";
export { RealmRules } from "./realm-rules.ts";
export { RealmServer } from "./realm-server.ts";
export {
    RealmRulesLive,
    RealmDependenciesLive,
    RealmServerLive,
    RealmLive,
} from "./realm-composition.ts";

export async function startServer(config: Config, rules?: Rules)
{
    return new RealmApplication(config, rules).start();
}
