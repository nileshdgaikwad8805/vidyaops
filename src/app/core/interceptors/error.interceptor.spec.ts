import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { errorInterceptor } from './error.interceptor';
import { NotificationService } from '../services/notification.service';

describe('errorInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let notifications: NotificationService;

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    notifications = TestBed.inject(NotificationService);
    notifications.clear();
  });

  afterEach(() => {
    httpMock.verify();
    notifications.clear();
  });

  it('should surface the server message and rethrow a normalised Error', (done) => {
    http.get('/api/boom').subscribe({
      error: (error: Error) => {
        expect(error.message).toBe('Workshop not found');
        expect(notifications.notifications()[0].message).toBe('Workshop not found');
        done();
      },
    });

    httpMock
      .expectOne('/api/boom')
      .flush({ message: 'Workshop not found' }, { status: 404, statusText: 'Not Found' });
  });

  it('should fall back to a friendly message when the body has none', (done) => {
    http.get('/api/boom').subscribe({
      error: (error: Error) => {
        expect(error.message).toContain('Too many requests');
        done();
      },
    });

    httpMock.expectOne('/api/boom').flush({}, { status: 429, statusText: 'Too Many Requests' });
  });

  it('should report an unreachable server for status 0', (done) => {
    http.get('/api/boom').subscribe({
      error: (error: Error) => {
        expect(error.message).toContain('Could not reach the server');
        done();
      },
    });

    httpMock
      .expectOne('/api/boom')
      .error(new ProgressEvent('error'), { status: 0, statusText: 'Unknown Error' });
  });

  it('should not notify on a successful request', () => {
    http.get('/api/ok').subscribe();

    httpMock.expectOne('/api/ok').flush({ ok: true });

    expect(notifications.notifications()).toEqual([]);
  });
});
