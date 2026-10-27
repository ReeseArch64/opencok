import { createHash, randomBytes } from "node:crypto";
import type { ChatSessionTicket, SessionStore } from "@opencok/contracts/chat";

export class ChatSessionService {
  public constructor(
    private readonly store: SessionStore,
    private readonly now: () => number = Date.now,
  ) {}

  public isConfigured(): boolean {
    return Boolean(this.store && typeof this.store.create === "function");
  }

  public async create(uid: string): Promise<ChatSessionTicket> {
    const session = randomBytes(32).toString("base64url");
    const createdAt = new Date(this.now());
    const expire = Math.floor(createdAt.getTime() / 1000) + 86_400;
    let timer: ReturnType<typeof setTimeout> | undefined;

    try {
      await Promise.race([
        this.store.create({
          tokenHash: createHash("sha256").update(session).digest(),
          uid,
          createdAt,
          expiresAt: new Date(expire * 1000),
        }),
        new Promise<never>((_, reject) => {
          timer = setTimeout(() => reject(new Error("chat storage timeout")), 3_000);
        }),
      ]);
    } finally {
      clearTimeout(timer);
    }

    return { session, expire };
  }
}
