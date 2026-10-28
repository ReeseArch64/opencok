import { randomUUID } from "node:crypto";
import type { AsyncHttpHandler, Log } from "@opencok/contracts/chat";
import { HttpStatus } from "@opencok/enums/http-status";
import { ChatSessionFormVerifier } from "@opencok/identity/chat-session-form";
import { ChatSessionService } from "@opencok/services/chat-session.service";

export class ChatSessionController
{
    public constructor(
        private readonly sessions: ChatSessionService,
        private readonly signingSecret: string,
        private readonly verifier = new ChatSessionFormVerifier(signingSecret),
        private readonly log: Log = () => {},
    )
    {}

    public readonly handle: AsyncHttpHandler = async (request, response) => {
        const correlationId = randomUUID();
        const reply = (status: HttpStatus, body: unknown) => {
            response.writeHead(status, {
                "content-type": "application/json; charset=utf-8",
                "x-request-id": correlationId,
            });
            response.end(JSON.stringify(body));
        };
        const fail = (status: HttpStatus, category: string) => {
            this.log({ correlationId, operation: "session.create", category });
            reply(status, { code: 0, data: {} });
        };

        if (!this.sessions.isConfigured() || !this.signingSecret)
        {
            fail(HttpStatus.ServiceUnavailable, "not_configured");

            return;
        }

        const contentType = request.headers["content-type"];

        if (
            typeof contentType !== "string"
            || !contentType.startsWith("application/x-www-form-urlencoded")
        )
        {
            fail(HttpStatus.UnsupportedMediaType, "bad_request");

            return;
        }

        try
        {
            const chunks: Buffer[] = [];
            let size = 0;

            for await (const chunk of request)
            {
                size += chunk.length;

                if (size > 16_384)
                {
                    fail(HttpStatus.PayloadTooLarge, "bad_request");

                    return;
                }

                chunks.push(chunk);
            }

            const form = new URLSearchParams(Buffer.concat(chunks).toString("utf8"));
            const formError = this.verifier.verify(form);

            if (formError)
            {
                fail(
                    formError === "unauthorized" ? HttpStatus.Forbidden : HttpStatus.BadRequest,
                    formError,
                );

                return;
            }

            const ticket = await this.sessions.create(form.get("uid")!);
            reply(HttpStatus.Ok, { code: 1, data: ticket });
        }
        catch
        {
            fail(HttpStatus.ServiceUnavailable, "storage_unavailable");
        }
    };
}
