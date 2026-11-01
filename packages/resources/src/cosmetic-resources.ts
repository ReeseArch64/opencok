import { XMLBuilder, XMLParser } from "fast-xml-parser";
import { cosmeticStatusRule } from "@opencok/rules/city-cosmetics";
import { parseRecords } from "./xml-fixtures";

export function cosmeticResourceXml(source: string, table: "status" | "life_treeS"): string
{
    parseRecords(source, table);
    const options = {
        preserveOrder: true,
        ignoreAttributes: false,
        attributeNamePrefix: "",
        parseAttributeValue: false,
        parseTagValue: false,
        trimValues: false,
    };
    const document = new XMLParser(options).parse(source);
    const visit = (nodes: Record<string, unknown>[]) => {
        for (const node of nodes)
        {
            if (Object.hasOwn(node, "ItemSpec") && node[":@"])
            {
                const attributes = node[":@"] as Record<string, string>;
                node[":@"] = table === "status"
                    ? cosmeticStatusRule(attributes)
                    : { ...attributes, buff: "" };
            }

            for (const [key, value] of Object.entries(node))
            {
                if (key !== ":@" && Array.isArray(value))
                {
                    visit(value);
                }
            }
        }
    };
    visit(document);

    return new XMLBuilder(options).build(document);
}
