import { CatalogKind, type VariableScope } from "@opencok/enums/catalog-kind";

export type CatalogScalar = string | number | bigint | boolean;

export type CatalogValue = CatalogScalar | readonly CatalogValue[];

export interface CatalogSection {
  readonly id?: CatalogScalar;
  readonly start: number;
  readonly count: number;
  readonly parent?: number;
  readonly settings?: Readonly<Record<string, CatalogValue>>;
}

export interface CatalogTable<RecordType extends object = object> {
  readonly kind: CatalogKind.Table;
  readonly records: readonly RecordType[];
  readonly sections: readonly CatalogSection[];
  readonly metadata?: Readonly<Record<string, CatalogValue>>;
}

export interface TileImage {
  readonly source: string;
  readonly width: number;
  readonly height: number;
}

export interface TileTerrain {
  readonly name: string;
  readonly tile: number;
  readonly properties: Readonly<Record<string, CatalogScalar>>;
}

export interface TileSet {
  readonly firstId: number;
  readonly name: string;
  readonly tileWidth: number;
  readonly tileHeight: number;
  readonly spacing?: number;
  readonly margin?: number;
  readonly tileCount?: number;
  readonly columns?: number;
  readonly image: TileImage;
  readonly terrains: readonly TileTerrain[];
  readonly tiles: readonly { readonly id: number; readonly corners: readonly number[] }[];
}

export interface TileLayer {
  readonly name: string;
  readonly width: number;
  readonly height: number;
  readonly tiles: readonly number[];
}

export interface TileMapDefinition {
  readonly kind: CatalogKind.TileMap;
  readonly orientation: string;
  readonly formatVersion?: string;
  readonly editorVersion?: string;
  readonly renderOrder?: string;
  readonly width: number;
  readonly height: number;
  readonly tileWidth: number;
  readonly tileHeight: number;
  readonly nextObjectId?: number;
  readonly tilesets: readonly TileSet[];
  readonly layers: readonly TileLayer[];
}

export interface AutomationClause {
  readonly conditions?: readonly AutomationClause[];
  readonly code: number;
  readonly name?: string;
  readonly group?: number | string;
  readonly parameters?: string;
}

export interface AutomationAction extends AutomationClause {
  readonly actions?: readonly AutomationAction[];
  readonly branch?: {
    readonly conditions: readonly AutomationClause[];
    readonly onMatch: readonly AutomationAction[];
    readonly otherwise: readonly AutomationAction[];
  };
}

export interface AutomationRule {
  readonly id: number | string;
  readonly name?: string;
  readonly state?: number;
  readonly openType?: number;
  readonly events: readonly AutomationClause[];
  readonly conditions: readonly AutomationClause[];
  readonly actions: readonly AutomationAction[];
}

export interface VariableDefinition {
  readonly scope: VariableScope;
  readonly id: string;
  readonly name?: string;
  readonly valueType?: string;
  readonly initialValue?: CatalogScalar;
  readonly refreshType?: number;
  readonly refreshInterval?: number;
}

export interface AutomationCatalog {
  readonly kind: CatalogKind.Automation;
  readonly version?: string;
  readonly rules: readonly AutomationRule[];
  readonly variables: readonly VariableDefinition[];
}

export interface VariableCatalog {
  readonly kind: CatalogKind.Variables;
  readonly connection?: { readonly address: string; readonly port: number };
  readonly variables: readonly {
    readonly scope: string;
    readonly id: string;
    readonly initialValue: CatalogScalar;
  }[];
}

export interface WebRoutingCatalog {
  readonly kind: CatalogKind.WebRouting;
  readonly enabled: boolean;
  readonly key?: number;
  readonly excludedHandlers: readonly string[];
}

export type CatalogDefinition =
  | CatalogTable
  | TileMapDefinition
  | AutomationCatalog
  | VariableCatalog
  | WebRoutingCatalog;

export interface CatalogFieldCodec {
  readonly field: string;
  readonly separators?: readonly string[];
}

export type CatalogCodec = Readonly<Record<string, CatalogFieldCodec>>;

export function definitionIndex<T extends { readonly id?: CatalogScalar }>(
  table: CatalogTable<T>,
): Map<string, T> {
  const result = new Map<string, T>();

  for (const record of table.records)
    {if (record.id !== undefined && String(record.id).trim()) {result.set(String(record.id), record);}}

  return result;
}

export function sectionRecords<T extends object>(
  table: CatalogTable<T>,
  id: CatalogScalar,
): readonly T[] {
  const section = table.sections.findLast((section) => section.id === id);

  return section ? table.records.slice(section.start, section.start + section.count) : [];
}

export function mapTile(map: TileMapDefinition, layer: number, x: number, y: number): number {
  const selected = map.layers[layer];

  if (
    !selected ||
    !Number.isInteger(x) ||
    !Number.isInteger(y) ||
    x < 0 ||
    y < 0 ||
    x >= selected.width ||
    y >= selected.height
  )
    {throw new Error("Tile coordinate outside layer");}

  const value = selected.tiles[y * selected.width + x];

  if (value === undefined) {throw new Error("Missing map tile");}

  return value;
}
