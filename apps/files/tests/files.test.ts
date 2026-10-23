import { expect, test } from "bun:test";
import { createHmac } from "node:crypto";
import sharp from "sharp";
import { Effect } from "effect";
import { createHandler } from "@opencok/api/files";
import {
  BODY_LIMIT,
  UPLOAD_PATH,
  type ImageStore,
  type UploadReceipt,
} from "@opencok/contracts/files";
import { HttpError } from "@opencok/errors/http";
import { serveHttp } from "@opencok/core/http";
import { parseFilesEnvironment } from "@opencok/env/files";

const key = Buffer.alloc(32, 9);
const owner = "1234567";
function grant(expiry = Math.floor(Date.now() / 1000) + 60) {
  const base = `v1.${owner}.1.${expiry}.${"a".repeat(32)}`;
  return `${base}.${createHmac("sha256", key).update(base).digest("hex")}`;
}
async function upload(token = grant(), type = "image/png", player = owner, bytes?: Uint8Array) {
  const body = new FormData();
  body.set(
    "data",
    JSON.stringify({
      data: [{ commandName: "user/UploadPhoto", params: [{ gameuid: player, photo_seq: 1 }] }],
    }),
  );
  const image =
    bytes ??
    (await sharp({ create: { width: 4, height: 4, channels: 3, background: "red" } })
      .png()
      .toBuffer());
  body.set("file", new File([new Uint8Array(image)], "avatar.png", { type }));
  return new Request(`http://localhost${UPLOAD_PATH}`, {
    method: "POST",
    headers: { "X-Upload-Grant": token },
    body,
  });
}
function storage() {
  const objects = new Map<string, Uint8Array>();
  const receipts = new Map<string, UploadReceipt>();
  const store: ImageStore = {
    async put(path, bytes, uid, sequence, hash) {
      if (objects.has(path)) throw new HttpError(409, "Image sequence already exists");
      objects.set(path, bytes);
      receipts.set(`${uid}:${sequence}`, { owner: uid, sequence, hash });
    },
    async get(path) {
      return objects.get(path) ?? null;
    },
    async find(uid, sequence) {
      return receipts.get(`${uid}:${sequence}`) ?? null;
    },
  };
  return store;
}

test("uploads enforce signature, expiry, ownership, actual MIME, file bytes and body limits", async () => {
  const handler = createHandler(storage(), key);
  expect((await handler(await upload("invalid"))).status).toBe(401);
  expect((await handler(await upload(grant(Math.floor(Date.now() / 1000) - 1)))).status).toBe(401);
  expect((await handler(await upload(grant(), "image/png", "999"))).status).toBe(403);
  expect((await handler(await upload(grant(), "image/jpeg"))).status).toBe(415);
  expect(
    (await handler(await upload(grant(), "image/png", owner, new Uint8Array([1, 2, 3])))).status,
  ).toBe(415);
  expect(
    (
      await handler(
        new Request(`http://localhost${UPLOAD_PATH}`, {
          method: "POST",
          headers: { "X-Upload-Grant": grant(), "content-length": String(BODY_LIMIT + 1) },
          body: "x",
        }),
      )
    ).status,
  ).toBe(413);
});

test("upload, public JPEG delivery, immutable sequence and private confirmation preserve the contract", async () => {
  const handler = createHandler(storage(), key);
  const response = await handler(await upload());
  expect(response.status).toBe(200);
  const json = (await response.json()) as {
    response: { data: { path: string; image_hash: string } }[];
  };
  const data = json.response[0]!.data;
  const image = await handler(new Request(`http://localhost${data.path}`));
  expect(image.headers.get("Content-Type")).toBe("image/jpeg");
  const metadata = await sharp(Buffer.from(await image.arrayBuffer())).metadata();
  expect(metadata.format).toBe("jpeg");
  expect(metadata.exif).toBeUndefined();
  const head = await handler(new Request(`http://localhost${data.path}`, { method: "HEAD" }));
  expect(await head.text()).toBe("");
  expect(Number(head.headers.get("content-length"))).toBeGreaterThan(0);
  expect((await handler(await upload())).status).toBe(409);
  const confirmationUrl = `http://localhost/_internal/avatars/${owner}/1`;
  expect((await handler(new Request(confirmationUrl))).status).toBe(401);
  expect(
    (await handler(new Request(confirmationUrl, { headers: { "x-avatar-confirmation": grant() } })))
      .status,
  ).toBe(401);
  const expiry = Math.floor(Date.now() / 1000) + 20;
  const signature = createHmac("sha256", key)
    .update(`confirm\n${owner}\n1\n${expiry}`)
    .digest("hex");
  const confirmation = await handler(
    new Request(confirmationUrl, {
      headers: { "x-avatar-confirmation": `v1.${expiry}.${signature}` },
    }),
  );
  expect(await confirmation.text()).toBe(`v1\n${owner}\n1\n${data.image_hash}\n`);
});

test("storage failure returns unavailable without exposing backend details", async () => {
  const store = storage();
  store.put = async () => {
    throw new Error("synthetic-private-provider-detail");
  };
  const response = await createHandler(store, key)(await upload());
  expect(response.status).toBe(503);
  expect(await response.text()).not.toContain("synthetic-private-provider-detail");
  expect(() =>
    parseFilesEnvironment({ S3_BUCKET: "images", S3_FORCE_PATH_STYLE: "yes" }),
  ).toThrow();
});

test("shared HTTP runtime accepts media bodies above the API default and enforces the configured cap", async () => {
  await Effect.runPromise(
    Effect.scoped(
      Effect.gen(function* () {
        const server = yield* serveHttp(
          { host: "127.0.0.1", port: 0, maxRequestBodySize: BODY_LIMIT },
          async (request) => new Response(String((await request.arrayBuffer()).byteLength)),
        );
        const response = yield* Effect.promise(() =>
          fetch(`http://127.0.0.1:${server.port}`, { method: "POST", body: new Uint8Array(70000) }),
        );
        expect(response.status).toBe(200);
        expect(yield* Effect.promise(() => response.text())).toBe("70000");
        const large = yield* Effect.promise(() =>
          fetch(`http://127.0.0.1:${server.port}`, {
            method: "POST",
            body: new Uint8Array(BODY_LIMIT + 1),
          }),
        );
        expect(large.status).toBe(413);
      }),
    ),
  );
});
