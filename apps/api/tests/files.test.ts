import { expect, test } from "bun:test";
import { createHash, createHmac, randomBytes } from "node:crypto";
import sharp from "sharp";
import { Effect, Layer } from "effect";
import { ApiDependencies, createApp, serveApi } from "../src/app";
import { ApiConfigLive } from "../src/config";
import { EnvironmentSource } from "@opencok/env/effect";
import { createHandler as createApiHandler } from "@opencok/api/handler";
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
function grant(expiry = Math.floor(Date.now() / 1000) + 60, sequence = 1) {
  const base = `v1.${owner}.${sequence}.${expiry}.${"a".repeat(32)}`;
  return `${base}.${createHmac("sha256", key).update(base).digest("hex")}`;
}
async function upload(
  token = grant(),
  type = "image/png",
  player = owner,
  bytes?: Uint8Array,
  sequence = 1,
) {
  const body = new FormData();
  body.set(
    "data",
    JSON.stringify({
      data: [
        { commandName: "user/UploadPhoto", params: [{ gameuid: player, photo_seq: sequence }] },
      ],
    }),
  );
  const image =
    bytes ??
    (await sharp({ create: { width: 4, height: 4, channels: 3, background: "red" } })
      .png()
      .toBuffer());
  body.set("file", new File([new Uint8Array(image)], "avatar.png", { type }));
  return new Request(`http://localhost${UPLOAD_PATH}?grant=${encodeURIComponent(token)}`, {
    method: "POST",
    headers: {},
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
    async removePrevious(uid, sequence) {
      if (Number(sequence) <= 1) return;
      const name = createHash("md5")
        .update(`${uid}_${Number(sequence) - 1}`)
        .digest("hex");
      objects.delete(`${uid.slice(-6)}/${name}.jpg`);
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
        new Request(`http://localhost${UPLOAD_PATH}?grant=${grant()}`, {
          method: "POST",
          headers: { "X-Upload-Grant": grant(), "content-length": String(BODY_LIMIT + 1) },
          body: "x",
        }),
      )
    ).status,
  ).toBe(413);
});

test("upload, signed JPEG delivery, immutable content and private confirmation preserve the contract", async () => {
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
  expect((await handler(await upload())).status).toBe(200);
  const different = await sharp({
    create: { width: 4, height: 4, channels: 3, background: "blue" },
  })
    .png()
    .toBuffer();
  expect((await handler(await upload(grant(), "image/png", owner, different))).status).toBe(409);
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

test("API routes media and discovery on one listener while preserving independent body limits", async () => {
  const store = storage();
  const files = createHandler(store, key);
  const dependencies = Layer.succeed(ApiDependencies, {
    accounts: { getAll: async () => [], health: async () => {} },
    directory: { read: async () => new Map() },
    redis: { health: async () => {} },
    files,
  });
  const environment = Layer.succeed(EnvironmentSource, {
    DATABASE_URL: "postgresql://synthetic:secret@localhost/synthetic",
    API_FILES_ENABLED: "true",
    API_PORT: "0",
  });
  const layers = Layer.merge(dependencies, ApiConfigLive).pipe(Layer.provide(environment));
  await Effect.runPromise(
    Effect.scoped(
      Effect.gen(function* () {
        const app = yield* createApp;
        const server = yield* serveApi;
        const origin = `http://127.0.0.1:${server.port}`;
        const bytes = yield* Effect.promise(() =>
          sharp(randomBytes(256 * 256 * 3), { raw: { width: 256, height: 256, channels: 3 } })
            .png()
            .toBuffer(),
        );
        const image = yield* Effect.promise(() => upload(grant(), "image/png", owner, bytes));
        const headers = new Headers(image.headers);
        const body = new Uint8Array(yield* Effect.promise(() => image.arrayBuffer()));
        expect(body.byteLength).toBeGreaterThan(65536);
        const uploaded = yield* Effect.promise(() =>
          fetch(origin + new URL(image.url).pathname + new URL(image.url).search, {
            method: "POST",
            headers,
            body,
          }),
        );
        expect(uploaded.status).toBe(200);
        expect(uploaded.headers.get("X-Request-ID")).toBeTruthy();
        const payload = (yield* Effect.promise(() => uploaded.json())) as {
          response: { data: { path: string } }[];
        };
        const path = payload.response[0]!.data.path;
        const head = yield* Effect.promise(() => fetch(origin + path, { method: "HEAD" }));
        expect(head.status).toBe(200);
        expect(yield* Effect.promise(() => head.text())).toBe("");
        const confirmation = yield* Effect.promise(() =>
          fetch(`${origin}/_internal/avatars/${owner}/1`),
        );
        expect(confirmation.status).toBe(401);
        for (const headers of [new Headers(), new Headers({ "Content-Length": "65537" })]) {
          const oversized = yield* Effect.promise(() =>
            app.fetch(
              new Request(origin + "/gameservice/getline.php", {
                method: "POST",
                headers,
                body: new Uint8Array(65537),
              }),
            ),
          );
          expect(oversized.status).toBe(413);
        }
        store.get = async () => {
          throw new Error("synthetic-provider-detail");
        };
        const unavailable = yield* Effect.promise(() => fetch(origin + path));
        expect(unavailable.status).toBe(503);
        expect(yield* Effect.promise(() => unavailable.text())).not.toContain(
          "synthetic-provider-detail",
        );
        const discovery = yield* Effect.promise(() =>
          fetch(origin + "/gameservice/getline.php?loginFlag=1"),
        );
        expect(discovery.status).toBe(200);
        expect(yield* Effect.promise(() => discovery.json())).toEqual({
          serverList: [],
          country: 1,
        });
      }),
    ).pipe(Effect.provide(layers)),
  );
});

test("API media stays unavailable when its dependency is disabled", async () => {
  const app = createApiHandler(
    { getAll: async () => [], health: async () => {} },
    { read: async () => new Map() },
    { health: async () => {} },
  );
  for (const path of [
    UPLOAD_PATH,
    `/_internal/avatars/${owner}/1`,
    `/cok/img/234567/${"a".repeat(32)}.jpg`,
  ])
    expect((await app.fetch(new Request(`http://localhost${path}`))).status).toBe(404);
});

test("gateway routes exact public avatar paths to API and keeps confirmation private", async () => {
  const gateway = Bun.YAML.parse(
    await Bun.file(new URL("../../../infra/gateway/dynamic.yml", import.meta.url)).text(),
  ) as {
    http: {
      routers: Record<string, { rule: string; service: string; middlewares?: string[] }>;
      middlewares: Record<string, { buffering?: { maxRequestBodyBytes: number } }>;
    };
  };
  const { routers, middlewares } = gateway.http;
  expect(routers["avatar-upload"]!.service).toBe("api");
  expect(routers["avatar-upload"]!.rule).toBe(`Path(\`${UPLOAD_PATH}\`) && Method(\`POST\`)`);
  expect(routers["avatar-upload"]!.middlewares).toEqual(["upload-body"]);
  expect(middlewares["upload-body"]!.buffering!.maxRequestBodyBytes).toBe(BODY_LIMIT);
  expect(middlewares["discovery-body"]!.buffering!.maxRequestBodyBytes).toBe(65536);
  const images = routers["avatar-images"]!;
  expect(images.service).toBe("api");
  const pattern = new RegExp(/PathRegexp\(`([^`]+)`\)/.exec(images.rule)![1]!);
  expect(pattern.test(`/cok/img/234567/${"a".repeat(32)}.jpg`)).toBe(true);
  for (const path of [
    "/cok/img/1/file.php",
    "/cok/img/1/file.jpg",
    `/_internal/avatars/${owner}/1`,
  ])
    expect(pattern.test(path)).toBe(false);
  for (const route of Object.values(routers)) expect(route.rule).not.toContain("/_internal");
});

test("image URLs reject unsigned, expired, altered and extra-query requests before storage", async () => {
  let time = Date.now();
  const store = storage();
  const handler = createHandler(store, key, () => time);
  const response = await handler(await upload());
  const data = ((await response.json()) as { response: { data: { path: string } }[] }).response[0]!
    .data;
  const url = new URL(data.path, "http://localhost");
  expect((await handler(new Request(url.toString()))).status).toBe(200);
  expect((await handler(new Request(url.toString()))).headers.get("cache-control")).toBe(
    "private, no-store",
  );
  store.get = async () => {
    throw new Error("Unauthorized storage access");
  };
  for (const path of [
    url.pathname,
    data.path.replace("234567", "234568"),
    data.path + "&extra=1",
    data.path.replace("signature=", "signature=f"),
  ])
    expect((await handler(new Request(new URL(path, url).toString()))).status).toBe(401);
  time = Number(url.searchParams.get("expires")) * 1000;
  for (const method of ["GET", "HEAD"])
    expect((await handler(new Request(url.toString(), { method }))).status).toBe(401);
});

test("uploads require a signed URL and reject extra query parameters", async () => {
  const handler = createHandler(storage(), key);
  const request = await upload();
  const body = await request.arrayBuffer();
  for (const url of ["http://localhost" + UPLOAD_PATH, request.url + "&extra=1"])
    expect(
      (
        await handler(
          new Request(url, {
            method: "POST",
            headers: { ...Object.fromEntries(request.headers), "X-Upload-Grant": grant() },
            body,
          }),
        )
      ).status,
    ).toBe(401);
});

test("replacement deletes previous bytes, preserves receipts and retries failed cleanup", async () => {
  const store = storage();
  const remove = store.removePrevious.bind(store);
  const put = store.put.bind(store);
  const handler = createHandler(store, key);
  const first = (
    (await (await handler(await upload())).json()) as { response: { data: { path: string } }[] }
  ).response[0]!.data;
  store.put = async () => {
    throw new Error("write failed");
  };
  expect(
    (await handler(await upload(grant(undefined, 2), "image/png", owner, undefined, 2))).status,
  ).toBe(503);
  expect(
    (await handler(new Request(new URL(first.path, "http://localhost").toString()))).status,
  ).toBe(200);
  store.put = put;
  store.removePrevious = async () => {
    throw new Error("delete failed");
  };
  const send = () => upload(grant(undefined, 2), "image/png", owner, undefined, 2);
  expect((await handler(await send())).status).toBe(503);
  store.removePrevious = remove;
  expect((await handler(await send())).status).toBe(200);
  expect(
    (await handler(new Request(new URL(first.path, "http://localhost").toString()))).status,
  ).toBe(404);
});
