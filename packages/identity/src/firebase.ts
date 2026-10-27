import { applicationDefault, initializeApp, deleteApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { randomUUID } from "node:crypto";
import type { IdentityVerifier } from "@opencok/contracts/provisioning";
import { HttpError } from "@opencok/errors/http";

export function firebaseIdentity(projectId: string): IdentityVerifier & { close(): Promise<void> } {
  if (!/^[a-z][a-z0-9-]{4,61}[a-z0-9]$/.test(projectId))
    throw new Error("Invalid Firebase project");

  if (process.env.FIREBASE_AUTH_EMULATOR_HOST)
    throw new Error("Firebase emulator authentication is not allowed in this runtime");

  const app = initializeApp(
    { projectId, credential: applicationDefault() },
    `opencok-${randomUUID()}`,
  );

  return {
    async verify(token) {
      if (!token || token.length > 16384)
        throw new HttpError(401, "Identity authentication required");

      try {
        const verified = await getAuth(app).verifyIdToken(token, true);

        return { issuer: verified.iss, subject: verified.uid };
      } catch (error) {
        const code = error && typeof error === "object" && "code" in error ? error.code : undefined;
        const unauthorized = [
          "auth/argument-error",
          "auth/invalid-id-token",
          "auth/id-token-expired",
          "auth/id-token-revoked",
          "auth/user-disabled",
          "auth/user-not-found",
        ].includes(String(code));

        throw new HttpError(unauthorized ? 401 : 503, "Identity authentication failed");
      }
    },
    close: () => deleteApp(app),
  };
}
