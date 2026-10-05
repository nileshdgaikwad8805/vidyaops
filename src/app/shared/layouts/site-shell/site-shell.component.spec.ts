import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { SiteShellComponent } from './site-shell.component';

describe('SiteShellComponent', () => {
  let fixture: ComponentFixture<SiteShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SiteShellComponent],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(SiteShellComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the header, outlet, footer, chatbot and toasts', () => {
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('app-site-header')).toBeTruthy();
    expect(element.querySelector('main router-outlet')).toBeTruthy();
    expect(element.querySelector('app-site-footer')).toBeTruthy();
    expect(element.querySelector('app-chatbot')).toBeTruthy();
    expect(element.querySelector('app-toast-host')).toBeTruthy();
  });
});
