import { expect, test } from "bun:test";
import { cosmeticResourceXml } from "../src/cosmetic-resources";
import { parseRecords } from "../src/xml-fixtures";
import { mkdtemp, mkdir, writeFile, readFile, symlink, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

test("cosmeticResourceXml_skinPreviews_removesAbilitiesAndBonusesWithoutChangingOwnershipMetadata", () => {
    const source =
        "<database><Group id=\"status\"><ItemSpec id=\"1\" type2=\"100\" effect=\"14;1|487;500\" effectAdd=\"50;99\" skill=\"12\" time=\"3600\" subgroup=\"8\"/><ItemSpec id=\"2\" type2=\"9\" effect=\"50;25\"/></Group></database>";

    const output = cosmeticResourceXml(source, "status");

    expect(parseRecords(output, "status")).toEqual([
        {
            id: "1",
            type2: "100",
            effect: "14;1",
            effectAdd: "",
            skill: "",
            time: "3600",
            subgroup: "8",
            random: "0",
        },
        { id: "2", type2: "9", effect: "50;25" },
    ]);
    expect(cosmeticResourceXml(output, "status")).toBe(output);
});

test("cosmeticResourceXml_treeSkinPreview_removesBuffsAndPreservesUpgradeCostsAndDuration", () => {
    const source =
        "<database><Group><ItemSpec id=\"980001\" buff=\"505182;505183\" skinExp=\"100\" time=\"10\" goldSkinExp=\"2\"/></Group></database>";

    expect(parseRecords(cosmeticResourceXml(source, "life_treeS"), "life_treeS")).toEqual([
        { id: "980001", buff: "", skinExp: "100", time: "10", goldSkinExp: "2" },
    ]);
});

test("cosmeticResourceXml_invalidOrEntityDocument_rejectsBeforeGeneratingResources", () => {
    expect(() => cosmeticResourceXml("<database>", "status")).toThrow();
    expect(() => cosmeticResourceXml("<!DOCTYPE database><database/>", "status")).toThrow();
});

test("cosmeticResourcesCli_sourceAliasesAndExistingOutput_rejectsWithoutOverwritingInputs", async () => {
    const directory = await mkdtemp(join(tmpdir(), "opencok-723-resources-"));
    const source = join(directory, "source");
    const output = join(directory, "output");
    const original =
        "<database><Group><ItemSpec id=\"1\" type2=\"100\" effect=\"50;99\"/></Group></database>";
    const run = async (destination: string) => {
        const child = Bun.spawn([
            process.execPath,
            "--no-env-file",
            new URL("../scripts/cosmetic-resources.ts", import.meta.url).pathname,
            source,
            destination,
        ], { stdout: "pipe", stderr: "pipe" });
        await Promise.all([new Response(child.stdout).text(), new Response(child.stderr).text()]);

        return child.exited;
    };
    try
    {
        await mkdir(source);
        await writeFile(join(source, "status.xml"), original);
        await writeFile(
            join(source, "life_treeS.xml"),
            "<database><Group><ItemSpec id=\"2\" buff=\"1\"/></Group></database>",
        );
        await symlink(source, join(directory, "alias"));

        expect(await run(join(source, "..hidden"))).not.toBe(0);
        expect(await run(join(directory, "alias", "derived"))).not.toBe(0);
        expect(await run(output)).toBe(0);
        const generated = await readFile(join(output, "status.xml"), "utf8");
        expect(parseRecords(generated, "status")[0]!.effect).toBe("");
        expect(await run(output)).not.toBe(0);
        expect(await readFile(join(output, "status.xml"), "utf8")).toBe(generated);
        expect(await readFile(join(source, "status.xml"), "utf8")).toBe(original);
    }
    finally
    {
        await rm(directory, { recursive: true });
    }
});
