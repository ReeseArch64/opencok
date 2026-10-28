import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import { resolve, join } from "node:path";
import { runInNewContext } from "node:vm";

const directory = resolve(process.argv[2] ?? "apps/web/dist");
const html = await readFile(join(directory, "index.html"), "utf8");
const script = html.match(/<script\b[^>]*src="([^"]+)"/)?.[1];
assert.ok(script, "Built HTML must reference an emitted script");
const elements = new Map<string, {
    dataset: Record<string, string>;
    style: Record<string, string>;
    value: number;
    max: number;
    src: string;
    disabled: boolean;
    textContent: string;
    addEventListener: () => void;
    decode: () => Promise<void>;
}>();
const server = Bun.serve({
    hostname: "127.0.0.1",
    port: 0,
    async fetch(request)
    {
        const path = new URL(request.url).pathname;

        if (path === "/api/ping")
        {
            return Response.json({
                online: true,
                latencyMs: 2,
                checkedAt: "2026-10-27T18:00:00.000Z",
                target: "http-gateway",
            });
        }

        const file = resolve(directory, path === "/" ? "index.html" : `.${path}`);
        assert.ok(file.startsWith(directory + "/"));

        return new Response(Bun.file(file));
    },
});

try
{
    assert.equal((await fetch(server.url)).status, 200);

    for (const reference of html.matchAll(/(?:src|href)="([^"]+\.(?:js|css))"/g))
    {
        assert.ok((await fetch(new URL(reference[1]!, server.url))).ok);
    }

    for (
        const id of [
            "status",
            "latency",
            "retry",
            "progress",
            "progress-fill",
            "background",
            "logo",
            "progress-frame",
        ]
    )
    {
        const element = {
            dataset: {},
            style: {},
            value: 0,
            max: 3,
            src: "",
            disabled: true,
            textContent: "",
            addEventListener()
            {},
            async decode()
            {
                const url = new URL(element.src, server.url);
                const response = await fetch(url);
                assert.ok(response.ok);
                assert.ok((await response.arrayBuffer()).byteLength > 0);
                assert.ok((await stat(join(directory, url.pathname))).size > 0);
            },
        };
        elements.set(id, element);
    }

    const source = await readFile(resolve(directory, script), "utf8");
    runInNewContext(source, {
        document: {
            hidden: true,
            body: { dataset: {} },
            addEventListener()
            {},
            getElementById: (id: string) => elements.get(id),
        },
        fetch: (path: string, options: RequestInit) => fetch(new URL(path, server.url), options),
        AbortSignal,
        URL,
        setTimeout,
        clearTimeout,
        console,
    });

    const deadline = Date.now() + 5000;

    while (elements.get("status")!.dataset.state !== "online" && Date.now() < deadline)
    {
        await Bun.sleep(10);
    }

    assert.equal(elements.get("status")!.dataset.state, "online");
    assert.equal(elements.get("progress")!.value, 3);
    assert.equal(elements.get("progress-fill")!.style.width, "100%");
    assert.equal(elements.get("retry")!.disabled, false);
    console.log(
        "Built HTML/CSS/JS and three assets loaded; emitted client completed synthetic health flow",
    );
}
finally
{
    await server.stop(true);
}
