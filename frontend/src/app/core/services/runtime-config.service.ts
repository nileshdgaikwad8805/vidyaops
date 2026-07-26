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
    const runtime = window.VIDYAOPS_CONFIG || {};

    return {
      apiBase: String(runtime.apiBase || this.fallbackConfig.apiBase),
      runtimeMode: String(runtime.runtimeMode || this.fallbackConfig.runtimeMode),
      platformTarget: String(runtime.platformTarget || this.fallbackConfig.platformTarget),
    };
  }
}
