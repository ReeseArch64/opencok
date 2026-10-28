import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve, join, dirname } from "node:path";

const [candidate, app, mode, destination, override] = process.argv.slice(2);

if (!candidate || !app || !["minified", "diagnostic"].includes(mode ?? "") || !destination)
{
    throw new Error(
        "Usage: build.ts <bun-api|esbuild|rolldown|rollup-swc> <app> <minified|diagnostic> <output>",
    );
}

const root = resolve(import.meta.dirname, "../..");
const web = app === "web";
const output = resolve(destination);
const entry = override ?? join(root, "apps", app, "src", web ? "index.html" : "index.ts");
const directory = web ? output : join(output, "src");
const minify = mode === "minified";

await mkdir(directory, { recursive: true });

switch (candidate)
{
    case "bun-api":
    {
        const result = await Bun.build({
            entrypoints: [entry],
            outdir: directory,
            target: web ? "browser" : "bun",
            format: "esm",
            naming: override && !web ? "index.test.[ext]" : undefined,
            external: ["bun:test"],
            minify,
            sourcemap: minify ? "none" : "linked",
        });

        if (!result.success)
        {
            throw new AggregateError(result.logs, "Bun build failed");
        }

        break;
    }
    case "esbuild":
    {
        const { build } = await import("esbuild");
        await build({
            entryPoints: [web ? join(dirname(entry), "main.ts") : entry],
            outdir: directory,
            bundle: true,
            platform: web ? "browser" : "node",
            conditions: web ? ["browser"] : ["bun"],
            mainFields: ["module", "main"],
            format: "esm",
            target: "esnext",
            external: web ? [] : ["bun", "bun:test"],
            entryNames: override && !web ? "index.test" : "[name]",
            minify,
            sourcemap: minify ? false : "linked",
            loader: { ".jpg": "file", ".png": "file" },
            logLevel: "error",
        });

        if (web)
        {
            await build({
                entryPoints: [join(dirname(entry), "styles.css")],
                outdir: directory,
                bundle: true,
                loader: { ".jpg": "file", ".png": "file" },
                minify,
                sourcemap: minify ? false : "linked",
                logLevel: "error",
            });
            const html = await readFile(entry, "utf8");
            await writeFile(join(directory, "index.html"), html.replace("./main.ts", "./main.js"));
        }

        break;
    }
    case "rolldown":
    {
        const { rolldown } = await import("rolldown");
        const bundle = await rolldown({
            input: entry,
            platform: web ? "browser" : "node",
            resolve: {
                conditionNames: web
                    ? ["browser", "import", "default"]
                    : ["bun", "import", "default"],
                mainFields: ["module", "main"],
            },
            external: web ? [] : ["bun", "bun:test"],
            onwarn(warning)
            {
                throw new Error(warning.message);
            },
        });

        try
        {
            await bundle.write({
                dir: directory,
                format: "esm",
                minify,
                sourcemap: !minify,
                entryFileNames: override ? "index.test.js" : "index.js",
            });
        }
        finally
        {
            await bundle.close();
        }

        break;
    }
    case "rollup-swc":
    {
        const { rollup } = await import("rollup");
        const { nodeResolve } = await import("@rollup/plugin-node-resolve");
        const { default: commonjs } = await import("@rollup/plugin-commonjs");
        const { default: json } = await import("@rollup/plugin-json");
        const swc = await import("@swc/core");
        const { isBuiltin } = await import("node:module");
        const bundle = await rollup({
            input: entry,
            external: (id) => id === "bun" || id === "bun:test" || isBuiltin(id),
            plugins: [
                nodeResolve({
                    exportConditions: ["bun"],
                    mainFields: ["module", "main"],
                    extensions: [".mjs", ".js", ".json", ".node", ".ts"],
                    preferBuiltins: true,
                }),
                json(),
                {
                    name: "swc-typescript-and-minification",
                    transform(code, id)
                    {
                        if (!id.endsWith(".ts"))
                        {
                            return null;
                        }

                        return swc.transform(code, {
                            filename: id,
                            jsc: { parser: { syntax: "typescript" }, target: "esnext" },
                            sourceMaps: !minify,
                        });
                    },
                    renderChunk(code)
                    {
                        return minify
                            ? swc.minify(code, { module: true, compress: true, mangle: true })
                            : null;
                    },
                },
                commonjs({ ignoreDynamicRequires: true }),
            ],
        });

        try
        {
            await bundle.write({
                dir: directory,
                format: "esm",
                sourcemap: !minify,
                entryFileNames: override ? "index.test.js" : "index.js",
                inlineDynamicImports: true,
            });
        }
        finally
        {
            await bundle.close();
        }

        break;
    }
    default:
        throw new Error(`Unknown candidate: ${candidate}`);
}
