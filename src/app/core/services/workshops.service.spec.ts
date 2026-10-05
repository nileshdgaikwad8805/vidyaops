import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { WorkshopsService } from './workshops.service';
import { Workshop } from '../models/site.models';

describe('WorkshopsService', () => {
  let service: WorkshopsService;
  let httpMock: HttpTestingController;

  async function configure(apiBase: string): Promise<void> {
    window.VIDYAOPS_CONFIG = { apiBase, runtimeMode: apiBase ? 'long-running' : 'static' };
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(WorkshopsService);
    httpMock = TestBed.inject(HttpTestingController);
  }

  afterEach(() => {
    httpMock.verify();
    delete window.VIDYAOPS_CONFIG;
  });

  it('should ship bundled fallback workshops', () => {
    expect(service.fallbackWorkshops.length).toBeGreaterThan(0);
    service.fallbackWorkshops.forEach((workshop: Workshop) => {
      expect(workshop.title.length).toBeGreaterThan(0);
      expect(workshop.cta_link.length).toBeGreaterThan(0);
    });
  });

  it('should return the fallback list without calling the API on a static runtime', async () => {
    await configure('');

    const workshops = await service.getWorkshops();

    expect(workshops).toEqual(service.fallbackWorkshops);
    httpMock.expectNone(() => true);
  });

  it('should return API workshops when the list is non-empty', async () => {
    await configure('https://api.example.com');

    const promise = service.getWorkshops();
    httpMock
      .expectOne('https://api.example.com/api/workshops')
      .flush({ workshops: [{ title: 'API Workshop' }] });

    const workshops = await promise;
    expect(workshops.length).toBe(1);
    expect(workshops[0].title).toBe('API Workshop');
  });

  it('should fall back when the API returns an empty list', async () => {
    await configure('https://api.example.com');

    const promise = service.getWorkshops();
    httpMock.expectOne('https://api.example.com/api/workshops').flush({ workshops: [] });

    await expectAsync(promise).toBeResolvedTo(service.fallbackWorkshops);
  });

  it('should fall back when the API request fails', async () => {
    await configure('https://api.example.com');

    const promise = service.getWorkshops();
    httpMock
      .expectOne('https://api.example.com/api/workshops')
      .flush('boom', { status: 500, statusText: 'Server Error' });

    await expectAsync(promise).toBeResolvedTo(service.fallbackWorkshops);
  });
});
