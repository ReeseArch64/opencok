import { heroCalendarPlan } from "@opencok/rules/hero-calendar";
import type { HeroCalendarStore } from "@opencok/contracts/hero-calendar";
import type { Rules } from "@opencok/rules/game";
export class HeroCalendarService {
  constructor(
    readonly store: HeroCalendarStore,
    readonly rules: Rules,
    readonly now = Date.now,
  ) {}
  refresh() {
    const at = BigInt(this.now());
    return this.store.reconcile((state) => heroCalendarPlan(state, this.rules, at));
  }
}
