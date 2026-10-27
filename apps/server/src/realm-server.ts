import { Context, type Effect } from "effect";
import type { listenServer } from "@opencok/connection/server";
import type { ServerDependencies } from "@opencok/connection/dependencies";

export class RealmServer extends Context.Service<
  RealmServer,
  Effect.Success<ReturnType<typeof listenServer>> & Pick<ServerDependencies, "paidGifts">
>()("@opencok/server/Server") {}
