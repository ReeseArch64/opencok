import type { CostRankingFacts } from "@opencok/contracts/continued-cost-ranking";
import type {
  CostFinalityOwned,
  CostFinalityShared,
} from "@opencok/contracts/continued-cost-finality";

export class ContinuedCostFinalityService {
  private running?: Promise<void>;
  private cursor?: string;

  constructor(
    readonly facts: CostRankingFacts,
    readonly owned: CostFinalityOwned,
    readonly shared: CostFinalityShared,
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
    let ready = false;

    for (let page = 0; page < 4; page++)
      {if ((await this.facts.ingest(at)) < 64) {
        ready = true;
        break;
      }}

    if (!ready) {return;}

    const periods = await this.shared.candidates(this.cursor, at);

    for (const period of periods) {
      const seal = await this.owned.seal(period, at);

      if (!seal) {continue;}

      if (seal.phase === 2) {continue;}

      await this.shared.prove(period, seal, at);
      const finalized = await this.shared.finalize(period, at);

      if (finalized !== undefined) {await this.owned.acknowledge(period, finalized);}
    }

    this.cursor = periods.length === 8 ? periods.at(-1)?.id : undefined;
  }
}
