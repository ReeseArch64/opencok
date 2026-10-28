import type { AsyncHttpHandler, Log, SessionStore } from "@opencok/contracts/chat";
import { ChatSessionFormVerifier } from "@opencok/identity/chat-session-form";
import { ChatSessionService } from "@opencok/services/chat-session.service";
import { ChatSessionController } from "./chat-session.controller.ts";

export function verifyForm(form: URLSearchParams, secret: string)
{
    return new ChatSessionFormVerifier(secret).verify(form);
}

export function createSessionHandler({
    sessionStore,
    signingSecret,
    now = Date.now,
    log = () => {},
}: {
    sessionStore: SessionStore;
    signingSecret: string;
    now?: () => number;
    log?: Log;
}): AsyncHttpHandler
{
    return new ChatSessionController(
        new ChatSessionService(sessionStore, now),
        signingSecret,
        new ChatSessionFormVerifier(signingSecret),
        log,
    ).handle;
}
