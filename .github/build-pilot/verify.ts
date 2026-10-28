import assert from "node:assert/strict";
import { copyFile, mkdir, mkdtemp, readFile, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const root = resolve(import.meta.dirname, "../..");
const directory = await mkdtemp(join(tmpdir(), "opencok-build-verification-"));
const candidate = process.argv[2] ?? "bun-api";
const fixtures = [
    "apps/api/tests/effect.test.ts",
    "apps/api/tests/discovery.test.ts",
    "apps/chat/tests/chat.test.ts",
    "apps/server/test/effect.test.ts",
    "apps/server/test/login.test.ts",
    "apps/server/test/login-session.test.ts",
    "apps/server/test/login-config.test.ts",
    "apps/server/test/city-progression.test.ts",
    "apps/server/test/city-defense.test.ts",
    "apps/server/test/branch-city.test.ts",
    "apps/server/test/protocol.test.ts",
    "apps/server/test/world-point-command.test.ts",
    "apps/server/test/java-int-map-encode.test.ts",
    "apps/server/test/bootstrap.test.ts",
    ".github/build-pilot/resource.test.ts",
];

async function run(command: string[], cwd = root)
{
    const child = Bun.spawn(command, {
        cwd,
        env: { PATH: process.env.PATH, TZ: "UTC" },
        stdin: "ignore",
        stdout: "pipe",
        stderr: "pipe",
        timeout: 120000,
    });
    const [stdout, stderr, code] = await Promise.all([
        new Response(child.stdout).text(),
        new Response(child.stderr).text(),
        child.exited,
    ]);

    return { code, stdout, stderr };
}

async function compile(mode: string, entry: string, output: string)
{
    const result = await run([
        process.execPath,
        "--no-env-file",
        join(import.meta.dirname, "build.ts"),
        candidate,
        "server",
        mode,
        output,
        entry,
    ]);
    assert.equal(result.code, 0, result.stderr);
}

try
{
    await writeFile(
        join(directory, "package.json"),
        JSON.stringify({ type: "module", workspaces: [] }),
    );
    await symlink(join(root, "node_modules"), join(directory, "node_modules"), "dir");
    const suite = join(directory, "suite.ts");
    await writeFile(
        suite,
        fixtures.map((file) => `import ${JSON.stringify(join(root, file))};`).join("\n"),
    );

    for (const mode of ["minified", "diagnostic"])
    {
        const output = join(directory, mode, "dist");
        await compile(mode, suite, output);
        await mkdir(join(output, "data"), { recursive: true });
        await copyFile(
            join(root, "packages/resources/data/badwords.json"),
            join(output, "data/badwords.json"),
        );
        const result = await run([
            process.execPath,
            "--no-env-file",
            "test",
            join(output, "src/index.test.js"),
        ], directory);
        assert.equal(result.code, 0, result.stderr);
        console.log(
            `${candidate} ${mode}: ${result.stderr.trim().split("\n").slice(-4).join(" ")}`,
        );
    }

    const failure = join(directory, "synthetic-failure.ts");
    const output = join(directory, "failure");
    await writeFile(failure, "throw new Error(\"synthetic-source-map-marker\");\n");
    await compile("diagnostic", failure, output);
    const failed = await run(
        [process.execPath, "--no-env-file", join(output, "src/index.test.js")],
        directory,
    );
    assert.notEqual(failed.code, 0);
    assert.match(failed.stderr, /synthetic-failure\.ts:1/);
    assert.match(failed.stderr, /synthetic-source-map-marker/);
    const map = JSON.parse(await readFile(join(output, "src/index.test.js.map"), "utf8"));
    assert.ok(map.sources.some((source: string) => source.endsWith("synthetic-failure.ts")));

    const invalid = join(directory, "invalid.ts");
    await writeFile(
        invalid,
        "const value: number = \"synthetic-type-error\";\nexport { value };\n",
    );
    await compile("minified", invalid, join(directory, "type-error"));
    const checked = await run([
        process.execPath,
        "--no-env-file",
        join(root, "node_modules/typescript/bin/tsc"),
        "--noEmit",
        "--strict",
        "--skipLibCheck",
        invalid,
    ], directory);
    assert.notEqual(checked.code, 0);
    assert.match(checked.stdout + checked.stderr, /TS2322/);
    console.log(`${candidate}: mapped synthetic failure and separate semantic rejection passed`);

    for (const app of ["api", "chat", "server"])
    {
        const output = join(directory, "apps", app, "dist");
        const built = await run([
            process.execPath,
            "--no-env-file",
            join(import.meta.dirname, "build.ts"),
            candidate,
            app,
            "minified",
            output,
        ]);
        assert.equal(built.code, 0, built.stderr);
        const started = await run(
            [process.execPath, "--no-env-file", join(output, "src/index.js")],
            directory,
        );
        assert.notEqual(started.code, 0);
        assert.match(
            started.stdout + started.stderr,
            /environment configuration|EnvironmentError|service_failed/,
        );
        assert.doesNotMatch(
            started.stdout + started.stderr,
            /Cannot locate workspace root|Cannot find module/,
        );
        console.log(
            `${candidate} ${app}: emitted entrypoint rejects missing environment in isolated workspace layout`,
        );
    }
}
finally
{
    await rm(directory, { recursive: true, force: true });
}
