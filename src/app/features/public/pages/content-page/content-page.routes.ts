import { Route } from '@angular/router';

/**
 * Every content-driven page (hero + sections + CTA rendered from the CMS).
 * Keeping them in one typed list means the route table, the tests and the
 * sitemap can all be generated from a single source of truth.
 */
export interface ContentPageRoute {
  /** URL segment, e.g. `about`. */
  readonly path: string;
  /** Key looked up in `SiteContentService.getPage()`. */
  readonly pageKey: string;
  /** Document title used by VidyaOpsTitleStrategy. */
  readonly title: string;
  /** Set when the page needs the VidyaOps API to function. */
  readonly requiresApi?: boolean;
}

export const CONTENT_PAGE_ROUTES: readonly ContentPageRoute[] = [
  { path: 'about', pageKey: 'about', title: 'About' },
  { path: 'services', pageKey: 'services', title: 'Services' },
  { path: 'certifications', pageKey: 'certifications', title: 'IT Training & Certifications' },
  { path: 'software-development', pageKey: 'software-development', title: 'Software Development' },
  { path: 'digital-learning', pageKey: 'digital-learning', title: 'Digital Learning' },
  { path: 'corporate-training', pageKey: 'corporate-training', title: 'Corporate Training' },
  { path: 'rd-internship', pageKey: 'rd-internship', title: 'R&D Internship' },
  { path: 'collaborations', pageKey: 'collaborations', title: 'Collaborations' },
  { path: 'programs', pageKey: 'programs', title: 'Programs' },
  { path: 'faq', pageKey: 'faq', title: 'FAQ' },
  { path: 'privacy', pageKey: 'privacy', title: 'Privacy Policy' },
  { path: 'terms', pageKey: 'terms', title: 'Terms of Service' },
] as const;

export function buildContentPageRoutes(): Route[] {
  return CONTENT_PAGE_ROUTES.map((page) => ({
    path: page.path,
    title: page.title,
    loadComponent: () =>
      import('./content-page.component').then((m) => m.ContentPageComponent),
    data: { pageKey: page.pageKey, requiresApi: page.requiresApi ?? false },
  }));
}
