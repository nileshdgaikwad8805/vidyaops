import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { EnrollComponent } from './enroll.component';

describe('EnrollComponent', () => {
  let fixture: ComponentFixture<EnrollComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnrollComponent],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(EnrollComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should start with no product selected', () => {
    expect(fixture.componentInstance.selectedProduct()).toBe('');
  });

  it('should start in the unsubmitted state', () => {
    const component = fixture.componentInstance;

    expect(component.submitted()).toBe(false);
    expect(component.errorMessage()).toBe('');
  });
});
