import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { SiteFooterComponent } from './site-footer.component';

describe('SiteFooterComponent', () => {
  let fixture: ComponentFixture<SiteFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SiteFooterComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(SiteFooterComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the brand', () => {
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';

    expect(text).toContain('VidyaOps');
  });

  it('should drop the duplicate "All Services" link from the service column', () => {
    const links = (fixture.nativeElement as HTMLElement).querySelectorAll('a');
    const labels = Array.from(links).map((link) => link.textContent?.trim());

    expect(labels).not.toContain('All Services');
    expect(fixture.componentInstance.serviceLinks.length).toBeGreaterThan(0);
  });
});
