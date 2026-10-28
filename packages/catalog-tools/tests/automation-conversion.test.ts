import { test, expect } from "bun:test";
import { XMLParser } from "fast-xml-parser";
import { convertCatalog } from "../src/mappings/catalog-conversion";
import { CatalogKind } from "@opencok/enums/catalog-kind";

test("automation conversion preserves nested Boolean conditions and direct if/else actions", () => {
    const parser = new XMLParser({
        preserveOrder: true,
        ignoreAttributes: false,
        attributeNamePrefix: "",
        parseTagValue: false,
        parseAttributeValue: false,
        trimValues: false,
    });
    const { definition } = convertCatalog(
        parser.parse(
            "<database><trigger id=\"1\"><events><event type=\"58\">1;10</event></events><conditions/><actions><action type=\"13\"><condition type=\"51\"><condition type=\"7\">$reward;==;10</condition><condition type=\"7\">$claimed;==;0</condition></condition><action type=\"41\"><condition type=\"7\">$score;&gt;=;100</condition><action type=\"48\">10</action></action><action type=\"24\">$denied;1</action></action></actions></trigger></database>",
        ),
        "trigger-activity",
    );
    expect(definition.kind).toBe(CatalogKind.Automation);
    if (definition.kind !== CatalogKind.Automation)
    {
        throw new Error("Unexpected catalog kind");
    }
    const branch = definition.rules[0]!.actions[0]!.branch!;
    expect(branch.conditions[0]!.conditions!.map((c) => c.parameters)).toEqual([
        "$reward;==;10",
        "$claimed;==;0",
    ]);
    expect(branch.onMatch[0]!.branch!.onMatch[0]!.parameters).toBe("10");
    expect(branch.otherwise[0]!.parameters).toBe("$denied;1");
});

test("compound actions retain ordered counter and reward operations", () => {
    const parser = new XMLParser({
        preserveOrder: true,
        ignoreAttributes: false,
        attributeNamePrefix: "",
        parseTagValue: false,
        parseAttributeValue: false,
    });
    const { definition } = convertCatalog(
        parser.parse(
            "<database><trigger id=\"2\"><events/><conditions/><actions><action type=\"21\"><action type=\"9\">$count;+;1</action><action type=\"48\">10</action></action></actions></trigger></database>",
        ),
        "trigger-activity",
    );
    if (definition.kind !== CatalogKind.Automation)
    {
        throw new Error("Unexpected catalog kind");
    }
    expect(definition.rules[0]!.actions[0]!.actions!.map((action) => action.code)).toEqual([9, 48]);
});
