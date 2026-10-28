import type { ChatServerListResponse } from "@opencok/contracts/responses/chat-server-list.response";

export class ChatServerListMapper
{
    public map(url: URL): ChatServerListResponse
    {
        return {
            code: 1,
            data: [
                {
                    ip: url.hostname,
                    port: url.port || (url.protocol === "wss:" ? "443" : "80"),
                    protocol: url.protocol.slice(0, -1),
                },
            ],
            message: "success",
        };
    }
}
