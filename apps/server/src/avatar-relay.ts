import type { AvatarDeliveryKey } from "@opencok/contracts/files";
import type { AvatarVersionKey } from "@opencok/contracts/avatar-version";
import { CursorWorker } from "@opencok/core/cursor-worker";
import type { Schedule } from "@opencok/core/schedule";
import { AvatarVersionRelay } from "./avatar-version-relay.ts";

export class AvatarRelay extends CursorWorker<AvatarDeliveryKey> {
  public constructor(
    protected readonly next: (cursor?: AvatarDeliveryKey) => Promise<AvatarDeliveryKey | undefined>,
    private readonly publish: (owner: string, sequence: number) => Promise<void>,
    reportFailure: () => void,
    after?: Schedule,
  ) {
    super(reportFailure, after);
    this.start();
  }

  protected deliver(entry: AvatarDeliveryKey): Promise<void> {
    return this.publish(entry.owner, entry.sequence);
  }
}

export function startAvatarRelay(
  next: (cursor?: AvatarDeliveryKey) => Promise<AvatarDeliveryKey | undefined>,
  deliver: (owner: string, sequence: number) => Promise<void>,
  reportFailure: () => void,
  after?: Schedule,
): AvatarRelay {
  return new AvatarRelay(next, deliver, reportFailure, after);
}

export function startAvatarVersionRelay(
  next: (cursor?: AvatarVersionKey) => Promise<AvatarVersionKey | undefined>,
  deliver: (owner: string, operationId: string) => Promise<void>,
  reportFailure: () => void,
  after?: Schedule,
): AvatarVersionRelay {
  return new AvatarVersionRelay(next, deliver, reportFailure, after);
}
