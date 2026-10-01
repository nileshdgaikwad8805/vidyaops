import { TestBed } from '@angular/core/testing';

import { RuntimeConfigService } from './runtime-config.service';

describe('RuntimeConfigService', () => {
  afterEach(() => {
    delete window.VIDYAOPS_CONFIG;
  });

  it('should fall back to defaults when no runtime config is present', () => {
    delete window.VIDYAOPS_CONFIG;
    TestBed.resetTestingModule();

    const service = TestBed.inject(RuntimeConfigService);
    expect(service.config().apiBase).toBe('https://vidyaops.onrender.com');
  });

  it('should use window.VIDYAOPS_CONFIG when it is present', () => {
    window.VIDYAOPS_CONFIG = {
      apiBase: 'https://api.example.com/',
      runtimeMode: 'static',
      platformTarget: 'netlify',
    };
    TestBed.resetTestingModule();

    const service = TestBed.inject(RuntimeConfigService);
    expect(service.apiBase).toBe('https://api.example.com');
    expect(service.config().platformTarget).toBe('netlify');
  });

  it('should build absolute URLs when an api base is set', () => {
    window.VIDYAOPS_CONFIG = { apiBase: 'https://api.example.com' };
    TestBed.resetTestingModule();

    const service = TestBed.inject(RuntimeConfigService);
    expect(service.apiUrl('/api/workshops')).toBe('https://api.example.com/api/workshops');
  });

  it('should keep URLs relative when there is no api base', () => {
    window.VIDYAOPS_CONFIG = { apiBase: '', runtimeMode: 'static' };
    TestBed.resetTestingModule();

    const service = TestBed.inject(RuntimeConfigService);
    expect(service.apiUrl('api/workshops')).toBe('/api/workshops');
    expect(service.isStaticRuntime).toBeTrue();
  });
});
