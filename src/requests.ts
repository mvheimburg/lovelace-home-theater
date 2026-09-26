import type { HassEntity } from "./types";
export type Confirm = (states: Record<string, HassEntity>) => boolean;
/** For presses with no observable state, such as a remote key: done once HA accepts the call. */
export const accepted: Confirm = () => true;
interface Request {
  key: string;
  confirm: Confirm;
  sent: boolean;
  confirmed: boolean;
  timer: ReturnType<typeof setTimeout>;
}
/** Tracks acknowledgements only. HA owns device state; no state is synthesized here. */
export class Requests {
  private active = new Set<Request>();
  error: "failed" | "timeout" | undefined;
  errorDetail: string | undefined;
  constructor(
    private changed: () => void,
    private timeoutMs = 15000,
  ) {}
  pending(key?: string): boolean {
    return [...this.active].some((r) => key === undefined || r.key === key);
  }
  /** Sends `steps` in order; the request ends when HA confirms it or it times out. */
  start(key: string, confirm: Confirm, steps: Array<() => Promise<unknown>>): boolean {
    if (this.pending(key)) return false;
    this.error = undefined;
    this.errorDetail = undefined;
    const request: Request = {
      key,
      confirm,
      sent: false,
      confirmed: false,
      timer: setTimeout(() => {
        if (!this.active.has(request)) return;
        this.error = "timeout";
        this.finish(request);
      }, this.timeoutMs),
    };
    this.active.add(request);
    this.changed();
    const failed = (error: unknown) => {
      if (!this.active.has(request)) return;
      this.error = "failed";
      this.errorDetail =
        error instanceof Error
          ? error.message
          : typeof error === "object" && error !== null && "message" in error
            ? String(error.message)
            : typeof error === "string"
              ? error
              : undefined;
      this.finish(request);
    };
    (async () => {
      for (const step of steps) await step();
    })().then(() => {
      if (!this.active.has(request)) return;
      request.sent = true;
      if (request.confirmed || confirm === accepted) this.finish(request);
    }, failed);
    return true;
  }
  reconcile(states: Record<string, HassEntity>): void {
    for (const request of this.active) {
      request.confirmed = request.confirm(states);
      if (request.sent && request.confirmed) this.finish(request);
    }
  }
  private finish(request: Request): void {
    clearTimeout(request.timer);
    this.active.delete(request);
    this.changed();
  }
  reset(): void {
    for (const r of this.active) clearTimeout(r.timer);
    this.active.clear();
    this.error = undefined;
    this.errorDetail = undefined;
    this.changed();
  }
}
