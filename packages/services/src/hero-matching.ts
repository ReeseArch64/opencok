import { randomInt } from "node:crypto";
import { heroMatchIdentity } from "@opencok/rules/hero-matching";
import { cityInteger } from "@opencok/rules/city-progression";
import type {
  HeroMatchingRealmStore,
  HeroMatchingRegistry,
} from "@opencok/contracts/hero-matching";
import type { Rules } from "@opencok/rules/game";

export class HeroMatchingService {
  constructor(
    readonly realm: HeroMatchingRealmStore,
    readonly registry: HeroMatchingRegistry,
    readonly rules: Rules,
    readonly now = Date.now,
    readonly random: (maximum: number) => number = randomInt,
  ) {}

  async refresh() {
    const pending = await this.realm.pending();

    if (!pending.length) return;

    const at = BigInt(this.now()),
      [rawGroup, rawMatch, ...extra] = (this.rules.items.get("heroactivity")?.k3 ?? "").split("|"),
      groupSize = cityInteger(rawGroup, 1, 128),
      matchSize = cityInteger(rawMatch, 1, Math.min(16, groupSize));

    if (extra.length) throw new Error("Invalid hero matching configuration");

    for (const period of pending) {
      if (at < period.startTime || at >= period.endTime) continue;

      const periodId = heroMatchIdentity(period.definition, period.startTime);
      await this.registry.register({
        ...period,
        periodId,
        kingdomId: this.rules.kingdomId,
        registeredAt: at,
        groupSize,
        matchSize,
        shuffle: this.random(groupSize * 10),
      });
      await this.registry.match(periodId, at);
      const result = await this.registry.result(periodId, this.rules.kingdomId);

      if (result) await this.realm.apply(period.id, result);
    }
  }
}
