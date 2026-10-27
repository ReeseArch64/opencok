import { indexRules } from "./catalog-compatibility.ts";
import type { Rule } from "@opencok/rules/game";
import { XMLParser, XMLValidator } from "fast-xml-parser";

function parseDocument(xml: string, preserveOrder = false) {
  if (
    Buffer.byteLength(xml) > 16 * 1024 * 1024 ||
    /<!DOCTYPE|<!ENTITY/i.test(xml) ||
    XMLValidator.validate(xml) !== true
  )
    {throw new Error("Invalid gameplay resource XML");}

  return new XMLParser({
    preserveOrder,
    ignoreAttributes: false,
    attributeNamePrefix: "",
    parseAttributeValue: false,
    parseTagValue: false,
    trimValues: false,
    removeNSPrefix: true,
    isArray: (tag) => tag === "Group" || tag === "ItemSpec",
  }).parse(xml);
}

export function parseRecords(source: string, name: string): Rule[] {
  const parsed = parseDocument(source);

  if (!Object.hasOwn(parsed, "database")) {throw new Error("Invalid gameplay resource root");}

  const records: unknown[] = [];
  const collect = (node: unknown) => {
    if (!node || typeof node !== "object") {return;}

    const group = node as { id?: string; ItemSpec?: unknown[]; Group?: unknown[] };

    if (group.ItemSpec && (name !== "vip" || group.id === "vip")) {records.push(...group.ItemSpec);}

    for (const child of group.Group ?? []) {collect(child);}
  };
  collect(parsed.database);

  for (const record of records)
    {if (
      !record ||
      typeof record !== "object" ||
      Array.isArray(record) ||
      Object.values(record).some((value) => typeof value !== "string")
    )
      {throw new Error("Invalid gameplay resource record");}}

  return records as Rule[];
}

export function parseDeclaredCatalog(source: string): {
  items: Map<string, Rule>;
  groups: Map<string, Rule[]>;
  records: Rule[];
} {
  type Element = Record<string, unknown> & { ":@"?: Rule };
  const parsed = parseDocument(source, true) as Element[];
  const root = parsed.find((element) => Object.hasOwn(element, "database"));

  if (!root || !Array.isArray(root.database)) {throw new Error("Invalid gameplay resource root");}

  const elements = (nodes: Element[]) =>
    nodes.filter((node) =>
      Object.keys(node).some((key) => key !== ":@" && !key.startsWith("#") && !key.startsWith("?")),
    );
  const children = elements(root.database as Element[]);
  const groups = children.filter((node) => Object.hasOwn(node, "Group"));
  const items = new Map<string, Rule>();
  const groupsById = new Map<string, Rule[]>();
  const declarations: Rule[] = [];
  const records = (nodes: Element[]): Rule[] =>
    elements(nodes).map((node) => {
      const record = { ...node[":@"] };

      if (Object.values(record).some((value) => typeof value !== "string"))
        {throw new Error("Invalid gameplay resource record");}

      items.set(record.id ?? "null", record);
      declarations.push(record);

      return record;
    });

  if (!groups.length) {records(children);}
  else
    {for (const group of groups) {
      const id = group[":@"]?.id;

      if (typeof id !== "string" || !Array.isArray(group.Group))
        {throw new Error("Invalid gameplay resource group");}

      const values = records(group.Group as Element[]);
      groupsById.set(id, values);
    }}

  return { items, groups: groupsById, records: declarations };
}

export function parseRules(xml: string, name: string): Map<string, Rule> {
  if (
    [
      "item",
      "general_sale",
      "pay_servercontrol",
      "function_on",
      "kingdomskill",
      "setting",
      "fb_share",
      "function_star",
    ].includes(name)
  )
    {return parseDeclaredCatalog(xml).items;}

  return indexRules(parseRecords(xml, name), name);
}
