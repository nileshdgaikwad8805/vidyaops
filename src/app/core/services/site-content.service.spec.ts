import { TestBed } from '@angular/core/testing';

import { SiteContentService } from './site-content.service';
import { CONTENT_PAGE_ROUTES } from '../../features/public/pages/content-page/content-page.routes';

describe('SiteContentService', () => {
  let service: SiteContentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SiteContentService);
  });

  it('should expose the primary nav links', () => {
    expect(service.navLinks.length).toBeGreaterThan(0);
    service.navLinks.forEach((link) => {
      expect(link.path.startsWith('/')).toBeTrue();
    });
  });

  it('should expose the service links', () => {
    expect(service.serviceLinks.length).toBeGreaterThan(0);
  });

  it('should have a matching page for every content route', () => {
    CONTENT_PAGE_ROUTES.forEach((route) => {
      const page = service.getPage(route.pageKey);

      expect(page).withContext(route.pageKey).toBeDefined();
      expect(page?.hero.title.length).toBeGreaterThan(0);
      expect(page?.sections.length).toBeGreaterThan(0);
    });
  });

  it('should return undefined for an unknown page key', () => {
    expect(service.getPage('nope')).toBeUndefined();
  });

  it('should give every content-driven nav link a page key that resolves', () => {
    // Home, workshops and contact have dedicated components, so only the
    // content-driven entries are expected to resolve through getPage().
    const contentPages = new Set(CONTENT_PAGE_ROUTES.map((route) => route.pageKey));
    const driven = service.navLinks.filter((link) => contentPages.has(link.pageKey));

    expect(driven.length).toBeGreaterThan(0);
    driven.forEach((link) => {
      expect(service.getPage(link.pageKey))
        .withContext(`${link.label} -> ${link.pageKey}`)
        .toBeDefined();
    });
  });

  it('should give every service link a page key that resolves', () => {
    service.serviceLinks.forEach((link) => {
      expect(service.getPage(link.pageKey))
        .withContext(`${link.label} -> ${link.pageKey}`)
        .toBeDefined();
    });
  });
});
