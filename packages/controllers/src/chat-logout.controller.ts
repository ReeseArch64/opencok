import type { CommandContext, SessionStore } from "@opencok/contracts/chat";
import { ChatCommand } from "@opencok/enums/chat-command";
import { ChatCommandController } from "./chat-command.controller.ts";

export class ChatLogoutController extends ChatCommandController
{
    public readonly command = ChatCommand.Logout;

    public constructor(private readonly sessions: SessionStore)
    {
        super();
    }

    public async execute({ uid }: CommandContext)
    {
        await this.sessions.revoke?.(uid);

        return { status: "ok" };
    }
}
