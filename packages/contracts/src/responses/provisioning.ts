export interface CharacterResponse {
  gameUid: string;
  kingdomId: number;
  state: "pending" | "ready";
}

export interface ProvisionReceiptResponse {
  gameUid: string;
  kingdomId: number;
  requestHash: string;
}
