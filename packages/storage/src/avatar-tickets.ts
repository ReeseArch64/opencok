import { createHash, randomBytes } from "node:crypto";
import type { AvatarTickets } from "@opencok/contracts/files";
import { HttpError } from "@opencok/errors/http";

export function createAvatarTickets(
  command: (name: string, ...args: string[]) => Promise<unknown>,
  now = Date.now,
): AvatarTickets {
  const key = (token: string) =>
    `opencok:avatar:ticket:${createHash("sha256").update(token).digest("hex")}`;

  return {
    async issue(owner, sequence, purpose) {
      if (
        !/^[0-9]{1,20}$/.test(owner) ||
        !Number.isInteger(sequence) ||
        sequence < 1 ||
        sequence > 999999
      )
        {throw new Error("Invalid avatar ticket input");}

      const seconds = purpose === "upload" ? 120 : 30;
      const token = `v2.${randomBytes(32).toString("hex")}`;
      const expires = now() + seconds * 1000;

      if (!Number.isSafeInteger(expires) || expires < 0) {throw new Error("Invalid avatar clock");}

      const value = JSON.stringify({ owner, seq: String(sequence), purpose, expires });

      if ((await command("SET", key(token), value, "EX", String(seconds), "NX")) !== "OK")
        {throw new Error("Avatar authorization unavailable");}

      return token;
    },
    async verify(token, purpose) {
      if (!/^v2\.[a-f0-9]{64}$/.test(token))
        {throw new HttpError(401, "Invalid avatar authorization");}

      const raw = await command("GET", key(token));

      if (typeof raw !== "string" || raw.length > 512)
        {throw new HttpError(401, "Invalid avatar authorization");}

      let value;

      try {
        value = JSON.parse(raw);
      } catch {
        throw new HttpError(401, "Invalid avatar authorization");
      }

      if (
        value === null ||
        typeof value !== "object" ||
        typeof value.owner !== "string" ||
        !/^[0-9]{1,20}$/.test(value.owner) ||
        typeof value.seq !== "string" ||
        !/^[1-9][0-9]{0,5}$/.test(value.seq) ||
        value.purpose !== purpose ||
        !Number.isSafeInteger(value.expires) ||
        value.expires <= now() ||
        value.expires > now() + (purpose === "upload" ? 120000 : 30000)
      )
        {throw new HttpError(401, "Invalid avatar authorization");}

      return { owner: value.owner, seq: value.seq };
    },
  };
}
