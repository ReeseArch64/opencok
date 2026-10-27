import type {
  GoldEggsRanks,
  GoldEggsRuntimeStore,
  GoldEggsPeriod,
} from "@opencok/contracts/gold-eggs";
import { goldEggsCalendar, goldEggsEnabled } from "@opencok/rules/gold-eggs";
import type { Rules } from "@opencok/rules/game";

export class GoldEggsRuntime {
  private running?: Promise<void>;
  private nextAt = 0;

  constructor(
    readonly store: GoldEggsRuntimeStore,
    readonly ranks: GoldEggsRanks,
    readonly rules: Rules,
    readonly deliver: (owner: string, period: GoldEggsPeriod, global: boolean) => Promise<unknown>,
    readonly now = Date.now,
  ) {}

  refresh() {
    this.running ??= this.run().finally(() => {
      this.running = undefined;
    });

    return this.running;
  }

  private async run() {
    const captured = this.now();

    if (!Number.isSafeInteger(captured) || captured < 0)
      {throw new Error("Invalid gold eggs runtime clock");}

    if (captured < this.nextAt || !goldEggsEnabled(this.rules, BigInt(captured))) {return;}

    const at = BigInt(captured);
    await this.store.advance(goldEggsCalendar(this.rules, at), at);

    for (const period of await this.store.periods()) {
      if (!period.admitted || !period.global || at <= period.end) {continue;}

      const rows = await this.ranks.final(period);

      if (rows !== undefined) {await this.store.finalizeGlobal(period, rows, at);}
    }

    for (const award of await this.store.pending()) {
      try {
        await this.deliver(award.owner, award.period, award.global);
      } catch {}
    }

    this.nextAt = captured + 60000;
  }
}
