import { expect, test } from "bun:test";
import { Effect } from "effect";
import { serveHttp } from "../src/http";

test("Effect HTTP listener preserves fetch bodies and closes its port with the scope", async () => {
  let port = 0;
  await Effect.runPromise(
    Effect.scoped(
      Effect.gen(function* () {
        const server = yield* serveHttp(
          { host: "127.0.0.1", port: 0 },
          async (request) =>
            new Response(await request.text(), { status: 201, headers: { "X-Test": "preserved" } }),
        );
        port = server.port;
        const response = yield* Effect.promise(() =>
          fetch(`http://127.0.0.1:${port}/`, {
            method: "POST",
            body: "payload",
            headers: { Connection: "close" },
          }),
        );
        expect(response.status).toBe(201);
        expect(response.headers.get("X-Test")).toBe("preserved");
        expect(yield* Effect.promise(() => response.text())).toBe("payload");
      }),
    ),
  );
  await expect(fetch(`http://127.0.0.1:${port}/`)).rejects.toThrow();
});
