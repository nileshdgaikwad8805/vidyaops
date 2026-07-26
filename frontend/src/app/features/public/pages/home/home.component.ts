import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SiteContentService } from '../../../../core/services/site-content.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  private readonly content = inject(SiteContentService);

  readonly stats = this.content.homeStats;
  readonly services = this.content.serviceCards;
  readonly caseStudies = this.content.caseStudies;
  readonly whyUs = this.content.whyVidyaOps;
  readonly testimonials = this.content.testimonials;
  readonly csr = this.content.csrCards;
  readonly partners = this.content.partners;
  readonly cta = this.content.footerCta;
}
