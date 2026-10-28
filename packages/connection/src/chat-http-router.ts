import { realmSocialPath } from "@opencok/contracts/realm-social";
import { chatMailboxPath } from "@opencok/contracts/chat-mailbox";
import { chatAvatarProfilePath } from "@opencok/contracts/chat-avatar-profile";
import { chatNicknamePath } from "@opencok/contracts/chat-nickname";
import type { HttpHandler } from "@opencok/contracts/chat";

import type { ChatHttpOptions } from "@opencok/contracts/chat-http-options";

export class ChatHttpRouter
{
    public constructor(private readonly options: ChatHttpOptions)
    {
        this.options = { ...options };
    }

    public readonly route: HttpHandler = (request, response) => {
        const {
            isReady = () => true,
            sessionHandler,
            profileHandler,
            nicknameHandler,
            mailboxHandler,
            socialHandler,
            configHandler,
            serverListHandler,
        } = this.options;

        if (request.method === "GET" && request.url?.split("?", 1)[0] === "/api/v1global_config")
        {
            if (configHandler)
            {
                configHandler(request, response);
            }
            else
            {
                response.writeHead(503, { "content-type": "application/json; charset=utf-8" });
                response.end("{\"code\":0,\"data\":{}}");
            }

            return;
        }

        if (
            request.method === "GET"
            && ["/chat/server/links", "/chat/server/all"].includes(
                request.url?.split("?", 1)[0] ?? "",
            )
        )
        {
            if (serverListHandler)
            {
                serverListHandler(request, response);
            }
            else
            {
                response.writeHead(503, { "content-type": "application/json; charset=utf-8" });
                response.end("{\"code\":0,\"data\":[]}");
            }

            return;
        }

        if (request.method === "POST" && request.url === "/external/session")
        {
            if (sessionHandler)
            {
                void sessionHandler(request, response);
            }
            else
            {
                response.writeHead(503, { "content-type": "application/json; charset=utf-8" });
                response.end("{\"code\":0,\"data\":{}}");
            }

            return;
        }

        if (request.method === "POST" && request.url === chatAvatarProfilePath)
        {
            if (profileHandler)
            {
                void profileHandler(request, response);
            }
            else
            {
                response.writeHead(503, { "content-type": "application/json; charset=utf-8" });
                response.end("{\"code\":0,\"data\":{}}");
            }

            return;
        }

        if (request.method === "POST" && request.url === chatNicknamePath)
        {
            if (nicknameHandler)
            {
                void nicknameHandler(request, response);
            }
            else
            {
                response.writeHead(503, { "content-type": "application/json; charset=utf-8" });
                response.end("{\"code\":0,\"data\":{}}");
            }

            return;
        }

        if (request.method === "POST" && request.url === realmSocialPath)
        {
            if (socialHandler)
            {
                void socialHandler(request, response);
            }
            else
            {
                response.writeHead(503);
                response.end();
            }

            return;
        }

        if (request.method === "POST" && request.url === chatMailboxPath)
        {
            if (mailboxHandler)
            {
                void mailboxHandler(request, response);
            }
            else
            {
                response.writeHead(503, { "content-type": "application/json; charset=utf-8" });
                response.end("{\"code\":0,\"data\":{}}");
            }

            return;
        }

        response.setHeader("Content-Type", "text/plain; charset=utf-8");

        if (request.method === "GET" && request.url === "/_health")
        {
            let ready = false;

            try
            {
                ready = isReady() === true;
            }
            catch
            {
                ready = false;
            }

            response.writeHead(ready ? 200 : 503);
            response.end(ready ? "ok\n" : "unavailable\n");

            return;
        }

        response.writeHead(404);
        response.end("not found\n");
    };
}
