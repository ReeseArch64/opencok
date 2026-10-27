import type { Row } from "./rows";
import type { AvatarSystemMail } from "./files";

export interface RegionalRecallState {
  record?: Row;
  country: string;
  members: readonly string[];
}

export interface RegionalRecallWrite {
  record: Row;
  mail?: readonly AvatarSystemMail[];
}
