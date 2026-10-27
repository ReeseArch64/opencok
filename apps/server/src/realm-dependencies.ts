import { Context } from "effect";
import type { ServerDependencies } from "@opencok/connection/dependencies";

export class RealmDependencies extends Context.Service<RealmDependencies, ServerDependencies>()(
  "@opencok/server/Dependencies",
) {}
