import { observedFetch } from "@opencok/core/fetch";
import { reservationJson } from "@opencok/mappings/provisioning";
import { signProvisioning, verifyProvisioning } from "@opencok/identity/provisioning";
import { provisionPath, type RealmProvisioner } from "@opencok/contracts/provisioning";
import {
  createCharacterSchema,
  reservationSchema,
  provisionReceiptSchema,
} from "@opencok/validations/provisioning";
import type {
  ProvisioningController,
  CharacterProvisioningController,
} from "@opencok/controllers/provisioning";
import { HttpError } from "@opencok/errors/http";

async function limitedBody(
  stream: ReadableStream<Uint8Array> | null,
  maximum: number,
): Promise<string> {
  if (!stream) throw new HttpError(400, "Missing body");

  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;

  try {
    for (;;) {
      const next = await reader.read();

      if (next.done) break;

      size += next.value.length;

      if (size > maximum) {
        await reader.cancel();

        throw new HttpError(413, "Oversized body");
      }

      chunks.push(next.value);
    }

    return Buffer.concat(chunks).toString("utf8");
  } finally {
    reader.releaseLock();
  }
}

function failure(error: unknown) {
  return Response.json(
    { state: "unavailable" },
    {
      status: error instanceof HttpError ? error.status : 503,
      headers: { "Cache-Control": "no-store" },
    },
  );
}

export function provisioningHandler(controller: Pick<ProvisioningController, "create">) {
  return async (request: Request): Promise<Response> => {
    if (request.method !== "POST") return new Response(null, { status: 405 });

    try {
      const auth = /^Bearer ([^\s]+)$/.exec(request.headers.get("Authorization") ?? "");

      if (!auth || auth[1]!.length > 16384)
        throw new HttpError(401, "Identity authentication required");

      let parsed: unknown;

      try {
        parsed = JSON.parse(await limitedBody(request.body, 4096));
      } catch (error) {
        if (error instanceof HttpError) throw error;

        throw new HttpError(400, "Invalid body");
      }

      const input = createCharacterSchema.safeParse(parsed);

      if (!input.success) throw new HttpError(400, "Invalid character input");

      const response = await controller.create(auth[1]!, input.data);

      return Response.json(response, {
        status: response.state === "ready" ? 200 : 202,
        headers: { "Cache-Control": "no-store" },
      });
    } catch (error) {
      return failure(error);
    }
  };
}

export function characterProvisioningHandler(
  controller: Pick<CharacterProvisioningController, "create">,
  secret: string,
  now = Date.now,
) {
  return async (request: Request): Promise<Response> => {
    if (request.method !== "POST" || new URL(request.url).pathname !== provisionPath)
      return new Response(null, { status: 404 });

    try {
      const body = await limitedBody(request.body, 8192);

      if (
        !verifyProvisioning(
          body,
          request.headers.get("X-Character-Time"),
          request.headers.get("X-Character-Signature"),
          secret,
          now(),
        )
      )
        throw new HttpError(401, "Invalid provisioning authorization");

      let parsed: unknown;

      try {
        parsed = JSON.parse(body);
      } catch {
        throw new HttpError(400, "Invalid body");
      }

      const input = reservationSchema.safeParse(parsed);

      if (!input.success) throw new HttpError(400, "Invalid reservation");

      const result = await controller.create(input.data);
      const output = JSON.stringify(provisionReceiptSchema.parse(result));
      const timestamp = String(now());

      return new Response(output, {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
          "X-Character-Time": timestamp,
          "X-Character-Signature": signProvisioning(output, timestamp, secret, true),
        },
      });
    } catch (error) {
      return failure(error);
    }
  };
}

export function realmProvisioner(
  url: string,
  secret: string,
  timeoutMs: number,
  send: (url: URL, init: RequestInit) => Promise<Response> = fetch,
  now = Date.now,
): RealmProvisioner {
  const target = new URL(url);

  if (
    !["http:", "https:"].includes(target.protocol) ||
    target.pathname !== provisionPath ||
    target.username ||
    target.password ||
    target.search ||
    target.hash ||
    !secret
  )
    throw new Error("Invalid provisioning endpoint");

  return {
    async create(reservation) {
      const body = reservationJson(reservation),
        timestamp = String(now());
      const response = await observedFetch(
        "realm.provision",
        target,
        {
          method: "POST",
          redirect: "error",
          signal: AbortSignal.timeout(timeoutMs),
          headers: {
            "Content-Type": "application/json",
            "X-Character-Time": timestamp,
            "X-Character-Signature": signProvisioning(body, timestamp, secret),
          },
          body,
        },
        send,
      );

      if (!response.ok) {
        await response.body?.cancel();

        throw new HttpError(503, "Realm provisioning unavailable");
      }

      const output = await limitedBody(response.body, 8192);

      if (
        !verifyProvisioning(
          output,
          response.headers.get("X-Character-Time"),
          response.headers.get("X-Character-Signature"),
          secret,
          now(),
          true,
        )
      )
        throw new HttpError(503, "Invalid realm receipt");

      return provisionReceiptSchema.parse(JSON.parse(output));
    },
  };
}
