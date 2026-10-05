import { Injectable, signal } from '@angular/core';

import { RuntimeConfig } from '../models/site.models';

declare global {
  interface Window {
    VIDYAOPS_CONFIG?: Partial<RuntimeConfig>;
  }
}

@Injectable({
  providedIn: 'root'
})
export class RuntimeConfigService {
  private readonly fallbackConfig: RuntimeConfig = {
    apiBase: 'https://vidyaops.onrender.com',
    runtimeMode: 'static',
    platformTarget: 'angular',
  };

  readonly config = signal<RuntimeConfig>(this.resolveConfig());



  get apiBase(): string {
    return this.config().apiBase.replace(/\/$/, '');
  }

  get isStaticRuntime(): boolean {
    const config = this.config();
    return config.runtimeMode === 'static' && !config.apiBase;
  }

  apiUrl(pathname: string): string {
    const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
    return this.apiBase ? `${this.apiBase}${normalizedPath}` : normalizedPath;
  }

  private resolveConfig(): RuntimeConfig {
    const runtime = window.VIDYAOPS_CONFIG ?? {};

    // An explicitly configured empty apiBase means "same origin", so only fall
    // back when the key is genuinely absent rather than falsy.
    return {
      apiBase: this.pickString(runtime.apiBase, this.fallbackConfig.apiBase),
      runtimeMode: this.pickString(runtime.runtimeMode, this.fallbackConfig.runtimeMode),
      platformTarget: this.pickString(runtime.platformTarget, this.fallbackConfig.platformTarget),
    };
  }

  private pickString(value: string | undefined, fallback: string): string {
    return typeof value === 'string' ? value : fallback;
  }
}
