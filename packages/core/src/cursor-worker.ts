import { PollingWorker } from "./polling-worker.ts";

export abstract class CursorWorker<Key extends object> extends PollingWorker {
  private cursor: Key | undefined;

  protected abstract next(cursor?: Key): Promise<Key | undefined>;

  protected abstract deliver(entry: Key): Promise<void>;

  protected async execute(): Promise<void> {
    const entry = await this.next(this.cursor);
    this.cursor = entry ? Object.freeze({ ...entry }) : undefined;

    if (entry && !this.isStopped()) {await this.deliver(entry);}
  }
}
