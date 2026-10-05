import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { VolunteerComponent } from './volunteer.component';

describe('VolunteerComponent', () => {
  let fixture: ComponentFixture<VolunteerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VolunteerComponent],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(VolunteerComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should start in the unsubmitted state', () => {
    const component = fixture.componentInstance;

    expect(component.submitted()).toBe(false);
    expect(component.isSubmitting()).toBe(false);
    expect(component.errorMessage()).toBe('');
  });
});
