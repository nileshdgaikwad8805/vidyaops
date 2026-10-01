import { Injectable, signal } from '@angular/core';

export type NotificationTone = 'success' | 'error' | 'info';

export interface AppNotification {
  id: number;
  message: string;
  tone: NotificationTone;
}

const AUTO_DISMISS_MS = 5000;

/**
 * Tiny signal-backed toast queue rendered by the shared `<app-toast-host>`.
 * Kept in core because the HTTP error interceptor needs it too.
 */
@Injectable({ providedIn: 'root' })
export class NotificationService {
  private nextId = 0;
  private readonly timers = new Map<number, ReturnType<typeof setTimeout>>();

  readonly notifications = signal<readonly AppNotification[]>([]);

  show(message: string, tone: NotificationTone = 'info'): void {
    const id = ++this.nextId;

    this.notifications.update((current) => [...current, { id, message, tone }]);

    this.timers.set(
      id,
      setTimeout(() => this.dismiss(id), AUTO_DISMISS_MS),
    );
  }

  dismiss(id: number): void {
    const timer = this.timers.get(id);

    if (timer) {
      clearTimeout(timer);
      this.timers.delete(id);
    }

    this.notifications.update((current) => current.filter((item) => item.id !== id));
  }

  clear(): void {
    this.timers.forEach((timer) => clearTimeout(timer));
    this.timers.clear();
    this.notifications.set([]);
  }
}
