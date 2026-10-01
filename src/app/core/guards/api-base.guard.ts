import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { RuntimeConfigService } from '../services/runtime-config.service';

/**
 * Guards the pages that are backed by the VidyaOps API. On a purely static
 * deploy with no API base configured there is nothing to talk to, so we send the
 * visitor to Contact instead of rendering a form that cannot submit.
 */
export const apiBaseGuard: CanActivateFn = () => {
  const runtimeConfig = inject(RuntimeConfigService);
  const router = inject(Router);

  return runtimeConfig.apiBase ? true : router.createUrlTree(['/contact']);
};
