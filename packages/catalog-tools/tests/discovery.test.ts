import { expect, test } from "bun:test";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { Binding, DiscoveryManifest, NativeId } from "../src/contracts/discovery";
import { digest, parseClientSources, readBounded } from "../src/resources/client-sources";
import { ClientBindingDiscovery } from "../src/services/client-binding-discovery";
import { readInventory, readManifest } from "../src/validations/discovery";

function fixture(
    rows = "<ItemSpec id=\"1\" name=\"100\"/>",
    localization = "100=Synthetic secret display name\n",
    extra = "",
)
{
    const xml = Buffer.from(
        `<database xmlns="urn:synthetic"><Group id="units">${rows}</Group>${extra}</database>`,
    );
    const ini = Buffer.from(localization);
    const sources = parseClientSources(xml, ini, new Set(["units", "items"]));
    const binding: Binding = {
        nativeId: 1,
        clientId: "1",
        identity: "synthetic-unit",
        localizationKey: "100",
        nameSha256: digest("Synthetic secret display name"),
        availability: "server",
    };
    const manifest: DiscoveryManifest = {
        schemaVersion: 1,
        release: "v1",
        databaseReference: "assets/local/database.local.xml",
        localizationReference: "assets/local/text_en.ini",
        databaseSha256: digest(xml),
        localizationSha256: digest(ini),
        families: [{
            catalog: "units",
            owner: "npc",
            clientGroup: "units",
            nameField: "name",
            links: [],
            bindings: [binding],
        }],
    };
    const run = (bindings: Binding[] = [binding], ids: NativeId[] = [1], replacement = manifest) =>
        new ClientBindingDiscovery(sources).inspect(
            {
                ...replacement,
                families: [{ ...replacement.families[0]!, bindings }],
            },
            { release: "v1", catalogs: [{ catalog: "units", ids }] },
            "v1",
        );

    return { xml, ini, sources, binding, manifest, run };
}

test("deterministic reports contain metadata and fingerprints without localized content", () => {
    const h = fixture();
    const first = h.run();
    expect(first.ready).toBe(true);
    expect(JSON.stringify(first)).toBe(JSON.stringify(h.run()));
    expect(first.sources.database.sha256).toBe(digest(h.xml));
    expect(first.sources.database.reference).toBe("assets/local/database.local.xml");
    expect(first.families[0]!.bindings[0]!.localizationKey).toBe("100");
    expect(JSON.stringify(first)).not.toContain("Synthetic secret display name");
    expect(h.xml.toString()).toContain("name=\"100\"");
});

test("numeric, textual, leading-zero and opaque IDs remain distinct and roster order is preserved", () => {
    const h = fixture(
        "<ItemSpec id=\"1\" name=\"100\"/><ItemSpec id=\"001\" name=\"101\"/><ItemSpec id=\"unit-a\" name=\"102\"/>",
        "100=One\n101=Zero One\n102=Unit A\n",
    );
    const bindings: Binding[] = [
        {
            ...h.binding,
            nativeId: "001",
            clientId: "001",
            identity: "zero-one",
            localizationKey: "101",
            nameSha256: digest("Zero One"),
        },
        { ...h.binding, nameSha256: digest("One") },
        { ...h.binding, nativeId: "1", aliasOf: 1, nameSha256: digest("One") },
        {
            ...h.binding,
            nativeId: "unit-a",
            clientId: "unit-a",
            identity: "unit-a",
            localizationKey: "102",
            nameSha256: digest("Unit A"),
        },
    ];
    const result = h.run(bindings, [1, "1", "001", "unit-a"]);
    expect(result.ready).toBe(true);
    expect(result.families[0]!.bindings.map((entry) => entry.nativeId)).toEqual([
        "001",
        1,
        "1",
        "unit-a",
    ]);
    expect(h.run([h.binding], ["1"]).families[0]!.unboundServerIds).toEqual(["1"]);
});

test("coverage detects all supplied unassigned catalogs and unbound server/client rows", () => {
    const h = fixture("<ItemSpec id=\"1\" name=\"100\"/><ItemSpec id=\"2\" name=\"200\"/>");
    const result = new ClientBindingDiscovery(h.sources).inspect(h.manifest, {
        release: "v1",
        catalogs: [{ catalog: "units", ids: [1, 9] }, { catalog: "unassigned", ids: [42] }],
    }, "v1");
    expect(result.ready).toBe(false);
    expect(result.unassignedCatalogs).toEqual(["unassigned"]);
    expect(result.families[0]!.unboundServerIds).toEqual([9]);
    expect(result.families[0]!.unboundClientIds).toEqual(["2"]);
    expect(result.families[0]!.unboundClientEvidence[0]!.localizationKey).toBe("200");
    expect(result.families[0]!.unboundClientEvidence[0]!.issues).toEqual(["missing-localization"]);
});

test("record, binding and semantic duplicates cannot pass as unique evidence", () => {
    const h = fixture("<ItemSpec id=\"1\" name=\"100\"/><ItemSpec id=\"1\" name=\"100\"/>");
    const result = h.run([h.binding, { ...h.binding }], [1, 1]);
    expect(result.ready).toBe(false);
    expect(result.families[0]!.issues).toContain("duplicate-server-id");
    expect(result.families[0]!.bindings[0]!.issues).toEqual([
        "duplicate-binding-id",
        "duplicate-semantic-identity",
        "duplicate-client-id",
    ]);
});

test("client-only archetypes stay unavailable and missing server configuration is explicit", () => {
    const h = fixture();
    const unavailable: Binding = { ...h.binding, availability: "client-only" };
    expect(h.run([unavailable], []).ready).toBe(true);
    expect(h.run([unavailable], [1]).families[0]!.bindings[0]!.issues).toContain(
        "unexpected-server-record",
    );
    expect(h.run([h.binding], []).families[0]!.bindings[0]!.issues).toContain(
        "missing-server-record",
    );
});

test("aliases must identify a unique same-identity canonical binding without chains or cycles", () => {
    const h = fixture();

    for (const aliasOf of [1, "missing"])
    {
        expect(h.run([{ ...h.binding, aliasOf }]).families[0]!.bindings[0]!.issues).toContain(
            "invalid-alias",
        );
    }

    const cycle = h.run([
        { ...h.binding, aliasOf: "1" },
        { ...h.binding, nativeId: "1", aliasOf: 1 },
    ], [1, "1"]);
    expect(cycle.ready).toBe(false);
    expect(cycle.families[0]!.bindings.every((entry) => entry.issues.includes("invalid-alias")))
        .toBe(true);
});

test("duplicate localized names require distinct verified structural variants", () => {
    const h = fixture(
        "<ItemSpec id=\"1\" name=\"100\" tier=\"one\"/><ItemSpec id=\"2\" name=\"100\" tier=\"two\"/>",
    );
    const second = { ...h.binding, nativeId: 2, clientId: "2", identity: "second-unit" };
    expect(h.run([h.binding, second], [1, 2]).families[0]!.bindings[0]!.issues).toContain(
        "ambiguous-localized-name",
    );
    const variants = [
        { ...h.binding, variant: { field: "tier", value: "one" } },
        { ...second, variant: { field: "tier", value: "two" } },
    ];
    expect(h.run(variants, [1, 2]).ready).toBe(true);
    expect(
        h.run([
            ...variants,
            { ...variants[0]!, nativeId: "1", aliasOf: 1 },
        ], [1, 2, "1"]).ready,
    ).toBe(true);
    variants[1]!.variant.value = "wrong";
    expect(h.run(variants, [1, 2]).families[0]!.bindings[1]!.issues).toContain(
        "variant-evidence-mismatch",
    );
});

test("declared reference chains preserve exact client IDs and expose broken/cyclic links", () => {
    const h = fixture(
        "<ItemSpec id=\"1\" item=\"001\"/>",
        "100=Synthetic secret display name\n",
        "<Group id=\"items\"><ItemSpec id=\"001\" name=\"100\"/></Group>",
    );
    const manifest = {
        ...h.manifest,
        families: [{ ...h.manifest.families[0]!, links: [{ field: "item", group: "items" }] }],
    };
    const found = h.run([h.binding], [1], manifest);
    expect(found.ready).toBe(true);
    expect(found.families[0]!.bindings[0]!.links).toEqual([
        { group: "units", clientId: "1", field: "item", targetGroup: "items", targetId: "001" },
    ]);
    const broken = {
        ...manifest,
        families: [{ ...manifest.families[0]!, links: [{ field: "missing", group: "items" }] }],
    };
    expect(h.run([h.binding], [1], broken).families[0]!.bindings[0]!.issues).toContain(
        "invalid-client-link",
    );
    const cyclic = {
        ...manifest,
        families: [{ ...manifest.families[0]!, links: [{ field: "id", group: "units" }] }],
    };
    expect(h.run([h.binding], [1], cyclic).families[0]!.bindings[0]!.issues).toContain(
        "cyclic-client-link",
    );
});

test("missing, changed, duplicate and ambiguous localized values remain unresolved", () => {
    for (
        const [text, issue] of [
            ["200=Other\n", "missing-localization"],
            ["100=Changed\n", "localized-name-fingerprint-mismatch"],
            ["100=First\n100=Second\n", "ambiguous-localization"],
            ["100=First\nunstructured continuation\n", "ambiguous-localization"],
            ["100=\n", "ambiguous-localization"],
        ]
    )
    {
        const h = fixture(undefined, text);
        expect(h.run().families[0]!.bindings[0]!.issues).toContain(issue!);
    }

    const h = fixture("<ItemSpec id=\"1\" name=\"200\"/>", "200=Synthetic secret display name\n");
    expect(h.run().families[0]!.bindings[0]!.issues).toContain("localization-link-mismatch");
});

test("version reuse and changed source fingerprints cannot silently reuse evidence", () => {
    const h = fixture();
    const manifest = {
        ...h.manifest,
        release: "v2",
        databaseSha256: "0".repeat(64),
        localizationSha256: "1".repeat(64),
    };
    expect(h.run([h.binding], [1], manifest).issues).toEqual([
        "release-mismatch",
        "database-fingerprint-mismatch",
        "localization-fingerprint-mismatch",
    ]);
    const v2 = new ClientBindingDiscovery(h.sources).inspect({ ...h.manifest, release: "v2" }, {
        release: "v2",
        catalogs: [{ catalog: "units", ids: [1] }],
    }, "v2");
    expect(v2.ready).toBe(true);
    expect(v2.release).toBe("v2");
});

test("malformed XML, entities, duplicate groups, invalid UTF-8 and schemas fail without private text", () => {
    for (
        const xml of [
            "<database><Group id=\"units\"></database>",
            "<!DOCTYPE database [<!ENTITY leak SYSTEM \"file:///private/key\">]><database/>",
            "<database><Group id=\"units\"/><Group id=\"units\"/></database>",
            "<database><Group id=\"units\"><ItemSpec id=\"/private/key\"/></Group></database>",
        ]
    )
    {
        expect(() =>
            parseClientSources(Buffer.from(xml), Buffer.from("100=Secret"), new Set(["units"]))
        ).toThrow("Invalid client reference input");
    }
    expect(() => parseClientSources(new Uint8Array([255]), new Uint8Array(), new Set())).toThrow(
        "Invalid client reference input",
    );
    expect(() => readManifest({ private: "/private/key" })).toThrow("Invalid discovery manifest");

    for (const id of [NaN, Infinity, -0, Number.MAX_SAFE_INTEGER + 1, "\ud800", "\n"])
    {
        expect(() => readInventory({ release: "v1", catalogs: [{ catalog: "units", ids: [id] }] }))
            .toThrow("Invalid server inventory");
    }
});

test("CLI check mode is read-only, deterministic and hides input paths and display text on failures", async () => {
    const directory = await mkdtemp(join(tmpdir(), "opencok-binding-test-"));
    const h = fixture();

    try
    {
        const paths = ["manifest.json", "server.json", "database.xml", "text.ini"].map((name) =>
            join(directory, name)
        );
        const contents = [
            JSON.stringify(h.manifest),
            JSON.stringify({ release: "v1", catalogs: [{ catalog: "units", ids: [1] }] }),
            h.xml,
            h.ini,
        ];

        for (let i = 0; i < paths.length; i++)
        {
            await writeFile(paths[i]!, contents[i]!);
        }

        const cli = new URL("../src/discover.ts", import.meta.url).pathname;
        const run = async (release = "v1", extra = paths) => {
            const child = Bun.spawn([
                process.execPath,
                "--no-env-file",
                cli,
                release,
                ...extra,
                "--check",
            ], { stdout: "pipe", stderr: "pipe" });
            const [stdout, stderr, code] = await Promise.all([
                new Response(child.stdout).text(),
                new Response(child.stderr).text(),
                child.exited,
            ]);

            return { stdout, stderr, code };
        };
        const first = await run();
        expect(first.code).toBe(0);
        expect(await run()).toEqual(first);
        expect(first.stdout).not.toContain(directory);
        expect(first.stdout).not.toContain("Synthetic secret display name");
        expect((await run("v2")).code).toBe(1);
        const unsafeRelease = await run("/private/release");
        expect(unsafeRelease.code).toBe(2);
        expect(unsafeRelease.stderr).not.toContain("/private/release");
        const invalid = await run("v1", [join(directory, "PRIVATE-SECRET"), ...paths.slice(1)]);
        expect(invalid.code).toBe(2);
        expect(invalid.stdout).toBe("");
        expect(invalid.stderr).not.toContain(directory);
        expect(invalid.stderr).not.toContain("PRIVATE-SECRET");

        for (let i = 0; i < paths.length; i++)
        {
            expect(await readFile(paths[i]!)).toEqual(Buffer.from(contents[i]!));
        }
        await expect(readBounded(join(directory, "PRIVATE-SECRET"), 1)).rejects.toThrow(
            "Unable to read input",
        );
        await expect(readBounded(paths[2]!, 1)).rejects.toThrow("Invalid input size or type");
        await expect(readBounded(directory, 100)).rejects.toThrow("Invalid input size or type");
    }
    finally
    {
        await rm(directory, { recursive: true, force: true });
    }
});

test.skipIf(process.platform === "win32")(
    "CLI rejects a FIFO without waiting for a writer",
    async () => {
        const directory = await mkdtemp(join(tmpdir(), "opencok-binding-fifo-test-"));

        try
        {
            const fifo = join(directory, "PRIVATE-FIFO");
            const created = Bun.spawnSync(["mkfifo", fifo], { stdout: "pipe", stderr: "pipe" });
            expect(created.exitCode).toBe(0);
            const cli = new URL("../src/discover.ts", import.meta.url).pathname;
            const child = Bun.spawn([
                process.execPath,
                "--no-env-file",
                cli,
                "v1",
                fifo,
                fifo,
                fifo,
                fifo,
            ], { stdout: "pipe", stderr: "pipe" });
            let timedOut = false;
            const timer = setTimeout(() => {
                timedOut = true;
                child.kill("SIGKILL");
            }, 3000);

            try
            {
                const [stdout, stderr, code] = await Promise.all([
                    new Response(child.stdout).text(),
                    new Response(child.stderr).text(),
                    child.exited,
                ]);
                expect(timedOut).toBe(false);
                expect(code).toBe(2);
                expect(stdout).toBe("");
                expect(stderr).not.toContain(directory);
                expect(stderr).not.toContain("PRIVATE-FIFO");
            }
            finally
            {
                clearTimeout(timer);
                child.kill("SIGKILL");
                await child.exited;
            }
        }
        finally
        {
            await rm(directory, { recursive: true, force: true });
        }
    },
    10000,
);

test("duplicate catalogs and missing client groups remain explicit failures", () => {
    const h = fixture();
    const discovery = new ClientBindingDiscovery(h.sources);
    const duplicated = discovery.inspect(h.manifest, {
        release: "v1",
        catalogs: [{ catalog: "units", ids: [1] }, { catalog: "units", ids: [2] }],
    }, "v1");
    expect(duplicated.issues).toContain("duplicate-catalog");
    expect(duplicated.families[0]!.unboundServerIds).toEqual([2]);
    expect(duplicated.ready).toBe(false);
    const missing = new ClientBindingDiscovery({ ...h.sources, groups: new Map() }).inspect(
        h.manifest,
        { release: "v1", catalogs: [{ catalog: "units", ids: [1] }] },
        "v1",
    );
    expect(missing.families[0]!.issues).toEqual(["missing-client-group"]);
    expect(missing.families[0]!.bindings[0]!.issues).toEqual(["missing-client-record"]);
    expect(missing.ready).toBe(false);
});

test("empty inventories and negative-zero IDs cannot produce a vacuous normalized success", () => {
    const h = fixture();

    for (
        const databaseReference of [
            "/private/key",
            "../key",
            "assets/../key",
            "C:\\private",
            "assets/./key",
        ]
    )
    {
        expect(() => readManifest({ ...h.manifest, databaseReference })).toThrow(
            "Invalid discovery manifest",
        );
    }
    expect(() => readManifest({ ...h.manifest, families: [] })).toThrow(
        "Invalid discovery manifest",
    );
    expect(() => readInventory({ release: "v1", catalogs: [] })).toThrow(
        "Invalid server inventory",
    );
    expect(() =>
        readManifest({
            ...h.manifest,
            families: [{ ...h.manifest.families[0]!, bindings: [{ ...h.binding, nativeId: -0 }] }],
        })
    ).toThrow("Invalid discovery manifest");
});
