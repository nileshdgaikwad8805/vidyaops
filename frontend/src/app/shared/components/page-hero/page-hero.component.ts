import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { HeroContent } from '../../../core/models/site.models';

interface TitleSegment {
  text: string;
  highlight: boolean;
}

@Component({
  selector: 'app-page-hero',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './page-hero.component.html',
  styleUrl: './page-hero.component.scss'
})
export class PageHeroComponent {
  readonly hero = input.required<HeroContent>();

  titleSegments(): TitleSegment[] {
    const hero = this.hero();
    const title = hero?.title ?? '';
    const highlight = hero?.titleHighlight;
    if (!highlight) {
      return [{ text: title, highlight: false }];
    }
    const idx = title.indexOf(highlight);
    if (idx === -1) {
      return [{ text: title, highlight: false }];
    }
    const segments: TitleSegment[] = [];
    if (idx > 0) {
      segments.push({ text: title.slice(0, idx), highlight: false });
    }
    segments.push({ text: highlight, highlight: true });
    const after = title.slice(idx + highlight.length);
    if (after) {
      segments.push({ text: after, highlight: false });
    }
    return segments;
  }
}