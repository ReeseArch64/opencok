import { costRankingPlan } from "@opencok/rules/continued-cost-ranking";
import { text } from "@opencok/contracts/rows";
import type {
  CostRankingFacts,
  CostRankingRegistry,
  CostRankingPeriod,
} from "@opencok/contracts/continued-cost-ranking";
import type { Rules } from "@opencok/rules/game";

export class ContinuedCostRankingService {
  private running?: Promise<void>;
  private cursor?: string;

  constructor(
    readonly facts: CostRankingFacts,
    readonly registry: CostRankingRegistry,
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
    const at = BigInt(this.now());

    for (let page = 0; page < 4; page++) if ((await this.facts.ingest(at)) < 64) break;

    const source = await this.facts.periods(this.cursor),
      tail = source.at(-1),
      periods = new Map<string, CostRankingPeriod>(),
      plan = costRankingPlan(this.rules, this.configured);

    if (plan) {
      const existing = await this.registry.get(plan.id);

      if (existing) {
        if (existing.expectedRealms.includes(this.rules.kingdomId))
          periods.set(existing.id, existing);
      } else if (
        (at >= plan.startTime - 3600000n && at < plan.endTime) ||
        source.some((row) => row.id === plan.id)
      )
        periods.set(plan.id, await this.registry.register(plan, at));
    }

    for (const row of source) {
      const period = await this.registry.get(text(row, "id"));

      if (period && period.expectedRealms.includes(this.rules.kingdomId))
        periods.set(period.id, period);
    }

    for (const period of periods.values())
      await this.registry.write(period, await this.facts.top(period), at);

    this.cursor = source.length === 8 && tail ? text(tail, "id") : undefined;
  }

  async board(fallback: () => Promise<readonly string[]>) {
    const plan = costRankingPlan(this.rules, this.configured);

    if (!plan) return fallback();

    return (await this.registry.board(plan.id)) ?? fallback();
  }
}
