import { createHash } from "node:crypto";
import { XMLValidator } from "fast-xml-parser";
import type { WorldTerrain } from "@opencok/contracts/world-terrain";

function integer(raw: string | undefined, maximum = 2147483647) {
  if (!raw || !/^\d+$/.test(raw)) throw new Error("Invalid terrain integer");
  const value = Number(raw);
  if (!Number.isSafeInteger(value) || value > maximum) throw new Error("Invalid terrain bound");
  return value;
}

export function parseWorldTerrain(raw: Uint8Array): WorldTerrain {
  if (!raw.length || raw.length > 128 * 1024 * 1024) throw new Error("Invalid terrain size");
  const xml = new TextDecoder("utf-8", { fatal: true }).decode(raw);
  if (
    /<!|&|<\?(?!xml\s)/i.test(xml) ||
    XMLValidator.validate(xml, { allowBooleanAttributes: false }) !== true
  )
    throw new Error("Invalid terrain XML");
  const stack: string[] = [],
    properties: (number | undefined)[][] = [[], []],
    tiles: Map<number, number | undefined>[] = [new Map(), new Map()];
  let size = 0,
    grid = new Uint8Array(),
    overlay = new Uint8Array(),
    set = -1,
    layer = -1,
    cursor = 0,
    terrainType: number | undefined,
    terrainProperties = false;
  for (const match of xml.matchAll(/<([^<>]+)>/g)) {
    const token = match[1]!;
    if (token.length > 65536) throw new Error("Oversized terrain token");
    if (token.startsWith("?")) continue;
    if (token.startsWith("/")) {
      const tag = token.slice(1).trim();
      if (tag === "terrain" && terrainProperties) properties[set]!.push(terrainType);
      if (tag === "layer" && cursor !== size * size) throw new Error("Incomplete terrain layer");
      stack.pop();
      continue;
    }
    const tag = /^[A-Za-z][\w-]*/.exec(token)?.[0];
    if (!tag || stack.length > 16) throw new Error("Invalid terrain nesting");
    const attributes: Record<string, string> = Object.create(null);
    for (const attribute of token.matchAll(/([A-Za-z_][\w:.-]*)\s*=\s*(?:"([^"]*)"|'([^']*)')/g))
      attributes[attribute[1]!] = attribute[2] ?? attribute[3]!;
    const parent = stack.at(-1);
    if (tag === "map") {
      if (size || parent) throw new Error("Duplicate terrain map");
      size = integer(attributes.width, 4000);
      if (size < 2 || integer(attributes.height) !== size || attributes.orientation !== "isometric")
        throw new Error("Unsupported terrain dimensions");
      grid = new Uint8Array(size * size);
      overlay = new Uint8Array(size * size);
    } else if (!size) throw new Error("Missing terrain map");
    else if (tag === "tileset") {
      if (parent !== "map" || ++set > 1 || attributes.source || layer !== -1)
        throw new Error("Unsupported terrain tileset");
      if (integer(attributes.firstgid) !== (set === 0 ? 1 : 99))
        throw new Error("Unsupported terrain tileset offset");
    } else if (tag === "terrain") {
      if (parent !== "terraintypes" || set < 0) throw new Error("Invalid terrain declaration");
      terrainProperties = false;
      terrainType = set === 0 ? undefined : 0;
    } else if (tag === "properties" && parent === "terrain") terrainProperties = true;
    else if (tag === "property" && stack.includes("terrain")) {
      if (attributes.name === "type") {
        if (set === 0) {
          terrainType = ["NEUTRALLY", "STOP", "SPACE"].indexOf(attributes.value!.toUpperCase());
          if (terrainType < 0) throw new Error("Unknown terrain type");
        } else if (attributes.value === "stop") terrainType = 1;
      } else if (attributes.name === "country") integer(attributes.value);
    } else if (tag === "layer") {
      if (parent !== "map" || set !== 1 || ++layer > 1)
        throw new Error("Unsupported terrain layer");
      if (integer(attributes.width) !== size || integer(attributes.height) !== size)
        throw new Error("Terrain layer dimensions mismatch");
      cursor = 0;
    } else if (tag === "data") {
      if (parent !== "layer" || attributes.encoding || attributes.compression)
        throw new Error("Unsupported terrain encoding");
    } else if (tag === "tile" && parent === "tileset") {
      const terrain = attributes.terrain;
      if (terrain?.trim()) {
        const id = integer(attributes.id),
          index = integer(terrain.split(",").filter(Boolean)[0]);
        if (index >= properties[set]!.length) throw new Error("Unknown tile terrain");
        tiles[set]!.set(id, properties[set]![index]);
      }
    } else if (tag === "tile" && parent === "data") {
      if (cursor >= size * size) throw new Error("Terrain layer exceeds dimensions");
      const id = integer(attributes.gid) - (layer === 0 ? 1 : 99),
        value = layer === 1 && id < 0 ? 0 : tiles[layer]!.get(id);
      if (value === undefined) throw new Error("Unknown terrain tile");
      (layer === 0 ? grid : overlay)[cursor++] = value;
    }
    if (!token.endsWith("/")) stack.push(tag);
    else if (tag === "terrain" && terrainProperties) properties[set]!.push(terrainType);
  }
  if (layer !== 1 || cursor !== size * size || stack.length)
    throw new Error("Incomplete terrain document");
  return {
    format: "worldcreator-v2.normal.v1",
    size,
    sourceHash: createHash("sha256").update(raw).digest("hex"),
    grid,
    overlay,
  };
}
