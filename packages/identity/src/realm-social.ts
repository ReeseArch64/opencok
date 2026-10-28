import { realmSocialPath } from "@opencok/contracts/realm-social";
import { SignedRequestDomain } from "@opencok/enums/signed-request-domain";
import { SignedChatRequest } from "./signed-chat-request.ts";

export class RealmSocialSignature extends SignedChatRequest
{
    protected readonly domain = SignedRequestDomain.RealmSocial;
    protected readonly path = realmSocialPath;

    public constructor(secret: string)
    {
        super(secret);
    }
}

export function signRealmSocial(body: string, timestamp: string, secret: string): string
{
    return new RealmSocialSignature(secret).sign(body, timestamp);
}

export function verifyRealmSocial(
    body: string,
    timestamp: unknown,
    signature: unknown,
    secret: string,
    now: number,
): boolean
{
    return new RealmSocialSignature(secret).verify(body, timestamp, signature, now);
}
