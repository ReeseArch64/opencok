export interface CosmeticStatusResponse {
  sid: number;
  set: number;
  count?: number;
}

export interface CityCosmeticResponse {
  sid?: number;
  set?: number;
  bubble?: CosmeticStatusResponse;
  overlap?: CosmeticStatusResponse;
}

export interface CityCosmeticUpdateResponse extends CityCosmeticResponse {
  uid: string;
  worldpointid: number;
}
