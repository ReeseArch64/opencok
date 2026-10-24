export class WorldFavoritesDto {
  readonly favo!: {
    readonly name?: string;
    readonly point?: number;
    readonly type?: number;
    readonly server?: number;
    readonly resType?: number;
    readonly cityType?: number;
    readonly serverType?: number;
    readonly createTime?: bigint;
  }[];
}
