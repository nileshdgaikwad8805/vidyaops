import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { RuntimeConfigService } from '../services/runtime-config.service';

/**
 * Rewrites same-origin `/api/...` calls onto the configured API base. When no
 * base is configured the request is left relative so the dev proxy and the
 * Express fallback keep working.
 */
export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const runtimeConfig = inject(RuntimeConfigService);

  if (!req.url.startsWith('/api')) {
    return next(req);
  }

  return next(
    runtimeConfig.apiBase
      ? req.clone({ url: runtimeConfig.apiUrl(req.url) })
      : req,
  );
};
