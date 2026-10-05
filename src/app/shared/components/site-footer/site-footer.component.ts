import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SiteContentService } from '../../../core/services/site-content.service';

@Component({
  selector: 'app-site-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './site-footer.component.html',
  styleUrl: './site-footer.component.scss'
})
export class SiteFooterComponent {
  private readonly contentService = inject(SiteContentService);

  readonly serviceLinks = this.contentService.serviceLinks.slice(1);
}
