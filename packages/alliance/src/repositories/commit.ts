import { eq } from "drizzle-orm";
import { timed_activity } from "@opencok/drizzle/schema/opencok_kingdom/timed_activity";
import { TimedActivityAction } from "@opencok/enums/timed-activity-action";
import type { AllianceTransaction } from "../contracts/persistence";
import type { AllianceCommitRuntime } from "../contracts/gameplay-runtime";
import type { AlliancePlan } from "../contracts/mutation";
import type { AllianceWriteRepository } from "./writes";

export class AllianceCommitRepository
{
    public constructor(
        private readonly runtime: AllianceCommitRuntime,
        private readonly writer: Pick<AllianceWriteRepository, "write">,
    )
    {}

    public async apply(
        tx: AllianceTransaction,
        owner: string,
        result: AlliancePlan,
        participants: readonly string[],
        groups: readonly string[],
        at: bigint,
    )
    {
        const { text, long, domains, boundary, recordAction } = this.runtime;
        const apply = async () => {
            for (const row of result.write.activities ?? [])
            {
                const [saved] = await tx
                    .select()
                    .from(timed_activity)
                    .where(eq(timed_activity.id, text(row, "id")));
                const domain = domains.get(Number(row.type));

                if (!saved || !domain)
                {
                    throw new Error("Unsupported helped activity");
                }

                await domain(
                    tx,
                    TimedActivityAction.Reschedule,
                    {
                        ...saved,
                        dueAt: long(row, "dueAt"),
                        version: Number(row.version),
                    },
                    at,
                    {
                        resource()
                        {
                            throw new Error("Unexpected help resource change");
                        },
                        gold()
                        {
                            throw new Error("Unexpected help gold change");
                        },
                        item()
                        {
                            throw new Error("Unexpected help item change");
                        },
                    },
                );
            }

            await this.writer.write(
                tx,
                owner,
                result.write,
                participants,
                groups,
            );

            for (const action of result.write.actions ?? [])
            {
                if (!participants.includes(action.uid))
                {
                    throw new Error("Foreign alliance action");
                }

                await recordAction?.(tx, action.uid, action.kind, action.count, at);
            }
        };
        let change = apply;

        for (
            const owner of [...new Set(result.productionOwners ?? [])].sort()
                .reverse()
        )
        {
            if (!participants.includes(owner))
            {
                throw new Error("Foreign alliance production owner");
            }

            const nested = change;
            change = () =>
                boundary(tx, owner, result.productionAt ?? at, nested, [], {
                    resource()
                    {
                        throw new Error("Unexpected alliance production credit");
                    },
                    gold()
                    {
                        throw new Error("Unexpected alliance gold credit");
                    },
                    item()
                    {
                        throw new Error("Unexpected alliance item credit");
                    },
                });
        }

        await change();
    }
}
