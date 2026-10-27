import type { GeneralInfoResponse } from "@opencok/hero/contracts/responses/profile-generals";

export interface ReconnectGeneralsResponse {
  readonly userGenerals: (GeneralInfoResponse & { readonly abilityIndex: number })[];
}
