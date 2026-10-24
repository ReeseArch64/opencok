import type { Rule } from "@opencok/rules/game";

export type GameplayCatalogElement = Record<string, unknown> & { ":@"?: Rule };

export interface GameplayCatalogDocument {
  readonly ordered: GameplayCatalogElement[];
  readonly unordered: Record<string, unknown>;
}

export function repeatCatalogElements(
  count: number,
  ...elements: GameplayCatalogElement[]
): GameplayCatalogElement[] {
  if (!Number.isSafeInteger(count) || count < 0) throw new Error("Invalid catalog repetition");
  return Array.from({ length: count }, () => elements).flat();
}

function groupedCatalog(elements: GameplayCatalogElement[]): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  let text: string | undefined;
  const arrayField = (name: string) => name === "Group" || name === "ItemSpec";
  for (const element of elements) {
    const name = Object.keys(element).find((key) => key !== ":@");
    if (!name) continue;
    if (name === "#text") {
      text = (text ?? "") + element[name];
      continue;
    }
    const children = element[name];
    if (!Array.isArray(children)) throw new Error("Invalid catalog element");
    const fields = groupedCatalog(children);
    let value: unknown = fields;
    if (element[":@"]) {
      for (const [key, attribute] of Object.entries(element[":@"]!))
        fields[key] = arrayField(key) ? [attribute] : attribute;
    } else if (Object.keys(fields).length === 0) value = "";
    else if (Object.keys(fields).length === 1 && fields["#text"] !== undefined)
      value = fields["#text"];
    if (Object.hasOwn(result, name)) {
      const previous = result[name];
      if (Array.isArray(previous)) previous.push(value);
      else result[name] = [previous, value];
    } else result[name] = arrayField(name) ? [value] : value;
  }
  if (text !== undefined && text.length > 0) result["#text"] = text;
  return result;
}

export function createGameplayCatalog(ordered: GameplayCatalogElement[]): GameplayCatalogDocument {
  return { ordered, unordered: groupedCatalog(ordered) };
}

export function catalogTiles(gids: readonly number[], separator: string): GameplayCatalogElement[] {
  return gids.flatMap((gid) => [{ "#text": separator }, { tile: [], ":@": { gid: String(gid) } }]);
}
