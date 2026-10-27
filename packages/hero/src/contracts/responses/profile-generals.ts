export interface GeneralInfoResponse {
  readonly uuid: string;
  readonly generalId: string;
  readonly level: number;
  readonly status: number;
  readonly att: number;
  readonly defence: number;
  readonly ability: { readonly [key: string]: null | string | number }[];
  readonly skill: {
    readonly uuid: string;
    readonly ownerId: string;
    readonly skillId: string;
    readonly startTime: bigint;
    readonly endTime: bigint;
    readonly actTime: bigint;
    readonly stat: number;
    readonly param1: number;
    readonly param2: number;
  }[];
}

export interface PublicGeneralsResponse {
  readonly skillPoint: number;
  readonly userGenerals: GeneralInfoResponse[];
}
