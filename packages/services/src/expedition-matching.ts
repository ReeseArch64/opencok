import { expeditionCalendarPhases } from "@opencok/rules/expedition-calendar";
import type { Row } from "@opencok/contracts/rows";
import { long, text } from "@opencok/contracts/rows";
import type {
    ExpeditionMatchingRealmStore,
    ExpeditionMatchingRegistry,
    ExpeditionMatchConfiguration,
} from "@opencok/contracts/expedition-matching";
import { expeditionMatchingConfiguration } from "@opencok/rules/expedition-matching";
import type { Rules } from "@opencok/rules/game";

export class ExpeditionMatchingService
{
    private running?: Promise<void>;

    constructor(
        readonly calendar: { refresh(): Promise<Row | undefined>; },
        readonly realm: ExpeditionMatchingRealmStore,
        readonly registry: ExpeditionMatchingRegistry,
        readonly rules: Rules,
        readonly now = Date.now,
    )
    {}

    refresh()
    {
        this.running ??= this.run().finally(() => {
            this.running = undefined;
        });

        return this.running;
    }

    private async run()
    {
        const period = await this.calendar.refresh();

        if (!period)
        {
            return;
        }

        if (!text(period, "expectedRealms").split("|").includes(String(this.rules.kingdomId)))
        {
            return;
        }

        const window = expeditionCalendarPhases(period).find((row) => row.stage === 1);

        if (!window || BigInt(this.now()) < window.startTime)
        {
            return;
        }

        let config: ExpeditionMatchConfiguration | undefined;

        try
        {
            config = expeditionMatchingConfiguration(this.rules);
        }
        catch
        {
            config = undefined;
        }

        const admission = await this.realm.admit(period, !!config);

        if (admission && long(admission, "appliedAt") === 0n)
        {
            await this.registry.register(period, admission, config, BigInt(this.now()));
        }

        await this.registry.finalize(period, config, BigInt(this.now()));
        const result = await this.registry.result(period, this.rules.kingdomId);

        if (result)
        {
            await this.realm.apply(period, result);
        }
    }
}
