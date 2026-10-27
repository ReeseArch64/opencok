import { HttpStatus } from "@opencok/enums/http-status";
import { randomUUID } from "node:crypto";
import type { IncomingMessage } from "node:http";
import type { AsyncHttpHandler, Log } from "@opencok/contracts/chat";

export abstract class SignedChatController<T extends object, Result> {
  private readonly timeoutMs: number;
  private readonly now: () => number;
  private readonly log: Log;

  protected constructor(
    signingSecret: string,
    options: { now?: () => number; timeoutMs?: number; log?: Log },
    configured: boolean,
    configurationError: string,
  ) {
    this.timeoutMs = options.timeoutMs ?? 3000;
    this.now = options.now ?? Date.now;
    this.log = options.log ?? (() => {});

    if (
      !signingSecret ||
      !configured ||
      !Number.isInteger(this.timeoutMs) ||
      this.timeoutMs < 100 ||
      this.timeoutMs > 30000
    )
      throw new Error(configurationError);
  }

  protected abstract readonly operation: string;

  protected abstract verify(body: string, request: IncomingMessage, now: number): boolean;

  protected abstract decode(body: string): T;

  protected abstract apply(update: Readonly<T>): Promise<Result>;

  protected abstract response(update: T, result: Result): object;

  public readonly handle: AsyncHttpHandler = async (request, response) => {
    const correlationId = randomUUID();
    const reply = (status: number, data: unknown) => {
      response.writeHead(status, {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "no-store",
        "x-request-id": correlationId,
      });
      response.end(JSON.stringify({ code: status === HttpStatus.Ok ? 1 : 0, data }));
    };
    const fail = (status: number, category: string) => {
      this.log({ correlationId, operation: this.operation, category });
      reply(status, {});
    };

    if (!/^application\/json(?:\s*;|$)/i.test(String(request.headers["content-type"] ?? ""))) {
      fail(HttpStatus.UnsupportedMediaType, "bad_request");

      return;
    }

    const length = request.headers["content-length"];

    if (
      length !== undefined &&
      (typeof length !== "string" || !/^\d+$/.test(length) || Number(length) > 4096)
    ) {
      fail(HttpStatus.PayloadTooLarge, "bad_request");

      return;
    }

    let expired = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const run = async () => {
      const chunks: Buffer[] = [];
      let size = 0;

      for await (const chunk of request) {
        if (expired) throw new Error();

        const bytes = Buffer.from(chunk);
        size += bytes.length;

        if (size > 4096)
          return { status: HttpStatus.PayloadTooLarge, category: "bad_request" } as const;

        chunks.push(bytes);
      }

      if (expired) throw new Error();

      let body: string;

      try {
        body = new TextDecoder("utf-8", { fatal: true, ignoreBOM: true }).decode(
          Buffer.concat(chunks),
        );
      } catch {
        return { status: HttpStatus.BadRequest, category: "bad_request" } as const;
      }

      if (!this.verify(body, request, this.now()))
        return { status: HttpStatus.Forbidden, category: "unauthorized" } as const;

      let update: T;

      try {
        update = this.decode(body);
      } catch {
        return { status: HttpStatus.BadRequest, category: "bad_request" } as const;
      }

      const result = await this.apply(Object.freeze(update));

      return { status: HttpStatus.Ok, data: this.response(update, result) } as const;
    };

    try {
      const result = await Promise.race([
        run(),
        new Promise<never>((_, reject) => {
          timer = setTimeout(() => {
            expired = true;
            reject(new Error());
          }, this.timeoutMs);
        }),
      ]);

      if (result.status === HttpStatus.Ok) reply(HttpStatus.Ok, result.data);
      else fail(result.status, result.category);
    } catch {
      fail(HttpStatus.ServiceUnavailable, "storage_unavailable");
    } finally {
      expired = true;
      clearTimeout(timer);
    }
  };
}
