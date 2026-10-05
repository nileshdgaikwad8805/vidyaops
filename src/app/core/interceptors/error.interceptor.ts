import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { NotificationService } from '../services/notification.service';

/**
 * Surfaces API failures as a toast and normalises the error body so callers get a
 * predictable `message` field instead of having to unwrap Express responses.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notifications = inject(NotificationService);

  return next(req).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse) {
        const message =
          typeof error.error?.message === 'string'
            ? error.error.message
            : defaultMessageFor(error.status);

        notifications.show(message, 'error');

        return throwError(() => new Error(message));
      }

      return throwError(() => error);
    }),
  );
};

function defaultMessageFor(status: number): string {
  if (status === 0) {
    return 'Could not reach the server. Please check your connection and try again.';
  }

  if (status === 429) {
    return 'Too many requests. Please wait a moment and try again.';
  }

  if (status >= 500) {
    return 'Something went wrong on our side. Please try again shortly.';
  }

  return 'The request could not be completed. Please try again.';
}
