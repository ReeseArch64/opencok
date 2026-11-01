import { encode, sfs, type Fields } from "@opencok/messages/sfs";
import type { CosmeticRecord } from "../contracts/records";
import type { CosmeticCatalog, CosmeticContext } from "../contracts/context";
import type { CosmeticReaders } from "../contracts/runtime";
import { CosmeticPolicy } from "../rules/projection";
import { CosmeticMapper } from "./cosmetics";
import { cosmeticKinds } from "../enums/kind";

export class CosmeticEventMapper<
    TCatalog extends CosmeticCatalog,
    TContext extends CosmeticContext<TCatalog>,
>
{
    public constructor(
        private readonly runtime: Pick<CosmeticReaders, "num" | "long">,
        private readonly policy: CosmeticPolicy<TCatalog>,
        private readonly mapper: CosmeticMapper,
        private readonly cosmeticTargetStates: (context: TContext) => readonly CosmeticRecord[],
    )
    {}

    public readonly cosmeticInteractionEvent = (
        context: TContext,
        statusResponse?: Fields,
    ): Uint8Array | null => {
        const { num, long } = this.runtime;
        const { cosmeticTargetStates } = this;
        const { cityCosmeticProjection } = this.policy;
        const { cityCosmeticFields } = this.mapper;
        const changed = context.write.cosmeticChanges;

        if (!changed?.length)
        {
            return null;
        }

        const target = context.state.cosmeticTarget;

        if (
            !target
            || target.realm !== context.rules.kingdomId
            || changed.length > 64
            || changed.some((row) => row.uid !== target.uid)
        )
        {
            throw new Error("Invalid cosmetic interaction changes");
        }

        const states = target.uid === context.owner
            ? (context.write.states ?? context.state.effects.states)
            : cosmeticTargetStates(context);
        const kinds = new Set<number>();
        const updates = changed.map((change) => {
            const row = states.find((row) => row.stateId === change.id);

            if (!row)
            {
                throw new Error("Missing changed cosmetic status");
            }

            const type = num(row, "type2");

            if (!cosmeticKinds.includes(type))
            {
                throw new Error("Unsupported cosmetic status kind");
            }

            kinds.add(type);
            const body: Fields = {
                effectState: sfs.object({
                    [String(change.id)]: sfs.long(
                        long(row, "endTime") === 9223372036854775807n
                            ? 2147000000000n
                            : long(row, "endTime"),
                    ),
                    startTime: sfs.long(long(row, "startTime")),
                }),
                statusId: sfs.int(change.id),
                endTime: sfs.long(long(row, "endTime")),
                status: sfs.array([]),
                ...(change.previous === undefined
                    ? {}
                    : { oldStatus: sfs.string(String(change.previous)) }),
            };

            return sfs.object({ kind: sfs.int(type), body: sfs.object(statusResponse ?? body) });
        });

        return encode({
            owner: sfs.string(context.owner),
            uid: sfs.string(target.uid),
            point: sfs.int(target.point),
            statuses: sfs.array(updates),
            kinds: sfs.array([...kinds].map(sfs.int)),
            projection: sfs.object(
                cityCosmeticFields(cityCosmeticProjection(states, context.rules, context.now)),
            ),
        });
    };
}
