import type { ChatDiscoverySettings } from "@opencok/contracts/chat-discovery-settings";
import { ChatServerListMapper } from "@opencok/mappings/chat-server-list.mapper";
import { ChatDiscoveryController } from "./chat-discovery.controller.ts";

export class ChatServerListController extends ChatDiscoveryController
{
    protected readonly unavailable = "{\"code\":0,\"data\":[]}";

    public constructor(
        settings: ChatDiscoverySettings,
        private readonly mapper = new ChatServerListMapper(),
    )
    {
        super(settings);
    }

    protected response(): object
    {
        return this.mapper.map(this.endpoint.url);
    }
}
