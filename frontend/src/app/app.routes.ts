import { Routes } from '@angular/router';
import { SiteShellComponent } from './shared/layouts/site-shell/site-shell.component';

export const routes: Routes = [
  {
    path: '',
    component: SiteShellComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/public/pages/home/home.component').then(m => m.HomeComponent),
      },
      {
        path: 'about',
        loadComponent: () =>
          import('./features/public/pages/content-page/content-page.component').then(m => m.ContentPageComponent),
        data: { pageKey: 'about' },
      },
      {
        path: 'services',
        loadComponent: () =>
          import('./features/public/pages/content-page/content-page.component').then(m => m.ContentPageComponent),
        data: { pageKey: 'services' },
      },
      {
        path: 'certifications',
        loadComponent: () =>
          import('./features/public/pages/content-page/content-page.component').then(m => m.ContentPageComponent),
        data: { pageKey: 'certifications' },
      },
      {
        path: 'software-development',
        loadComponent: () =>
          import('./features/public/pages/content-page/content-page.component').then(m => m.ContentPageComponent),
        data: { pageKey: 'software-development' },
      },
      {
        path: 'digital-learning',
        loadComponent: () =>
          import('./features/public/pages/content-page/content-page.component').then(m => m.ContentPageComponent),
        data: { pageKey: 'digital-learning' },
      },
      {
        path: 'corporate-training',
        loadComponent: () =>
          import('./features/public/pages/content-page/content-page.component').then(m => m.ContentPageComponent),
        data: { pageKey: 'corporate-training' },
      },
      {
        path: 'rd-internship',
        loadComponent: () =>
          import('./features/public/pages/content-page/content-page.component').then(m => m.ContentPageComponent),
        data: { pageKey: 'rd-internship' },
      },
      {
        path: 'collaborations',
        loadComponent: () =>
          import('./features/public/pages/content-page/content-page.component').then(m => m.ContentPageComponent),
        data: { pageKey: 'collaborations' },
      },
      {
        path: 'programs',
        loadComponent: () =>
          import('./features/public/pages/content-page/content-page.component').then(m => m.ContentPageComponent),
        data: { pageKey: 'programs' },
      },
      {
        path: 'faq',
        loadComponent: () =>
          import('./features/public/pages/content-page/content-page.component').then(m => m.ContentPageComponent),
        data: { pageKey: 'faq' },
      },
      {
        path: 'privacy',
        loadComponent: () =>
          import('./features/public/pages/content-page/content-page.component').then(m => m.ContentPageComponent),
        data: { pageKey: 'privacy' },
      },
      {
        path: 'terms',
        loadComponent: () =>
          import('./features/public/pages/content-page/content-page.component').then(m => m.ContentPageComponent),
        data: { pageKey: 'terms' },
      },
      {
        path: 'workshops',
        loadComponent: () =>
          import('./features/public/pages/workshops/workshops.component').then(m => m.WorkshopsComponent),
      },
      {
        path: 'contact',
        loadComponent: () =>
          import('./features/public/pages/contact/contact.component').then(m => m.ContactComponent),
      },
      {
        path: '**',
        loadComponent: () =>
          import('./features/public/pages/not-found/not-found.component').then(m => m.NotFoundComponent),
      },
    ],
  },
];
