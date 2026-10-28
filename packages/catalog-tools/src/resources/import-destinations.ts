import { realpath } from "node:fs/promises";
import { basename, dirname, isAbsolute, join, relative, resolve, sep } from "node:path";

async function canonical(path: string): Promise<string>
{
    const absolute = resolve(path);

    try
    {
        return await realpath(absolute);
    }
    catch (error)
    {
        if ((error as NodeJS.ErrnoException).code !== "ENOENT" || dirname(absolute) === absolute)
        {
            throw error;
        }

        return join(await canonical(dirname(absolute)), basename(absolute));
    }
}

function contains(parent: string, child: string): boolean
{
    const path = relative(parent, child);

    return path === "" || (!path.startsWith(".." + sep) && path !== ".." && !isAbsolute(path));
}

export async function validateImportDestinations(input: string, outputs: string[]): Promise<void>
{
    const source = await realpath(input);
    const destinations = await Promise.all(outputs.map(canonical));

    if (destinations.some((target) => contains(source, target) || contains(target, source)))
    {
        throw new Error("Import destinations must be separate from authorized inputs");
    }
}
