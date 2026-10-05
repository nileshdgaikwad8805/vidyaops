import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { WorkshopsComponent } from './workshops.component';

describe('WorkshopsComponent', () => {
  let fixture: ComponentFixture<WorkshopsComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkshopsComponent],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(WorkshopsComponent);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should fall back to bundled workshops when the API returns an empty list', () => {
    fixture.detectChanges();
    httpMock.expectOne((req) => req.url.includes('/api/workshops')).flush({ workshops: [] });
    fixture.detectChanges();

    const cards = (fixture.nativeElement as HTMLElement).querySelectorAll('article');
    expect(cards.length).toBeGreaterThan(0);
  });
});
