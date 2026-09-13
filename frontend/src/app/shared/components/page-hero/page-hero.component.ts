import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { HeroContent } from '../../../core/models/site.models';

@Component({
  selector: 'app-page-hero',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './page-hero.component.html',
  styleUrl: './page-hero.component.scss'
})
export class PageHeroComponent {
  readonly hero = input.required<HeroContent>();
}
