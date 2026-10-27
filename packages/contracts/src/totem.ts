import type { Row } from "./rows";
import type { AvatarSystemMail } from "./files";
export interface PinnedTotemConfiguration {
  width: number;
  range: number;
  friendlyStateId: number;
  enemyStateId: number;
  takeEffectMail: { sender: string; title: string; message: string };
}
export interface TotemProgressionState {
  history: readonly Row[];
  active: readonly Row[];
}
export interface TotemProgressionWrite {
  history?: readonly Row[];
  activations?: readonly Row[];
}
export interface TotemDelivery {
  activation: Row;
  stateId: number;
}
export interface TotemEffectStore {
  due(): Promise<readonly { activation: Row; cities: readonly Row[] }[]>;
  expire(
    activation: Row,
    deliveries: readonly { owner: string; stateId: number }[],
    points: readonly number[],
  ): Promise<void>;
  pending(): Promise<readonly TotemDelivery[]>;
  states(): Promise<readonly Row[]>;
  apply(
    delivery: TotemDelivery,
    states: readonly Row[],
    deleted: readonly number[],
    mail: AvatarSystemMail,
    push: Uint8Array,
  ): Promise<void>;
}
