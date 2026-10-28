import { ChatApplication } from "./chat-application.ts";
import type { ChatApplicationOptions } from "./chat-application-options.ts";

export function createChatApp(options: ChatApplicationOptions): ChatApplication
{
    return new ChatApplication(options);
}
