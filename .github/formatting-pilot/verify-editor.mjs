import { spawn, spawnSync } from "node:child_process";
import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";
const root = process.cwd();
const child = spawn(root + "/node_modules/.bin/dprint", ["lsp"], { cwd: root });
let buffer = Buffer.alloc(0);
const pending = new Map();
child.stdout.on("data", (chunk) => {
    buffer = Buffer.concat([buffer, chunk]);
    while (true)
    {
        const end = buffer.indexOf("\r\n\r\n");
        if (end < 0)
        {
            return;
        }
        const length = Number(/Content-Length: (\d+)/i.exec(buffer.subarray(0, end).toString())[1]);
        if (buffer.length < end + 4 + length)
        {
            return;
        }
        const message = JSON.parse(buffer.subarray(end + 4, end + 4 + length));
        buffer = buffer.subarray(end + 4 + length);
        if (pending.has(message.id))
        {
            pending.get(message.id)(message);
            pending.delete(message.id);
        }
    }
});
function send(message)
{
    const body = JSON.stringify({ jsonrpc: "2.0", ...message });
    child.stdin.write("Content-Length: " + Buffer.byteLength(body) + "\r\n\r\n" + body);
}
function request(id, method, params)
{
    return new Promise((resolve) => {
        pending.set(id, resolve);
        send({ id, method, params });
    });
}
const timeout = setTimeout(() => {
    child.kill();
    process.exit(1);
}, 20000);
try
{
    const uri = pathToFileURL(root + "/.github/formatting-pilot/editor-fixture.ts").href;
    const source =
        "export function value(flag:boolean){if(flag)return {answer:42};return {answer:0};}\n";
    const initialized = await request(1, "initialize", {
        processId: process.pid,
        rootUri: pathToFileURL(root).href,
        capabilities: {},
    });
    assert.ok(!initialized.error, JSON.stringify(initialized));
    send({ method: "initialized", params: {} });
    send({
        method: "textDocument/didOpen",
        params: { textDocument: { uri, languageId: "typescript", version: 1, text: source } },
    });
    const formatted = await request(2, "textDocument/formatting", {
        textDocument: { uri },
        options: { tabSize: 4, insertSpaces: true },
    });
    assert.ok(!formatted.error, JSON.stringify(formatted));
    assert.ok(formatted.result?.length, JSON.stringify(formatted));
    const lines = source.split("\n");
    const offset = (position) =>
        lines.slice(0, position.line).reduce((sum, line) => sum + line.length + 1, 0)
        + position.character;
    let result = source;
    for (
        const edit of formatted.result.toSorted((a, b) =>
            offset(b.range.start) - offset(a.range.start)
        )
    )
    {
        result = result.slice(0, offset(edit.range.start)) + edit.newText
            + result.slice(offset(edit.range.end));
    }
    const cli = spawnSync(root + "/node_modules/.bin/dprint", [
        "fmt",
        "--config",
        root + "/dprint.json",
        "--stdin",
        "editor-fixture.ts",
    ], { input: source, encoding: "utf8" });
    assert.equal(cli.status, 0, cli.stderr);
    assert.equal(result, cli.stdout);
    console.log("PASS: dprint LSP editor formatting equals root CLI output");
}
finally
{
    clearTimeout(timeout);
    child.kill();
}
