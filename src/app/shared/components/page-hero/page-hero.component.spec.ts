import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageHeroComponent } from './page-hero.component';
import { HeroContent } from '../../../core/models/site.models';

describe('PageHeroComponent', () => {
  let fixture: ComponentFixture<PageHeroComponent>;

  function setHero(hero: HeroContent): void {
    fixture.componentRef.setInput('hero', hero);
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageHeroComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PageHeroComponent);
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should return a single segment when there is no highlight', () => {
    setHero({ eyebrow: 'About', title: 'Who we are', description: 'Team copy' });

    expect(fixture.componentInstance.titleSegments()).toEqual([
      { text: 'Who we are', highlight: false },
    ]);
  });

  it('should split the title around the highlight', () => {
    setHero({
      eyebrow: 'Services',
      title: 'Practical tech training',
      titleHighlight: 'tech training',
      description: 'Copy',
    });

    expect(fixture.componentInstance.titleSegments()).toEqual([
      { text: 'Practical ', highlight: false },
      { text: 'tech training', highlight: true },
    ]);
  });

  it('should fall back to one segment when the highlight is missing from the title', () => {
    setHero({
      eyebrow: 'Services',
      title: 'Practical tech training',
      titleHighlight: 'not present',
      description: 'Copy',
    });

    expect(fixture.componentInstance.titleSegments()).toEqual([
      { text: 'Practical tech training', highlight: false },
    ]);
  });

  it('should not emit an empty leading segment', () => {
    setHero({
      eyebrow: 'Home',
      title: 'Training that ships',
      titleHighlight: 'Training',
      description: 'Copy',
    });

    expect(fixture.componentInstance.titleSegments()[0]).toEqual({
      text: 'Training',
      highlight: true,
    });
  });
});
