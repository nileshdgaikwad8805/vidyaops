import { Routes } from '@angular/router';

import { apiBaseGuard } from './core/guards/api-base.guard';
import { SiteShellComponent } from './shared/layouts/site-shell/site-shell.component';
import { buildContentPageRoutes } from './features/public/pages/content-page/content-page.routes';

export const routes: Routes = [
  {
    path: '',
    component: SiteShellComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        title: 'Practical Tech Training',
        loadComponent: () =>
          import('./features/public/pages/home/home.component').then((m) => m.HomeComponent),
      },
      ...buildContentPageRoutes(),
      {
        path: 'workshops',
        title: 'Workshops',
        loadComponent: () =>
          import('./features/public/pages/workshops/workshops.component').then((m) => m.WorkshopsComponent),
      },
      {
        path: 'contact',
        title: 'Contact',
        loadComponent: () =>
          import('./features/public/pages/contact/contact.component').then((m) => m.ContactComponent),
      },
      {
        path: 'volunteer',
        title: 'Volunteer',
        canActivate: [apiBaseGuard],
        loadComponent: () =>
          import('./features/public/pages/volunteer/volunteer.component').then((m) => m.VolunteerComponent),
      },
      {
        path: 'enroll',
        title: 'Enroll',
        canActivate: [apiBaseGuard],
        loadComponent: () =>
          import('./features/public/pages/enroll/enroll.component').then((m) => m.EnrollComponent),
      },
      {
        path: 'payment-success',
        title: 'Payment received',
        canActivate: [apiBaseGuard],
        loadComponent: () =>
          import('./features/public/pages/payment-success/payment-success.component').then(
            (m) => m.PaymentSuccessComponent,
          ),
      },
      {
        path: 'learner-dashboard',
        title: 'Learner dashboard',
        canActivate: [apiBaseGuard],
        loadComponent: () =>
          import('./features/public/pages/learner-dashboard/learner-dashboard.component').then(
            (m) => m.LearnerDashboardComponent,
          ),
      },
      {
        path: '**',
        title: 'Page not found',
        loadComponent: () =>
          import('./features/public/pages/not-found/not-found.component').then((m) => m.NotFoundComponent),
      },
    ],
  },
];
