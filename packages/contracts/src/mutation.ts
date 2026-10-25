export interface MutationCommand {
  owner: string;
  requestId: string;
  command: string;
  request: Uint8Array;
}

export interface EconomyPosting {
  account: string;
  asset: string;
  before: bigint;
  after: bigint;
  reason: string;
}

export interface MutationEvent {
  id: string;
  type: string;
  payload: Uint8Array;
}

export interface MutationResult {
  response: Uint8Array;
  postings?: readonly EconomyPosting[];
  events?: readonly MutationEvent[];
}
