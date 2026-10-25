import { expect, test } from "bun:test";
import { createHandler } from "@opencok/api/handler";
import { DependencyError } from "@opencok/errors/dependency";

const accounts = { getAll: async () => [], health: async () => {} };
const directory = { read: async () => new Map() };
const redis = { health: async () => {} };

test("injected HTTP handler preserves aliases, HEAD and route restrictions", async () => {
  const app = createHandler(accounts, directory, redis);
  for (const alias of ["getserverlist", "getline", "getserverlist_memoryold"]) {
    const response = await app.fetch(
      new Request(`http://localhost/gameservice/${alias}.php?loginFlag=1`),
    );
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ serverList: [], country: 1 });
    expect(response.headers.get("X-Request-ID")).toBeTruthy();
  }
  const response = await app.fetch(new Request("http://localhost/healthz", { method: "HEAD" }));
  expect(response.status).toBe(200);
  expect(await response.text()).toBe("");
  expect((await app.fetch(new Request("http://localhost/readyz"))).status).toBe(200);
  expect(
    (await app.fetch(new Request("http://localhost/gameservice/getline.php", { method: "DELETE" })))
      .status,
  ).toBe(404);
});

test("dependency failures retain 503 responses without exposing underlying details", async () => {
  const app = createHandler(accounts, directory, {
    health: async () => {
      throw new DependencyError("redis");
    },
  });
  const response = await app.fetch(new Request("http://localhost/readyz"));
  expect(response.status).toBe(503);
  expect(await response.text()).toBe("");
});

test("character provisioning routes only the exact path and is unavailable when disabled", async () => {
  const disabled = createHandler(accounts, directory, redis);
  const response = await disabled.fetch(
    new Request("http://api/api/v1/characters", { method: "POST" }),
  );
  expect(response.status).toBe(503);
  expect(response.headers.get("Cache-Control")).toBe("no-store");
  let calls = 0;
  const enabled = createHandler(accounts, directory, redis, undefined, undefined, async () => {
    calls++;
    return Response.json({ state: "ready" });
  });
  expect(
    (await enabled.fetch(new Request("http://api/api/v1/characters", { method: "POST" }))).status,
  ).toBe(200);
  expect(
    (await enabled.fetch(new Request("http://api/api//v1/characters", { method: "POST" }))).status,
  ).toBe(404);
  expect(calls).toBe(1);
});
