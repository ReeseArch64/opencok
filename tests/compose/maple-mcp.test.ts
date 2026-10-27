import { expect, mock, test } from "bun:test";
import { Readable, Writable } from "node:stream";
import { MapleCli } from "../../infra/observability/maple/mcp-cli";
import { MapleTool, mcpLimits } from "../../infra/observability/maple/mcp-contracts";
import { MapleMcpProtocol } from "../../infra/observability/maple/mcp-protocol";
import { BoundedCommandRunner } from "../../infra/observability/maple/mcp-runner";
import { MapleMcpStdio } from "../../infra/observability/maple/mcp-stdio";

const request = (method: string, params?: unknown, id: string | number = 1) =>
  JSON.stringify({ jsonrpc: "2.0", id, method, params });

const initialize = (version = "2025-11-25") =>
  request("initialize", {
    protocolVersion: version,
    capabilities: {},
    clientInfo: { name: "test", version: "1" },
  });

const fixture = async (run = mock(async (_command: string[]) => '{"count":2}')) => {
  const protocol = new MapleMcpProtocol(new MapleCli({ run }));

  await protocol.handle(initialize());

  return { protocol, run };
};

test.each(["2025-11-25", "2025-06-18", "2025-03-26", "2024-11-05"])(
  "initialize negotiates supported protocol %s without spawning",
  async (version) => {
    const run = mock(async (_command: string[]) => "{}");
    const protocol = new MapleMcpProtocol(new MapleCli({ run }));

    expect(await protocol.handle(initialize(version))).toMatchObject({
      jsonrpc: "2.0",
      id: 1,
      result: {
        protocolVersion: version,
        capabilities: { tools: {} },
        serverInfo: { name: "opencok-maple-local" },
      },
    });
    expect(run).not.toHaveBeenCalled();
  },
);

test("initialize offers latest supported version for an unknown version", async () => {
  const { protocol } = await fixture();

  expect(await protocol.handle(initialize("unknown"))).toMatchObject({
    result: { protocolVersion: "2025-11-25" },
  });
});

test("tools list exposes exactly three read-only strict schemas", async () => {
  const { protocol, run } = await fixture();
  const response = await protocol.handle(request("tools/list"));
  const result = response?.result as { tools: { name: string; inputSchema: unknown }[] };

  expect(result.tools.map((tool) => tool.name)).toEqual([
    "list_services",
    "search_logs",
    "search_traces",
  ]);
  expect(result.tools).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        inputSchema: expect.objectContaining({ additionalProperties: false }),
        annotations: expect.objectContaining({ readOnlyHint: true, destructiveHint: false }),
      }),
    ]),
  );
  expect(run).not.toHaveBeenCalled();
});

test.each([
  [MapleTool.ListServices, "services"],
  [MapleTool.SearchLogs, "logs"],
  [MapleTool.SearchTraces, "traces"],
])("%s calls only the corresponding local CLI command", async (name, command) => {
  const { protocol, run } = await fixture();

  expect(await protocol.handle(request("tools/call", { name }))).toEqual({
    jsonrpc: "2.0",
    id: 1,
    result: { content: [{ type: "text", text: '{"count":2}' }] },
  });
  expect(run).toHaveBeenCalledWith([
    "docker",
    "exec",
    "opencok-maple-1",
    "maple",
    command,
    "--local",
    "--format=json",
    "--limit=20",
  ]);
});

test("log filters remain individual option values with no shell", async () => {
  const { protocol, run } = await fixture();

  await protocol.handle(
    request("tools/call", {
      name: "search_logs",
      arguments: {
        since: "15m",
        service: "api worker",
        env: "development",
        limit: 100,
        severity: "error",
        search: "operation failed",
      },
    }),
  );

  expect(run).toHaveBeenCalledWith([
    "docker",
    "exec",
    "opencok-maple-1",
    "maple",
    "logs",
    "--local",
    "--format=json",
    "--limit=100",
    "--since=15m",
    "--service=api worker",
    "--env=development",
    "--severity=error",
    "--search=operation failed",
  ]);
});

test("trace filters map span_name and presence-only errors", async () => {
  const { protocol, run } = await fixture();

  await protocol.handle(
    request("tools/call", {
      name: "search_traces",
      arguments: { errors: true, span_name: "request" },
    }),
  );

  expect(run.mock.calls[0]?.[0]).toEqual([
    "docker",
    "exec",
    "opencok-maple-1",
    "maple",
    "traces",
    "--local",
    "--format=json",
    "--limit=20",
    "--errors",
    "--span-name=request",
  ]);
});

test("standard request metadata is ignored without loosening tool argument validation", async () => {
  const { protocol, run } = await fixture();

  expect(await protocol.handle(request("tools/list", { _meta: {} }))).toHaveProperty("result");
  expect(
    await protocol.handle(
      request("tools/call", { name: "list_services", _meta: { progressToken: "test" } }),
    ),
  ).toHaveProperty("result");
  expect(
    await protocol.handle(request("tools/call", { name: "list_services", _meta: "invalid" })),
  ).toMatchObject({ error: { code: -32602 } });
  expect(run).toHaveBeenCalledTimes(1);
});

test("false errors omits the CLI flag", async () => {
  const { protocol, run } = await fixture();

  await protocol.handle(
    request("tools/call", { name: "search_traces", arguments: { errors: false } }),
  );

  expect(run.mock.calls[0]?.[0]).not.toContain("--errors");
  expect(run.mock.calls[0]?.[0]).not.toContain("--errors=false");
});

test.each(
  [
    { remote: true },
    { sql: "SELECT 1" },
    { limit: 0 },
    { limit: 101 },
    { limit: 1.5 },
    { limit: "20" },
    { limit: null },
    { service: "--remote" },
    { service: "x;echo secret" },
    { service: "$(echo secret)" },
    { service: "x\n--remote" },
    { service: "a|b" },
    { service: "a`b" },
    { service: "" },
    { service: "a".repeat(257) },
    { service: " x" },
    { service: 1 },
    { service: [] },
    { since: "0h" },
    { since: "yesterday" },
    { severity: "ERROR" },
    { errors: true },
    { span_name: "unexpected" },
    [],
    null,
    "--remote",
  ].map((args) => [args]),
)("invalid log arguments %j never spawn", async (args) => {
  const { protocol, run } = await fixture();

  expect(
    await protocol.handle(request("tools/call", { name: "search_logs", arguments: args })),
  ).toMatchObject({
    error: { code: -32602, message: "Invalid tool arguments" },
  });
  expect(run).not.toHaveBeenCalled();
});

test.each([
  { errors: "true" },
  { errors: null },
  { search: "unsupported" },
  { span_name: "--remote" },
])("invalid trace arguments %j never spawn", async (args) => {
  const { protocol, run } = await fixture();

  expect(
    await protocol.handle(request("tools/call", { name: "search_traces", arguments: args })),
  ).toMatchObject({ error: { code: -32602 } });
  expect(run).not.toHaveBeenCalled();
});

test.each([1, 100])("limit %d and maximum text length are accepted", async (limit) => {
  const { protocol, run } = await fixture();

  expect(
    await protocol.handle(
      request("tools/call", {
        name: "list_services",
        arguments: { limit, service: "a".repeat(256) },
      }),
    ),
  ).not.toHaveProperty("error");
  expect(run).toHaveBeenCalledTimes(1);
});

test.each([
  { name: "execute_sql" },
  { name: "search_logs", extra: true },
  { name: "search_logs", arguments: { __proto__: null, constructor: "injected" } },
])("unknown tool or call properties %j never spawn", async (params) => {
  const { protocol, run } = await fixture();

  expect(await protocol.handle(request("tools/call", params))).toMatchObject({
    error: { code: -32602 },
  });
  expect(run).not.toHaveBeenCalled();
});

test.each(["", "--remote", "name;echo", "name/other", "a b", "a\n", "a".repeat(129)])(
  "invalid container %j fails before spawning",
  (container) => {
    const run = mock(async (_command: string[]) => "{}");

    expect(() => new MapleCli({ run }, container)).toThrow("Invalid container name");
    expect(run).not.toHaveBeenCalled();
  },
);

test("valid alternate container is selected without environment or token arguments", async () => {
  const run = mock(async (_command: string[]) => "{}");
  const cli = new MapleCli({ run }, "project_maple-2");

  await cli.query({ name: MapleTool.ListServices, arguments: {} });

  expect(run.mock.calls[0]?.[0]).toEqual([
    "docker",
    "exec",
    "project_maple-2",
    "maple",
    "services",
    "--local",
    "--format=json",
    "--limit=20",
  ]);
});

test("query failures are tool errors without exception details", async () => {
  const { protocol } = await fixture(
    mock(async (_command: string[]) => {
      throw new Error("sensitive stderr token");
    }),
  );

  expect(await protocol.handle(request("tools/call", { name: "list_services" }))).toEqual({
    jsonrpc: "2.0",
    id: 1,
    result: { content: [{ type: "text", text: "Local Maple query failed." }], isError: true },
  });
});

test("malformed CLI output is not returned as telemetry", async () => {
  const { protocol } = await fixture(mock(async (_command: string[]) => "sensitive invalid JSON"));
  const response = await protocol.handle(request("tools/call", { name: "list_services" }));

  expect(response?.result).toMatchObject({ isError: true });
  expect(JSON.stringify(response)).not.toContain("sensitive");
});

test("protocol rejects malformed requests and ignores notifications", async () => {
  const { protocol, run } = await fixture();

  expect(await protocol.handle("{")).toMatchObject({ id: null, error: { code: -32700 } });
  expect(await protocol.handle("[]")).toMatchObject({ error: { code: -32600 } });
  expect(await protocol.handle('{"jsonrpc":"2.0","method":"ping","id":{}}')).toMatchObject({
    error: { code: -32600 },
  });
  expect(await protocol.handle(request("initialize", {}))).toMatchObject({
    error: { code: -32602 },
  });
  expect(await protocol.handle(request("tools/list", { cursor: "unsupported" }))).toMatchObject({
    error: { code: -32602 },
  });
  expect(await protocol.handle(request("unknown"))).toMatchObject({ error: { code: -32601 } });
  expect(await protocol.handle(request("ping", undefined, "ping-id"))).toEqual({
    jsonrpc: "2.0",
    id: "ping-id",
    result: {},
  });
  expect(
    await protocol.handle('{"jsonrpc":"2.0","method":"notifications/initialized"}'),
  ).toBeUndefined();
  expect(
    await protocol.handle(
      '{"jsonrpc":"2.0","method":"tools/call","params":{"name":"list_services"}}',
    ),
  ).toBeUndefined();
  expect(run).not.toHaveBeenCalled();
});

test("tool requests require initialization", async () => {
  const protocol = new MapleMcpProtocol(new MapleCli({ run: async () => "{}" }));

  expect(await protocol.handle(request("tools/list"))).toMatchObject({ error: { code: -32002 } });
});

test("bounded runner captures stdout and never returns stderr", async () => {
  const runner = new BoundedCommandRunner();
  const output = await runner.run([
    process.execPath,
    "--no-env-file",
    "-e",
    'process.stderr.write("private");process.stdout.write("{}")',
  ]);

  expect(output).toBe("{}");
});

test("bounded runner rejects nonzero exit without stderr details", async () => {
  const runner = new BoundedCommandRunner();

  await expect(
    runner.run([
      process.execPath,
      "--no-env-file",
      "-e",
      'process.stderr.write("private");process.exit(2)',
    ]),
  ).rejects.toThrow("Command failed");
});

test("bounded runner kills a process after its deadline", async () => {
  const runner = new BoundedCommandRunner(100);

  await expect(
    runner.run([process.execPath, "--no-env-file", "-e", "setInterval(() => {}, 1000)"]),
  ).rejects.toThrow("Command timed out");
});

test.each(["stdout", "stderr"])("bounded runner caps streamed %s", async (stream) => {
  const runner = new BoundedCommandRunner(2_000, 100);

  await expect(
    runner.run([
      process.execPath,
      "--no-env-file",
      "-e",
      `setInterval(() => process.${stream}.write("x".repeat(60)), 5)`,
    ]),
  ).rejects.toThrow("Command output limit exceeded");
});

test("stdio handles split and coalesced frames and recovers after oversized input", async () => {
  const { protocol, run } = await fixture();
  const chunks: Buffer[] = [];
  const output = new Writable({
    write(chunk, _encoding, callback) {
      chunks.push(Buffer.from(chunk));
      callback();
    },
  });
  const server = new MapleMcpStdio(protocol);

  await server.run(
    Readable.from([
      Buffer.from(
        '{"jsonrpc":"2.0","method":"notifications/initialized"}\n' +
          "x".repeat(mcpLimits.inputBytes),
      ),
      Buffer.from('x\n{"jsonrpc":"2.0","id":1,"method":"pi'),
      Buffer.from('ng"}\n' + request("ping", undefined, 2) + "\n"),
    ]),
    output,
  );

  expect(
    Buffer.concat(chunks)
      .toString()
      .trim()
      .split("\n")
      .map((line) => JSON.parse(line)),
  ).toEqual([
    { jsonrpc: "2.0", id: null, error: { code: -32600, message: "Request too large" } },
    { jsonrpc: "2.0", id: 1, result: {} },
    { jsonrpc: "2.0", id: 2, result: {} },
  ]);
  expect(run).not.toHaveBeenCalled();
});

test("real entrypoint produces only MCP responses without Docker", async () => {
  const child = Bun.spawn(
    [
      process.execPath,
      "--no-env-file",
      new URL("../../infra/observability/maple/mcp.ts", import.meta.url).pathname,
    ],
    {
      stdin: "pipe",
      stdout: "pipe",
      stderr: "pipe",
      env: { ...process.env, MAPLE_CONTAINER: "opencok-maple-1" },
    },
  );

  child.stdin.write(`${initialize()}\n${request("tools/list")}\n`);
  child.stdin.end();

  const output = await new Response(child.stdout).text();
  const error = await new Response(child.stderr).text();

  expect(await child.exited).toBe(0);
  expect(error).toBe("");
  expect(
    output
      .trim()
      .split("\n")
      .map((line) => JSON.parse(line).id),
  ).toEqual([1, 1]);
});

test("MCP files are excluded from the Maple build context and runtime copies", async () => {
  const ignore = await Bun.file(
    new URL("../../infra/observability/maple/.dockerignore", import.meta.url),
  ).text();
  const dockerfile = await Bun.file(
    new URL("../../infra/observability/maple/Dockerfile", import.meta.url),
  ).text();

  expect(ignore.trim().split("\n")).toEqual(["*", "!Dockerfile", "!patch-csp.ts"]);
  expect(dockerfile.match(/^COPY (?!.*--from=).*$/gm)).toEqual([
    "COPY patch-csp.ts /tmp/patch-csp.ts",
  ]);
});
