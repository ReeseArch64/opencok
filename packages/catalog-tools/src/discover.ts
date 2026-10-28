import { readBounded, parseClientSources } from "./resources/client-sources";
import { readInventory, readManifest } from "./validations/discovery";
import { ClientBindingDiscovery } from "./services/client-binding-discovery";

async function main(): Promise<void>
{
    const args = process.argv.slice(2);
    const check = args.at(-1) === "--check";

    if (check)
    {
        args.pop();
    }

    if (args.length !== 5)
    {
        throw new Error();
    }

    const [release, manifestPath, inventoryPath, databasePath, localizationPath] = args as [
        string,
        string,
        string,
        string,
        string,
    ];
    const manifest = readManifest(
        JSON.parse((await readBounded(manifestPath, 16 * 1024 * 1024)).toString("utf8")),
    );
    const inventory = readInventory(
        JSON.parse((await readBounded(inventoryPath, 32 * 1024 * 1024)).toString("utf8")),
    );
    const selected = new Set(
        manifest.families.flatMap((family) => [
            family.clientGroup,
            ...family.links.map((link) => link.group),
        ]),
    );
    const sources = parseClientSources(
        await readBounded(databasePath, 64 * 1024 * 1024),
        await readBounded(localizationPath, 16 * 1024 * 1024),
        selected,
    );
    const report = new ClientBindingDiscovery(sources).inspect(manifest, inventory, release);
    process.stdout.write(JSON.stringify(report, null, 2) + "\n");

    if (check && !report.ready)
    {
        process.exitCode = 1;
    }
}

main().catch(() => {
    process.stderr.write(
        "Discovery failed: supply a release, manifest, server inventory, authorized database XML and localization file, with optional --check. Inputs must be valid and within documented limits.\n",
    );
    process.exitCode = 2;
});
