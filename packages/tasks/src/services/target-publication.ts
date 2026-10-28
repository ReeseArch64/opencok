import { decode, str, fields, Type, encode, type Fields } from "@opencok/messages/sfs";
import { targetFailure } from "../validations/target-failure";
import { TargetTaskCommand } from "../enums/target-command";

export class TargetTaskPublicationService
{
    public readonly publishTargetTaskMutation = async (
        payload: Uint8Array,
        publish: (owner: string, command: string, body: Fields) => Promise<void>,
    ) => {
        const data = decode(Buffer.from(payload)),
            owner = str(data, "owner"),
            body = fields(data.body);

        if (
            !owner
            || owner.length > 40
            || body.rewardlist?.type !== Type.Array
            || body.receive_mode?.type !== Type.Bool
            || body.receive_mode.value !== true
        )
        {
            targetFailure();
        }

        encode(body);
        await publish(owner, TargetTaskCommand.Push, body);
    };
}
