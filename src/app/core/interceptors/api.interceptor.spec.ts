import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { apiInterceptor } from './api.interceptor';

describe('apiInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;

  function configure(apiBase: string): void {
    window.VIDYAOPS_CONFIG = { apiBase };
    TestBed.resetTestingModule();

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([apiInterceptor])),
        provideHttpClientTesting(),
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  }

  afterEach(() => {
    httpMock.verify();
    delete window.VIDYAOPS_CONFIG;
  });

  it('should prefix /api requests with the configured base', () => {
    configure('https://api.example.com');

    http.get('/api/workshops').subscribe();

    const req = httpMock.expectOne('https://api.example.com/api/workshops');
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('should leave the request relative when there is no base', () => {
    configure('');

    http.get('/api/workshops').subscribe();

    const req = httpMock.expectOne('/api/workshops');
    req.flush({});
  });

  it('should not touch non-API requests', () => {
    configure('https://api.example.com');

    http.get('/assets/hero.jpg').subscribe();

    const req = httpMock.expectOne('/assets/hero.jpg');
    req.flush({});
  });
});
