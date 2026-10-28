import { XMLParser } from "fast-xml-parser";
import { createHash } from "node:crypto";

export const tableXml =
    "<database><Group id=\"synthetic\"><ItemSpec id=\"001\" wood=\"9007199254740993\" name=\"Synthetic\"/><ItemSpec id=\"2\" wood=\"0\"/></Group></database>";
export const buildingXml =
    "<database><Group id=\"building\"><ItemSpec id=\"413000\" level=\"0\" max_lv=\"30\" wood=\"9007199254740993\" para1=\"2\" para2=\"100\"/><ItemSpec id=\"400001\" level=\"1\" wood=\"42\"/></Group></database>";
export const fixtureXml = [
    ["item", tableXml],
    ["activity", tableXml],
    ["general_base", "<database><Group><ItemSpec id=\"53571\"/></Group></database>"],
    ["dragon_base", "<database><Group><ItemSpec id=\"109000\"/></Group></database>"],
    [
        "trigger-activity",
        "<database><trigger id=\"2\"><events/><conditions/><actions><action type=\"21\"><action type=\"9\">$count;+;1</action><action type=\"48\">10</action></action></actions></trigger></database>",
    ],
    [
        "variable",
        "<database><p id=\"counter\">001</p><s id=\"gold\">9007199254740993</s></database>",
    ],
    ["web", "<database><flag open=\"1\" key=\"2\"/><exclude>synthetic</exclude></database>"],
    [
        "ArenaMap",
        "<map orientation=\"orthogonal\" width=\"2\" height=\"1\" tilewidth=\"8\" tileheight=\"8\"><layer name=\"synthetic\" width=\"2\" height=\"1\"><data><tile gid=\"1\"/><tile gid=\"0\"/></data></layer></map>",
    ],
] as const;

export async function* catalogSources()
{
    const parser = new XMLParser({
        preserveOrder: true,
        ignoreAttributes: false,
        attributeNamePrefix: "",
        parseAttributeValue: false,
        parseTagValue: false,
        trimValues: false,
        removeNSPrefix: true,
    });
    for (const [id, xml] of fixtureXml)
    {
        yield {
            id,
            ordered: parser.parse(xml),
            sourceBytes: Buffer.byteLength(xml),
            sourceSha256: createHash("sha256").update(xml).digest("hex"),
        };
    }
}
