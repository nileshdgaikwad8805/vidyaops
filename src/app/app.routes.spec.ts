import { Route } from '@angular/router';

import { routes } from './app.routes';
import { CONTENT_PAGE_ROUTES } from './features/public/pages/content-page/content-page.routes';

const shellRoute = routes[0];
const children = shellRoute.children ?? [];

function paths(): string[] {
  return children.map((child: Route) => child.path ?? '');
}

describe('app routes', () => {
  it('should mount SiteShellComponent at the root', () => {
    expect(routes.length).toBe(1);
    expect(shellRoute.path).toBe('');
    expect(shellRoute.component).toBeDefined();
  });

  it('should register a child route for every content page', () => {
    const registered = paths();

    CONTENT_PAGE_ROUTES.forEach((page) => {
      expect(registered).toContain(page.path);
    });
  });

  it('should give every content page route a pageKey and a title', () => {
    const byPath = new Map(children.map((child: Route) => [child.path, child]));

    CONTENT_PAGE_ROUTES.forEach((page) => {
      const route = byPath.get(page.path);

      expect(route?.data?.['pageKey']).toBe(page.pageKey);
      expect(route?.title).toBe(page.title);
    });
  });

  it('should lazy load the home page with a full path match', () => {
    const home = children[0];

    expect(home.path).toBe('');
    expect(home.pathMatch).toBe('full');
  });

  it('should guard the pages that depend on the API', () => {
    const apiBacked = ['volunteer', 'enroll', 'payment-success', 'learner-dashboard'];
    const byPath = new Map(children.map((child: Route) => [child.path, child]));

    apiBacked.forEach((path) => {
      expect(byPath.get(path)?.canActivate?.length).toBe(1);
    });
  });

  it('should end with a wildcard route for unknown URLs', () => {
    expect(children[children.length - 1].path).toBe('**');
  });
});
