import type { Schedule } from "./schedule.ts";
import { TimeoutScheduler } from "./timeout-scheduler.ts";
import { observeJob } from "./operation.ts";

export abstract class PollingWorker {
  private stopped = false;
  private cancel: (() => void) | undefined;
  private active: Promise<void> = Promise.resolve();

  protected constructor(
    private readonly reportFailure: () => void,
    private readonly after: Schedule = new TimeoutScheduler().schedule,
  ) {}

  protected abstract execute(): Promise<unknown>;

  protected start(): void {
    this.active = this.run();
  }

  protected isStopped(): boolean {
    return this.stopped;
  }

  public async close(): Promise<void> {
    this.stopped = true;
    this.cancel?.();
    this.cancel = undefined;
    await this.active;
  }

  private async run(): Promise<void> {
    try {
      await observeJob(`worker.${this.constructor.name}`, () => this.execute());
    } catch {
      try {
        this.reportFailure();
      } catch {}
    }

    if (!this.stopped)
      {this.cancel = this.after(() => {
        this.cancel = undefined;
        this.active = this.run();
      }, 5000);}
  }
}
