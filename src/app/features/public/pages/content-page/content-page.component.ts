import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SiteContentService } from '../../../../core/services/site-content.service';
import { ContentPageData } from '../../../../core/models/site.models';
import { PageHeroComponent } from '../../../../shared/components/page-hero/page-hero.component';

@Component({
  selector: 'app-content-page',
  standalone: true,
  imports: [RouterLink, PageHeroComponent],
  templateUrl: './content-page.component.html',
  styleUrl: './content-page.component.scss'
})
export class ContentPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly content = inject(SiteContentService);

  pageData: ContentPageData | undefined;

  ngOnInit(): void {
    const key = this.route.snapshot.data['pageKey'] as string;
    this.pageData = this.content.getPage(key);
  }
}
