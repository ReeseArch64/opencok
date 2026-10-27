import { createHmac, timingSafeEqual } from "node:crypto";
import type { SignedRequestDomain } from "@opencok/enums/signed-request-domain";

export abstract class SignedChatRequest {
  protected abstract readonly domain: SignedRequestDomain;

  protected abstract readonly path: string;

  protected constructor(private readonly secret: string) {}

  public sign(body: string, timestamp: string): string {
    return createHmac("sha256", this.secret)
      .update(`${this.domain}\nPOST\n${this.path}\n${timestamp}\n${body}`)
      .digest("hex");
  }

  public verify(body: string, timestamp: unknown, signature: unknown, now: number): boolean {
    if (
      !this.secret ||
      typeof timestamp !== "string" ||
      !/^(0|[1-9][0-9]{0,15})$/.test(timestamp) ||
      !Number.isSafeInteger(Number(timestamp)) ||
      !Number.isSafeInteger(now) ||
      now < 0 ||
      Math.abs(now - Number(timestamp)) > 30000 ||
      typeof signature !== "string" ||
      !/^[a-f0-9]{64}$/.test(signature)
    )
      {return false;}

    return timingSafeEqual(
      Buffer.from(signature, "hex"),
      Buffer.from(this.sign(body, timestamp), "hex"),
    );
  }
}
