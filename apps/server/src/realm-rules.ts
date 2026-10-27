import { Context } from "effect";
import type { Rules } from "@opencok/rules/game";

export class RealmRules extends Context.Service<RealmRules, Rules>()("@opencok/server/Rules") {}
