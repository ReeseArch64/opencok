import { expect, test } from "bun:test";
import { mkdir, mkdtemp, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { validateImportDestinations } from "../src/resources/import-destinations";

test("import outputs cannot contain an input or be nested inside a source directory", async () => {
    const directory = await mkdtemp(join(tmpdir(), "opencok-import-destinations-"));
    const source = join(directory, "source");
    const input = join(source, "building.xml");

    try
    {
        await mkdir(source);
        await writeFile(input, "synthetic");
        await expect(validateImportDestinations(source, [join(directory, "source-review/new")]))
            .resolves.toBeUndefined();
        await expect(validateImportDestinations(input, [join(source, "buildings")]))
            .resolves.toBeUndefined();

        for (const output of [source, directory, join(source, "new/nested")])
        {
            await expect(validateImportDestinations(source, [output])).rejects.toThrow(
                "must be separate from authorized inputs",
            );
        }
        await expect(validateImportDestinations(input, [source])).rejects.toThrow(
            "must be separate from authorized inputs",
        );
    }
    finally
    {
        await rm(directory, { recursive: true, force: true });
    }
});

test.skipIf(process.platform === "win32")(
    "input/output symlinks cannot conceal an overlapping destination",
    async () => {
        const directory = await mkdtemp(join(tmpdir(), "opencok-import-symlinks-"));
        const source = join(directory, "source");
        const alias = join(directory, "alias");

        try
        {
            await mkdir(source);
            await symlink(source, alias);
            await expect(validateImportDestinations(source, [join(alias, "new/nested")]))
                .rejects.toThrow("must be separate from authorized inputs");
            await expect(validateImportDestinations(alias, [source])).rejects.toThrow(
                "must be separate from authorized inputs",
            );
        }
        finally
        {
            await rm(directory, { recursive: true, force: true });
        }
    },
);
