import { expect, test } from "bun:test";
import { readFile } from "node:fs/promises";
import { dragonCatalogBindings } from "@opencok/constants/dragon-catalog-bindings";
import { dragonRoster } from "@opencok/dragon/domain/roster";
import { readManifest } from "../src/validations/discovery";

test("Dragon evidence covers the complete maintained roster without making Vildrin available", async () => {
    const path = new URL(
        "../../dragon/src/bindings/client-discovery.v12.06.0.json",
        import.meta.url,
    );
    const manifest = readManifest(JSON.parse(await readFile(path, "utf8")));
    expect(manifest.release).toBe("v12.06.0");
    expect(manifest.families).toHaveLength(1);
    const family = manifest.families[0]!;
    expect(family.catalog).toBe("dragon_base");
    expect(family.owner).toBe("dragon");
    expect(family.bindings.map((binding) => binding.identity)).toEqual(
        dragonRoster.map((dragon) => dragon.identity),
    );

    for (const [index, dragon] of dragonRoster.entries())
    {
        const binding = family.bindings[index]!;
        expect(binding.nativeId).toBe(dragonCatalogBindings.dragons[dragon.identity]);
        expect(binding.clientId).toBe(String(binding.nativeId));
        expect(binding.availability).toBe(dragon.server ? "server" : "client-only");
    }
    expect(family.bindings.filter((binding) => binding.availability === "server")).toHaveLength(13);
    expect(
        family.bindings.filter((binding) => binding.availability === "client-only").map((binding) =>
            binding.identity
        ),
    ).toEqual(["vildrin"]);
});
