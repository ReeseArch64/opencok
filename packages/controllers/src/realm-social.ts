import type { RealmSocialCommandService } from "@opencok/contracts/realm-social";
import type { AsyncHttpHandler } from "@opencok/contracts/chat";
import { isRecord } from "@opencok/contracts/chat";
import { verifyRealmSocial } from "@opencok/identity/realm-social";
import { decode, encode } from "@opencok/messages/sfs";
import { chatSocialInput, chatSocialResponse } from "@opencok/mappings/chat-social";
import { ChatCommandError } from "@opencok/errors/chat";

export class RealmSocialController {
  constructor(
    readonly service: RealmSocialCommandService,
    readonly signingSecret: string,
  ) {}

  readonly handle: AsyncHttpHandler = async (request, response) => {
    const reply = (status: number, data: unknown) => {
      if (response.writableEnded) {return;}

      response.writeHead(status, {
        "content-type": "application/json",
        "cache-control": "no-store",
      });
      response.end(
        JSON.stringify({
          code: status === 200 && !(isRecord(data) && typeof data.error === "string") ? 1 : 0,
          data,
        }),
      );
    };
    const timer = setTimeout(() => {
      reply(503, {});
      request.destroy();
    }, 3000);

    try {
      if (!/^application\/json(?:\s*;|$)/i.test(String(request.headers["content-type"] ?? ""))) {
        reply(415, {});

        return;
      }

      let size = 0;
      const chunks: Buffer[] = [];

      for await (const chunk of request) {
        const bytes = Buffer.from(chunk);
        size += bytes.length;

        if (size > 24_576) {
          reply(413, {});

          return;
        }

        chunks.push(bytes);
      }

      const body = new TextDecoder("utf-8", { fatal: true }).decode(Buffer.concat(chunks));

      if (
        !verifyRealmSocial(
          body,
          request.headers["x-opencok-timestamp"],
          request.headers["x-opencok-signature"],
          this.signingSecret,
          Date.now(),
        )
      ) {
        reply(403, {});

        return;
      }

      const input: unknown = JSON.parse(body);

      if (
        !isRecord(input) ||
        typeof input.owner !== "string" ||
        !/^[a-zA-Z0-9_-]{1,40}$/.test(input.owner) ||
        !Number.isInteger(input.realm) ||
        Number(input.realm) < 1 ||
        typeof input.command !== "string" ||
        typeof input.operationId !== "string" ||
        typeof input.params !== "string" ||
        !/^[a-zA-Z0-9+/]*={0,2}$/.test(input.params)
      ) {
        reply(400, {});

        return;
      }

      const params = chatSocialInput(decode(Buffer.from(input.params, "base64")));
      const result = await this.service.execute(
        input.owner,
        Number(input.realm),
        input.command,
        params,
        input.operationId,
      );
      reply(200, encode(chatSocialResponse(result)).toString("base64"));
    } catch (error) {
      if (error instanceof ChatCommandError) {reply(200, { error: error.code });}
      else {reply(503, {});}
    } finally {
      clearTimeout(timer);
    }
  };
}

export function createRealmSocialHandler(options: {
  service: RealmSocialCommandService;
  signingSecret: string;
}): AsyncHttpHandler {
  return new RealmSocialController(options.service, options.signingSecret).handle;
}
