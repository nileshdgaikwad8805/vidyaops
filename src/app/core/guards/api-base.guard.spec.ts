import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { apiBaseGuard } from './api-base.guard';
import { routes } from '../../app.routes';

describe('apiBaseGuard', () => {
  afterEach(() => {
    delete window.VIDYAOPS_CONFIG;
  });

  it('should allow API-backed pages when an api base is configured', async () => {
    window.VIDYAOPS_CONFIG = { apiBase: 'https://api.example.com' };
    TestBed.resetTestingModule();

    TestBed.configureTestingModule({
      providers: [provideRouter(routes), provideHttpClient(), provideHttpClientTesting()],
    });

    const harness = await RouterTestingHarness.create('/enroll');
    const router = TestBed.inject(Router);

    expect(router.url).toBe('/enroll');
    expect(harness.routeNativeElement).toBeTruthy();
  });

  it('should redirect to /contact when there is no api base', async () => {
    window.VIDYAOPS_CONFIG = { apiBase: '', runtimeMode: 'static' };
    TestBed.resetTestingModule();

    TestBed.configureTestingModule({
      providers: [provideRouter(routes), provideHttpClient(), provideHttpClientTesting()],
    });

    await RouterTestingHarness.create('/enroll');
    const router = TestBed.inject(Router);

    expect(router.url).toBe('/contact');
  });

  it('should be exported as a standalone guard function', () => {
    expect(typeof apiBaseGuard).toBe('function');
  });
});
