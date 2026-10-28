import type { ExpeditionCalendarStore } from "@opencok/contracts/expedition-calendar";
import { expeditionCalendarPlan } from "@opencok/rules/expedition-calendar";
import type { Rules } from "@opencok/rules/game";

export class ExpeditionCalendarService
{
    constructor(
        readonly store: ExpeditionCalendarStore,
        readonly rules: Rules,
        readonly realms: readonly number[],
        readonly now = Date.now,
    )
    {}

    refresh()
    {
        return this.store.reconcile((state) =>
            expeditionCalendarPlan(state, this.rules, this.realms, BigInt(this.now()))
        );
    }
}
