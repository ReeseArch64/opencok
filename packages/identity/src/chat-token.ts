import type { SessionStore, TokenVerifier } from "@opencok/contracts/chat";
import { createHash } from "node:crypto";

export function createTokenVerifier(sessionStore: SessionStore): TokenVerifier {
  return async (token, claimedUid) => {
    if (typeof token !== "string" || !/^[A-Za-z0-9_-]{43}$/.test(token)) return null;
    if (
      claimedUid !== undefined &&
      (typeof claimedUid !== "string" || !claimedUid || claimedUid.length > 40)
    )
      return null;
    const decoded = Buffer.from(token, "base64url");
    if (decoded.length !== 32 || decoded.toString("base64url") !== token) return null;

    const tokenHash = createHash("sha256").update(token).digest();
    const session = await sessionStore.findByTokenHash(tokenHash);
    if (!session?.uid) return null;
    return claimedUid === undefined || session.uid === claimedUid ? { uid: session.uid } : null;
  };
}
