import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { SiteContentService } from '../../../core/services/site-content.service';

@Component({
  selector: 'app-site-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './site-header.component.html',
  styleUrl: './site-header.component.scss'
})
export class SiteHeaderComponent {
  private readonly router = inject(Router);
  private readonly contentService = inject(SiteContentService);

  readonly navLinks = this.contentService.navLinks;
  readonly serviceLinks = this.contentService.serviceLinks;
  readonly navOpen = signal(false);
  readonly servicesOpen = signal(false);
  readonly currentUrl = computed(() => this.router.url);

  toggleNav(): void {
    this.navOpen.update((open) => !open);
  }

  toggleServicesMenu(event?: Event): void {
    if (event) {
      event.preventDefault();
    }

    this.servicesOpen.update((open) => !open);
  }

  closeMenus(): void {
    this.navOpen.set(false);
    this.servicesOpen.set(false);
  }

  isServicesRoute(): boolean {
    return this.currentUrl().startsWith('/services');
  }
}
