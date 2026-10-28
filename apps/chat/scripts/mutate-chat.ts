import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const directory = await mkdtemp(join(tmpdir(), "opencok-chat-mutations-"));
const mutations = [
    [
        "expired socket command",
        "packages/connection/src/chat-websocket.ts",
        "if (!(await authorizeSession(false)))",
        "if (false)",
    ],
    [
        "expired broadcast recipient",
        "packages/controllers/src/chat-send.ts",
        "(!peer.authorizeSession || (await peer.authorizeSession()))",
        "true",
    ],
    [
        "expired durable recipient",
        "packages/services/src/chat-delivery.ts",
        "if (peer.authorizeSession && !(await peer.authorizeSession())) return;",
        "if (false) return;",
    ],
] as const;
const root = new URL("../../../", import.meta.url);
async function run(path?: string, source?: string)
{
    const result = await Bun.build({
        entrypoints: [
            new URL("apps/chat/tests/chat.test.ts", root).pathname,
            new URL("apps/server/test/basic-chat-commands.test.ts", root).pathname,
            new URL("apps/server/test/chat-delivery.test.ts", root).pathname,
        ],
        outdir: directory,
        naming: "[name].[ext]",
        target: "bun",
        external: ["bun:test"],
        plugins: path
            ? [
                {
                    name: "chat-mutation",
                    setup(build)
                    {
                        build.onLoad(
                            { filter: new RegExp(path.replaceAll(".", "\\.") + "$") },
                            () => ({
                                contents: source!,
                                loader: "ts",
                            }),
                        );
                    },
                },
            ]
            : [],
    });
    if (!result.success)
    {
        throw new Error("Chat mutation bundle failed");
    }
    const child = Bun.spawn(
        [
            process.execPath,
            "--no-env-file",
            "test",
            "chat.test.js",
            "basic-chat-commands.test.js",
            "chat-delivery.test.js",
        ],
        {
            cwd: directory,
            stdin: "ignore",
            stdout: "pipe",
            stderr: "pipe",
        },
    );
    const [, , code] = await Promise.all([
        new Response(child.stdout).text(),
        new Response(child.stderr).text(),
        child.exited,
    ]);
    return code;
}
try
{
    if (await run())
    {
        throw new Error("Chat mutation baseline failed");
    }
    for (const [name, path, from, to] of mutations)
    {
        const source = await readFile(new URL(path, root), "utf8");
        if (source.split(from).length !== 2)
        {
            throw new Error(`Mutation target changed: ${name}`);
        }
        if ((await run(path, source.replace(from, to))) === 0)
        {
            throw new Error(`Critical mutation survived: ${name}`);
        }
        console.log(`Killed: ${name}`);
    }
}
finally
{
    await rm(directory, { recursive: true, force: true });
}
