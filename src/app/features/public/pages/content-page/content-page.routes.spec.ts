import {
  CONTENT_PAGE_ROUTES,
  buildContentPageRoutes,
} from './content-page.routes';
import { SiteContentService } from '../../../../core/services/site-content.service';

describe('content page routes', () => {
  const service = new SiteContentService();

  it('should build one route per registered content page', () => {
    expect(buildContentPageRoutes().length).toBe(CONTENT_PAGE_ROUTES.length);
  });

  it('should use unique paths', () => {
    const paths = CONTENT_PAGE_ROUTES.map((page) => page.path);

    expect(new Set(paths).size).toBe(paths.length);
  });

  it('should only reference page keys the content service knows about', () => {
    CONTENT_PAGE_ROUTES.forEach((page) => {
      expect(service.getPage(page.pageKey))
        .withContext(`page key "${page.pageKey}"`)
        .toBeDefined();
    });
  });

  it('should set a non-empty title on every route', () => {
    buildContentPageRoutes().forEach((route) => {
      expect(typeof route.title).toBe('string');
      expect((route.title as string).length).toBeGreaterThan(0);
    });
  });
});
