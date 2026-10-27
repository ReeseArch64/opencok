import { Layer, ManagedRuntime } from "effect";
import type { Rules } from "@opencok/rules/game";
import { RealmConfig, type Config } from "./config.ts";
import { RealmRules } from "./realm-rules.ts";
import { RealmServer } from "./realm-server.ts";
import { RealmApplicationLive, RealmRulesLive } from "./realm-composition.ts";

export class RealmApplication {
  private readonly runtime;

  public constructor(config: Config, rules?: Rules) {
    if (rules && rules.kingdomId !== config.kingdomId)
      throw new Error("Rules do not belong to the configured realm");

    this.runtime = ManagedRuntime.make(
      RealmApplicationLive.pipe(
        Layer.provide(rules ? Layer.succeed(RealmRules, rules) : RealmRulesLive),
        Layer.provide(Layer.succeed(RealmConfig, config)),
      ),
    );
  }

  public async start() {
    try {
      const server = await this.runtime.runPromise(RealmServer);

      return { ...server, close: this.close };
    } catch (error) {
      await this.runtime.dispose();
      throw error;
    }
  }

  public readonly close = () => this.runtime.dispose();
}
