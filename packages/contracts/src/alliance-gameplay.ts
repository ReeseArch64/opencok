import type { Row } from "./rows";
import type { InventoryPlan, InventoryState } from "./inventory";
import type { MutationCommand } from "./mutation";

export interface AllianceSelection {
  allianceId?: string;
  playerId?: string;
  mailId?: string;
  helpId?: string;
  giftEvent?: string;
  key?: string;
  searchPlayers?: boolean;
  language?: string;
  pageSize?: number;
  page?: number;
}

export interface AllianceState {
  now: bigint;
  inventory: InventoryState;
  selection: AllianceSelection;
  profiles: readonly Row[];
  alliances: readonly Row[];
  members: readonly Row[];
  applications: readonly Row[];
  lords: readonly Row[];
  cities: readonly Row[];
  points: readonly Row[];
  powers: readonly Row[];
  marches: readonly Row[];
  sciences: readonly Row[];
  research: readonly Row[];
  donations: readonly Row[];
  history: readonly Row[];
  helps: readonly Row[];
  queues: readonly Row[];
  activities: readonly Row[];
  gifts: readonly Row[];
  blacklist: readonly Row[];
  directory: readonly Row[];
  candidates: readonly Row[];
  directoryTotal: bigint;
  sharedGifts: readonly Row[];
  mails: readonly Row[];
}

export interface AllianceWrite {
  actions?: readonly {
    uid: string;
    kind: "alliance.join" | "alliance.donate" | "alliance.help";
    count: number;
  }[];
  alliances?: readonly Row[];
  deletedAlliances?: readonly string[];
  members?: readonly Row[];
  removedMembers?: readonly string[];
  memberships?: readonly { uid: string; allianceId: string }[];
  applications?: readonly Row[];
  deletedApplications?: readonly string[];
  firstJoin?: readonly string[];
  sciences?: readonly Row[];
  research?: readonly Row[];
  deletedResearch?: readonly string[];
  donations?: readonly Row[];
  history?: readonly Row[];
  helps?: readonly Row[];
  queues?: readonly Row[];
  activities?: readonly Row[];
  gifts?: readonly Row[];
  sharedGifts?: readonly Row[];
  publishedGift?: Row;
  deletedGifts?: readonly string[];
  blacklist?: readonly Row[];
  mails?: readonly Row[];
  mailUpdates?: readonly Row[];
}

export interface AlliancePlan {
  inventory: InventoryPlan;
  write: AllianceWrite;
  productionAt?: bigint;
  productionOwners?: readonly string[];
}

export interface AllianceRepository {
  execute(
    input: MutationCommand,
    selection: AllianceSelection,
    plan: (state: AllianceState) => Promise<AlliancePlan>,
  ): Promise<Buffer>;
}

export interface AlliancePublicationSnapshot {
  profiles: readonly Row[];
  record?: Row;
  members: readonly Row[];
  queues: readonly Row[];
  helps: readonly Row[];
  sciences: readonly Row[];
  research: readonly Row[];
}
