import { int, str, type Fields } from "@opencok/messages/sfs";
import type { CosmeticRecipientRuntime } from "../contracts/runtime";
import { CosmeticCommand } from "../enums/command";

export class CosmeticParticipants
{
    public constructor(private readonly runtime: CosmeticRecipientRuntime)
    {}

    public readonly cosmeticInteractionParticipants = (
        owner: string,
        command: string,
        params: Fields,
    ) => {
        const { playerItemGiftRecipient } = this.runtime;
        if (
            command !== CosmeticCommand.TriggerActivity
            || int(params, "type", -1) !== 45
            || !str(params, "uid", "").trim()
        )
        {
            return;
        }

        return [...new Set([owner, playerItemGiftRecipient(str(params, "uid"))])];
    };
}
