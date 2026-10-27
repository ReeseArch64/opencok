import { heroCalendarPlan } from "@opencok/hero/rules/hero-calendar";
import type { HeroCalendarStore } from "@opencok/hero/contracts/hero-calendar";
import type { Rules } from "@opencok/rules/game";

export class HeroCalendarService {
  constructor(
    readonly store: HeroCalendarStore,
    readonly rules: Rules,
    readonly now = Date.now,
  ) {}

  refresh() {
    return this.store.reconcile((state) => heroCalendarPlan(state, this.rules, BigInt(this.now())));
  }
}
