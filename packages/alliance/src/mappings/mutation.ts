import { encode, sfs, type Fields } from "@opencok/messages/sfs";
import type { MutationEvent } from "@opencok/ledger/contracts/mutation";
import type { AllianceRecordReaders } from "../contracts/readers";
import type { AllianceContextWrite } from "../contracts/context-state";
import { AllianceMutationCommand, AllianceMutationEvent } from "../enums/mutation";

export class AllianceMutationMapper
{
    public constructor(private readonly runtime: Pick<AllianceRecordReaders, "text">)
    {}

    public request(request: Fields): Buffer
    {
        return encode(request);
    }

    public giftRequest(eventId: string, type: number): Buffer
    {
        return encode({ eventId: sfs.string(eventId), type: sfs.int(type) });
    }

    public gift(allianceId: string): MutationEvent
    {
        return {
            id: "alliance",
            type: AllianceMutationEvent.Changed,
            payload: encode({
                allianceId: sfs.string(allianceId),
                members: sfs.array([]),
                command: sfs.string(AllianceMutationCommand.Reward),
            }),
        };
    }

    public changed(
        context: { allianceId: string; write: AllianceContextWrite; },
        command: string,
    ): MutationEvent
    {
        const { text } = this.runtime;

        return {
            id: "alliance",
            type: AllianceMutationEvent.Changed,
            payload: encode({
                allianceId: sfs.string(
                    context.allianceId
                        || text(context.write.alliances?.[0] ?? {}, "uid"),
                ),
                members: sfs.array(
                    (context.write.memberships ?? []).map((row) =>
                        sfs.object({
                            uid: sfs.string(row.uid),
                            allianceId: sfs.string(row.allianceId),
                        })
                    ),
                ),
                command: sfs.string(command),
            }),
        };
    }
}
