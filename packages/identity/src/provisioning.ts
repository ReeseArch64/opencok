import { createHmac, timingSafeEqual } from "node:crypto";
import { provisionPath } from "@opencok/contracts/provisioning";

export function signProvisioning(
  body: string,
  timestamp: string,
  secret: string,
  response = false,
): string {
  return createHmac("sha256", secret)
    .update(
      `opencok-character-v1\n${response ? "RESPONSE" : "POST"}\n${provisionPath}\n${timestamp}\n${body}`,
    )
    .digest("hex");
}

export function verifyProvisioning(
  body: string,
  timestamp: string | null,
  signature: string | null,
  secret: string,
  now = Date.now(),
  response = false,
): boolean {
  if (
    !secret ||
    !timestamp ||
    !/^[0-9]{1,16}$/.test(timestamp) ||
    !Number.isSafeInteger(Number(timestamp)) ||
    Math.abs(now - Number(timestamp)) > 30000 ||
    !signature ||
    !/^[a-f0-9]{64}$/.test(signature)
  )
    {return false;}

  return timingSafeEqual(
    Buffer.from(signature, "hex"),
    Buffer.from(signProvisioning(body, timestamp, secret, response), "hex"),
  );
}
