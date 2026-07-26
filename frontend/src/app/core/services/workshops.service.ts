import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of } from 'rxjs';
import { firstValueFrom } from 'rxjs';

import { RuntimeConfigService } from './runtime-config.service';
import { Workshop } from '../models/site.models';

@Injectable({
  providedIn: 'root'
})
export class WorkshopsService {
  private readonly http = inject(HttpClient);
  private readonly runtimeConfig = inject(RuntimeConfigService);

  readonly fallbackWorkshops: Workshop[] = [
    {
      title: 'Cloud Basics for College Students',
      type: 'Free Workshop',
      description: 'Introductory session covering cloud concepts, career paths, and practical starting points.',
      schedule_text: 'Coming Soon',
      duration_text: '2 Hours',
      level_text: 'Beginner',
      cta_text: 'Notify Me',
      cta_link: '/contact',
    },
    {
      title: 'Hands-On Data Analysis Sprint',
      type: 'Paid Workshop',
      description: 'Learn practical data workflows, essential tools, and guided exercises that build confidence fast.',
      schedule_text: 'Coming Soon',
      duration_text: '3 Hours',
      level_text: 'Beginner to Intermediate',
      cta_text: 'Notify Me',
      cta_link: '/contact',
    },
    {
      title: 'Introduction to AI Tools and Use Cases',
      type: 'Free Workshop',
      description: 'Explore AI use cases, practical examples, and how students and freshers can start learning responsibly.',
      schedule_text: 'Coming Soon',
      duration_text: '90 Minutes',
      level_text: 'Beginner',
      cta_text: 'Notify Me',
      cta_link: '/contact',
    },
  ];



  async getWorkshops(): Promise<Workshop[]> {
    if (this.runtimeConfig.isStaticRuntime) {
      return this.fallbackWorkshops;
    }

    return firstValueFrom(
      this.http.get<{ workshops?: Workshop[] }>(this.runtimeConfig.apiUrl('/api/workshops')).pipe(
        map((payload) => {
          const workshops = Array.isArray(payload.workshops) ? payload.workshops : [];
          return workshops.length ? workshops : this.fallbackWorkshops;
        }),
        catchError(() => of(this.fallbackWorkshops)),
      ),
    );
  }
}
