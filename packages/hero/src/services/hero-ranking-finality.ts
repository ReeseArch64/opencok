import { heroFinalityPeriod, heroFinalRankKey } from "@opencok/hero/rules/hero-ranking-finality";
import { long, num, text } from "@opencok/contracts/rows";
import type {
  HeroRankFinalityRealm,
  HeroRankFinalityRegistry,
  HeroRankPeriod,
} from "@opencok/hero/contracts/hero-ranking-finality";
import type { HeroRankProjection } from "@opencok/hero/contracts/hero-rank-publication";
import type { Rules } from "@opencok/rules/game";

export class HeroRankingFinalityService {
  private running?: Promise<void>;

  constructor(
    readonly realm: HeroRankFinalityRealm,
    readonly registry: HeroRankFinalityRegistry,
    readonly projection: HeroRankProjection,
    readonly rules: Rules,
    readonly configured: readonly number[],
    readonly now = Date.now,
  ) {}

  refresh() {
    this.running ??= this.run().finally(() => {
      this.running = undefined;
    });

    return this.running;
  }

  private async run() {
    const at = BigInt(this.now()),
      candidates = await this.realm.candidates(at),
      periods = new Map<string, HeroRankPeriod>();

    for (const closure of candidates.closures) {
      const period = await this.registry.get(text(closure, "periodId"));

      if (!period) throw new Error("Missing shared hero ranking closure period");

      periods.set(period.id, period);
    }

    for (const event of candidates.events) {
      const period = heroFinalityPeriod(event, this.rules, this.configured);

      if (!period) {
        await this.realm.closeUnmatched(text(event, "uuid"), at);
        continue;
      }

      await this.registry.register(period, at);
      periods.set(period.id, period);
    }

    for (const period of await this.registry.pending(this.rules.kingdomId))
      periods.set(period.id, period);

    if (periods.size > 24) throw new Error("Hero finality refresh bound exceeded");

    for (const period of periods.values()) {
      const closure = await this.realm.seal(period, at);

      if (!closure) continue;

      if (num(closure, "phase") === 0) {
        const rows = await this.realm.page(closure);

        if (rows.length) {
          await this.projection.write(
            rows.map((row) => ({
              rankKey: heroFinalRankKey(period, num(row.score, "level")),
              member: text(row.score, "uid"),
              kingdomId: this.rules.kingdomId,
              actId: text(row.event, "uuid"),
              eventId: period.eventId,
              type: period.type,
              level: num(row.score, "level"),
              endTime: period.endTime,
              score: num(row.score, "score"),
              metadata: row.metadata,
            })),
            at,
          );
          const processed = long(closure, "processed") + BigInt(rows.length),
            cursor = text(rows.at(-1)!.score, "uid");
          await this.realm.advance(closure, cursor, processed);
          closure.processed = processed;
          closure.cursor = cursor;
        }

        if (long(closure, "processed") !== long(closure, "scoreCount")) continue;

        if (!(await this.registry.complete(period, closure, at))) {
          await this.realm.reset(closure);
          continue;
        }

        await this.realm.completed(period.id);
      }

      await this.registry.finalize(period, at);
      const result = await this.registry.result(period.id);

      if (result) await this.realm.finished(period.id, result.kingdomRank);
    }
  }
}
