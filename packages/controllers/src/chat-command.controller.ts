import type { CommandContext, CommandHandler } from "@opencok/contracts/chat";
import type { ChatCommand } from "@opencok/enums/chat-command";

export abstract class ChatCommandController
{
    public abstract readonly command: ChatCommand;

    public abstract execute(context: CommandContext): Promise<unknown>;

    public readonly handle: CommandHandler = (context) => this.execute(context);
}
