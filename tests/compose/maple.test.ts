import { expect, test } from "bun:test";
import { patchMapleCsp } from "../../infra/observability/maple/patch-csp";

const original = `var UI_CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self' data:",
  "connect-src 'self' http://127.0.0.1:* http://localhost:*",
  "object-src 'none'",
  "base-uri 'none'",
  "form-action 'none'",
  "frame-ancestors 'none'"
].join("; ");`;

const directives = (source: string) =>
  [...source.matchAll(/"([^"]+)"/g)].map((match) => match[1]!).slice(0, -1);

test("Maple patch preserves binary offsets and only adds WebAssembly permission", () => {
  const prefix = Buffer.from([0, 1, 255]);
  const suffix = Buffer.from([254, 2, 0]);
  const input = Buffer.concat([prefix, Buffer.from(original), suffix]);
  const output = patchMapleCsp(input);
  const patched = output.subarray(prefix.length, -suffix.length).toString();

  expect(output.length).toBe(input.length);
  expect(output.subarray(0, prefix.length)).toEqual(prefix);
  expect(output.subarray(-suffix.length)).toEqual(suffix);
  expect(input).toEqual(Buffer.concat([prefix, Buffer.from(original), suffix]));
  expect(directives(patched)).toEqual(
    directives(original).map((directive) =>
      directive === "script-src 'self'" ? "script-src 'self' 'wasm-unsafe-eval'" : directive,
    ),
  );
  expect(patched).not.toContain("'unsafe-eval'");
  expect(patchMapleCsp(input)).toEqual(output);
});

test("Maple patch rejects absent, changed, duplicate and already patched policies", () => {
  for (const source of ["", original.replace("base-uri", "other-uri"), original + original]) {
    expect(() => patchMapleCsp(Buffer.from(source))).toThrow("exactly one");
  }

  expect(() => patchMapleCsp(patchMapleCsp(Buffer.from(original)))).toThrow("exactly one");
});

test("Maple build rejects unsupported architectures and unknown executable checksums", async () => {
  const script = new URL("../../infra/observability/maple/patch-csp.ts", import.meta.url).pathname;

  for (const architecture of ["arm64", "amd64"]) {
    const process = Bun.spawn(
      [Bun.which("bun")!, "--no-env-file", script, script, "/dev/null", architecture],
      { stdout: "pipe", stderr: "pipe" },
    );
    const error = await new Response(process.stderr).text();

    expect(await process.exited).not.toBe(0);
    expect(error).toContain(architecture === "amd64" ? "checksum" : "amd64 release only");
  }
});

test("Maple uses a versioned derived image with an isolated build context", async () => {
  const source = Bun.YAML.parse(
    await Bun.file(new URL("../../docker-compose.yml", import.meta.url)).text(),
  ) as { services: { maple: { image: string; build: { context: string } } } };
  const dockerfile = await Bun.file(
    new URL("../../infra/observability/maple/Dockerfile", import.meta.url),
  ).text();

  expect(source.services.maple.image).toBe("opencok-maple:v0.3.0-csp1");
  expect(source.services.maple.build.context).toBe("./infra/observability/maple");
  expect(dockerfile).toContain("FROM ghcr.io/mapletechlabs/maple:v0.3.0 AS upstream");
  expect(dockerfile).toContain("COPY --from=patch /tmp/maple /opt/maple/maple");
});
