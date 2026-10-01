import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the brand name', () => {
    fixture.detectChanges();
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';

    expect(text).toContain('VidyaOps');
  });

  it('should start on the first carousel slide', () => {
    expect(fixture.componentInstance.carouselIndex).toBe(0);
  });

  it('should wrap forwards past the last slide', () => {
    const component = fixture.componentInstance;
    const lastIndex = component.heroSlides.length - 1;

    component.carouselGo(lastIndex);
    component.carouselNext();

    expect(component.carouselIndex).toBe(0);
  });

  it('should wrap backwards from the first slide', () => {
    const component = fixture.componentInstance;

    component.carouselPrev();

    expect(component.carouselIndex).toBe(component.heroSlides.length - 1);
  });

  it('should clear the carousel timer on destroy', () => {
    const component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component['timer']).toBeDefined();

    fixture.destroy();

    expect(component['timer']).toBeUndefined();
  });
});
