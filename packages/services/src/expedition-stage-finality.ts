import { long, num, text } from "@opencok/contracts/rows";
import type {
    ExpeditionStageRealm,
    ExpeditionStageRegistry,
} from "@opencok/contracts/expedition-stage-finality";

export class ExpeditionStageFinalityService
{
    private running?: Promise<void>;

    constructor(
        readonly realm: ExpeditionStageRealm,
        readonly registry: ExpeditionStageRegistry,
        readonly now = Date.now,
        readonly validatedStages: ReadonlySet<number> = new Set([3, 5, 6, 7]),
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
        const now = BigInt(this.now());

        for (const period of await this.realm.candidates(now))
        {
            if (!this.validatedStages.has(period.stage))
            {
                continue;
            }

            if (!(await this.registry.verify(period)))
            {
                continue;
            }

            const closure = await this.realm.seal(period, now);

            if (!closure)
            {
                continue;
            }

            await this.registry.begin(period, closure, now);

            if (num(closure, "phase") === 0)
            {
                const page = await this.realm.page(closure);

                if (page.length)
                {
                    await this.registry.append(period, closure, page, now);
                    const cursor = page.at(-1)!.member,
                        processed = long(closure, "processed") + BigInt(page.length);
                    await this.realm.advance(closure, cursor, processed);
                    closure.cursor = cursor;
                    closure.processed = processed;
                }

                if (long(closure, "processed") !== long(closure, "scoreCount"))
                {
                    continue;
                }

                if (!(await this.registry.complete(period, closure, now)))
                {
                    await this.realm.reset(closure);
                    continue;
                }

                await this.realm.completed(closure);
            }

            const winner = await this.registry.finalize(period, now);

            if (winner !== undefined)
            {
                await this.realm.finished(
                    { ...closure, periodId: text(closure, "periodId") },
                    winner,
                    now,
                );
            }
        }
    }
}
