import { CatalogKind, VariableScope } from "@opencok/enums/catalog-kind";
import type {
  AutomationAction,
  AutomationClause,
  AutomationRule,
  CatalogCodec,
  CatalogDefinition,
  CatalogScalar,
  CatalogSection,
  CatalogValue,
  TileMapDefinition,
  VariableDefinition,
} from "../src/catalog-model.ts";

export type SourceElement = Record<string, unknown> & { ":@"?: Record<string, string> };
const children = (node: SourceElement, tag: string): SourceElement[] => {
  const value = node[tag];
  return Array.isArray(value) ? (value as SourceElement[]) : [];
};
const tagged = (nodes: readonly SourceElement[], tag: string) =>
  nodes.filter((node) => Object.hasOwn(node, tag));
const attributes = (node: SourceElement) => node[":@"] ?? {};
const text = (nodes: readonly SourceElement[]) =>
  nodes.map((node) => (typeof node["#text"] === "string" ? node["#text"] : "")).join("");
const names: Readonly<Record<string, string>> = {
  max_lv: "levelMax",
  maxLv: "levelMax",
  max_level: "levelMax",
  maxLevel: "levelMax",
  lv: "level",
  lv_limit: "levelLimit",
  exp: "experience",
  player_exp: "playerExperience",
  general_exp: "generalExperience",
  gift_exp: "giftExperience",
  level_reward: "levelRewardId",
  res_id: "resourceId",
  num: "quantity",
};
export const fieldName = (key: string) =>
  names[key] ?? key.replace(/[_\-.]([a-zA-Z0-9])/g, (_, letter: string) => letter.toUpperCase());

export function scalar(value: string): CatalogScalar {
  if (/^-?(0|[1-9]\d*)$/.test(value)) {
    const integer = BigInt(value);
    if (String(integer) === value)
      return Number.isSafeInteger(Number(integer)) ? Number(integer) : integer;
  }
  const decimal = Number(value);
  return Number.isFinite(decimal) && String(decimal) === value ? decimal : value;
}

const amounts = new Set([
  "wood",
  "stone",
  "iron",
  "food",
  "silver",
  "gold",
  "price",
  "price_all",
  "price_hot",
  "price_crystal",
]);
function amount(value: CatalogValue): CatalogValue {
  if (Array.isArray(value)) return value.map(amount);
  return typeof value === "number" && Number.isSafeInteger(value) ? BigInt(value) : value;
}

function numericSequence(value: string): boolean {
  return (
    /[|;,:]/.test(value) && value.split(/[|;,:]/).every((part) => typeof scalar(part) !== "string")
  );
}

function decode(value: string, separators: readonly string[]): CatalogValue {
  if (!separators.length) return scalar(value);
  return value.split(separators[0]!).map((part) => decode(part, separators.slice(1)));
}

function table(database: SourceElement[]): { definition: CatalogDefinition; codec: CatalogCodec } {
  const raw: Record<string, string>[] = [];
  const sections: CatalogSection[] = [];
  const collect = (nodes: SourceElement[], parent?: number) => {
    for (const node of nodes) {
      if (Object.hasOwn(node, "Group")) {
        const attrs = attributes(node);
        const index = sections.length;
        const settings = Object.fromEntries(
          Object.entries(attrs)
            .filter(([key]) => key !== "id")
            .map(([key, value]) => [fieldName(key), scalar(value)]),
        );
        const section: CatalogSection = {
          ...(attrs.id === undefined ? {} : { id: scalar(attrs.id) }),
          start: raw.length,
          count: 0,
          ...(parent === undefined ? {} : { parent }),
          ...(Object.keys(settings).length ? { settings } : {}),
        };
        sections.push(section);
        collect(children(node, "Group"), index);
        sections[index] = { ...section, count: raw.length - section.start };
      } else if (
        Object.keys(node).some(
          (key) => key !== ":@" && !key.startsWith("#") && !key.startsWith("?"),
        )
      ) {
        const record = { ...attributes(node) };
        const tag = Object.keys(node).find((key) => key !== ":@")!;
        if (children(node, tag).some((child) => !Object.hasOwn(child, "#text")))
          throw new Error("Nested table record requires a domain model");
        const content = text(children(node, tag));
        if (content.trim()) {
          if (record.content !== undefined) throw new Error("Ambiguous table content");
          record.content = content;
        }
        raw.push(record);
      }
    }
  };
  collect(database);
  const keys = [...new Set(raw.flatMap((record) => Object.keys(record)))];
  const codec: Record<string, { field: string; separators?: string[] }> = {};
  for (const key of keys) {
    const sequences = raw
      .map((record) => record[key])
      .filter((value): value is string => value !== undefined && numericSequence(value));
    const separators = ["|", ";", ",", ":"].filter((separator) =>
      sequences.some((value) => value.includes(separator)),
    );
    const normalized = fieldName(key);
    const field = keys.some((other) => other !== key && fieldName(other) === normalized)
      ? key
      : normalized;
    codec[key] = { field, ...(separators.length ? { separators } : {}) };
  }
  const records = raw.map((record) => {
    const result: Record<string, CatalogValue> = {};
    for (const [key, value] of Object.entries(record)) {
      const descriptor = codec[key]!;
      if (Object.hasOwn(result, descriptor.field))
        throw new Error("Colliding catalog fields: " + key);
      const decoded =
        descriptor.separators && numericSequence(value)
          ? decode(value, descriptor.separators)
          : scalar(value);
      result[descriptor.field] = amounts.has(key) ? amount(decoded) : decoded;
    }
    return result;
  });
  return { definition: { kind: CatalogKind.Table, records, sections }, codec };
}

function tileMap(node: SourceElement): TileMapDefinition {
  const attrs = attributes(node);
  return {
    kind: CatalogKind.TileMap,
    orientation: attrs.orientation!,
    ...(attrs.renderorder === undefined ? {} : { renderOrder: attrs.renderorder }),
    width: Number(attrs.width),
    height: Number(attrs.height),
    tileWidth: Number(attrs.tilewidth),
    tileHeight: Number(attrs.tileheight),
    ...(attrs.nextobjectid === undefined ? {} : { nextObjectId: Number(attrs.nextobjectid) }),
    tilesets: tagged(children(node, "map"), "tileset").map((tileset) => {
      const values = attributes(tileset);
      const content = children(tileset, "tileset");
      const image = attributes(tagged(content, "image")[0]!);
      return {
        firstId: Number(values.firstgid),
        name: values.name!,
        tileWidth: Number(values.tilewidth),
        tileHeight: Number(values.tileheight),
        ...Object.fromEntries(
          [
            ["spacing", "spacing"],
            ["margin", "margin"],
            ["tilecount", "tileCount"],
            ["columns", "columns"],
          ]
            .filter(([key]) => values[key!] !== undefined)
            .map(([key, field]) => [field!, Number(values[key!])]),
        ),
        image: { source: image.source!, width: Number(image.width), height: Number(image.height) },
        terrains: tagged(content, "terraintypes").flatMap((group) =>
          tagged(children(group, "terraintypes"), "terrain").map((terrain) => {
            const data = attributes(terrain);
            return {
              name: data.name!,
              tile: Number(data.tile),
              properties: Object.fromEntries(
                tagged(children(terrain, "terrain"), "properties").flatMap((properties) =>
                  tagged(children(properties, "properties"), "property").map((property) => {
                    const item = attributes(property);
                    return [item.name!, scalar(item.value!)];
                  }),
                ),
              ),
            };
          }),
        ),
        tiles: tagged(content, "tile").map((tile) => {
          const data = attributes(tile);
          return { id: Number(data.id), corners: data.terrain!.split(",").map(Number) };
        }),
      };
    }),
    layers: tagged(children(node, "map"), "layer").map((layer) => {
      const values = attributes(layer);
      return {
        name: values.name!,
        width: Number(values.width),
        height: Number(values.height),
        tiles: tagged(children(layer, "layer"), "data").flatMap((data) =>
          tagged(children(data, "data"), "tile").map((tile) => Number(attributes(tile).gid)),
        ),
      };
    }),
  };
}

function clause(node: SourceElement, tag: string): AutomationClause {
  const attrs = attributes(node);
  const parameters = text(children(node, tag));
  return {
    code: Number(attrs.type),
    ...(attrs.name === undefined ? {} : { name: attrs.name }),
    ...(attrs.group === undefined ? {} : { group: scalar(attrs.group) as number | string }),
    ...(parameters.trim() ? { parameters } : {}),
  };
}
function action(node: SourceElement): AutomationAction {
  const content = children(node, "action");
  const conditional = tagged(content, "if")[0];
  return {
    ...clause(node, "action"),
    ...(conditional
      ? {
          branch: {
            conditions: tagged(children(conditional, "if"), "condition").map((node) =>
              clause(node, "condition"),
            ),
            onMatch: tagged(children(conditional, "if"), "action").map(action),
            otherwise: tagged(content, "else").flatMap((node) =>
              tagged(children(node, "else"), "action").map(action),
            ),
          },
        }
      : {}),
  };
}
function variable(node: SourceElement, scope: VariableScope): VariableDefinition {
  const attrs = attributes(node);
  return {
    scope,
    id: attrs.id!,
    ...(attrs.name === undefined ? {} : { name: attrs.name }),
    ...(attrs.value_type === undefined ? {} : { valueType: attrs.value_type }),
    ...(attrs.default_value === undefined ? {} : { initialValue: scalar(attrs.default_value) }),
    ...(attrs.refresh_type === undefined ? {} : { refreshType: Number(attrs.refresh_type) }),
    ...(attrs.refresh_interval === undefined
      ? {}
      : { refreshInterval: Number(attrs.refresh_interval) }),
  };
}

export function convertCatalog(
  ordered: SourceElement[],
  name: string,
): { definition: CatalogDefinition; codec: CatalogCodec } {
  const map = tagged(ordered, "map")[0];
  if (map) return { definition: tileMap(map), codec: {} };
  const root = tagged(ordered, "database")[0];
  if (!root) throw new Error("Missing catalog root");
  const database = children(root, "database");
  if (["event", "trigger", "trigger-activity", "trigger-exchange", "trigger-var"].includes(name)) {
    const version = tagged(database, "version")[0];
    const rules: AutomationRule[] = database
      .filter((node) => Object.hasOwn(node, "trigger") || Object.hasOwn(node, "event"))
      .map((node) => {
        const tag = Object.hasOwn(node, "trigger") ? "trigger" : "event";
        const attrs = attributes(node);
        const nodes = children(node, tag);
        return {
          id: scalar(attrs.id!) as number | string,
          ...(attrs.name === undefined ? {} : { name: attrs.name }),
          ...(attrs.state === undefined ? {} : { state: Number(attrs.state) }),
          ...(attrs.openType === undefined ? {} : { openType: Number(attrs.openType) }),
          events: tagged(nodes, tag === "event" ? "triggers" : "events").flatMap((group) =>
            tagged(
              children(group, tag === "event" ? "triggers" : "events"),
              tag === "event" ? "trigger" : "event",
            ).map((node) => clause(node, tag === "event" ? "trigger" : "event")),
          ),
          conditions: tagged(nodes, "conditions").flatMap((group) =>
            tagged(children(group, "conditions"), "condition").map((node) =>
              clause(node, "condition"),
            ),
          ),
          actions: tagged(nodes, "actions").flatMap((group) =>
            tagged(children(group, "actions"), "action").map(action),
          ),
        };
      });
    const variables = tagged(database, "vars").flatMap((group) =>
      Object.values(VariableScope).flatMap((scope) =>
        tagged(children(group, "vars"), scope).map((node) => variable(node, scope)),
      ),
    );
    return {
      definition: {
        kind: CatalogKind.Automation,
        ...(version ? { version: text(children(version, "version")) } : {}),
        rules,
        variables,
      },
      codec: {},
    };
  }
  if (name === "variable") {
    const server = tagged(database, "server")[0];
    const attrs = server ? attributes(server) : undefined;
    return {
      definition: {
        kind: CatalogKind.Variables,
        ...(attrs ? { connection: { address: attrs.ip!, port: Number(attrs.port) } } : {}),
        variables: database
          .filter((node) => ["p", "s", "f"].some((tag) => Object.hasOwn(node, tag)))
          .map((node) => {
            const scope = Object.keys(node).find((key) => ["p", "s", "f"].includes(key))!;
            return {
              scope,
              id: attributes(node).id!,
              initialValue: scalar(text(children(node, scope))),
            };
          }),
      },
      codec: {},
    };
  }
  if (name === "web") {
    const flag = attributes(tagged(database, "flag")[0]!);
    return {
      definition: {
        kind: CatalogKind.WebRouting,
        enabled: flag.open === "1",
        ...(flag.key === undefined ? {} : { key: Number(flag.key) }),
        excludedHandlers: tagged(database, "exclude").map((node) =>
          text(children(node, "exclude")),
        ),
      },
      codec: {},
    };
  }
  return table(database);
}
