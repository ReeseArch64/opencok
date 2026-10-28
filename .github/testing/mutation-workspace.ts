import { mkdtemp, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

export async function createMutationWorkspace(prefix: string): Promise<string>
{
    const directory = await mkdtemp(join(tmpdir(), prefix));

    try
    {
        await writeFile(
            join(directory, "package.json"),
            JSON.stringify({ private: true, type: "module", workspaces: [] }),
        );
        await symlink(
            resolve(import.meta.dirname, "../../node_modules"),
            join(directory, "node_modules"),
            "dir",
        );

        return directory;
    }
    catch (error)
    {
        await rm(directory, { recursive: true, force: true });

        throw error;
    }
}
