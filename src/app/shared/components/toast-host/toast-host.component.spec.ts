import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToastHostComponent } from './toast-host.component';
import { NotificationService } from '../../../core/services/notification.service';

describe('ToastHostComponent', () => {
  let fixture: ComponentFixture<ToastHostComponent>;
  let notifications: NotificationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastHostComponent],
    }).compileComponents();

    notifications = TestBed.inject(NotificationService);
    notifications.clear();
    fixture = TestBed.createComponent(ToastHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => notifications.clear());

  it('should create with no toasts', () => {
    expect(fixture.componentInstance).toBeTruthy();
    expect((fixture.nativeElement as HTMLElement).querySelector('.toast')).toBeNull();
  });

  it('should render a toast per notification', () => {
    notifications.show('Saved', 'success');
    notifications.show('Failed', 'error');
    fixture.detectChanges();

    const toasts = (fixture.nativeElement as HTMLElement).querySelectorAll('.toast');
    expect(toasts.length).toBe(2);
  });

  it('should apply the tone class', () => {
    notifications.show('Failed', 'error');
    fixture.detectChanges();

    const toast = (fixture.nativeElement as HTMLElement).querySelector('.toast');
    expect(toast?.classList).toContain('toast--error');
  });

  it('should dismiss a toast on click', () => {
    notifications.show('Saved', 'success');
    fixture.detectChanges();

    (fixture.nativeElement as HTMLElement)
      .querySelector<HTMLButtonElement>('.toast')
      ?.click();
    fixture.detectChanges();

    expect(notifications.notifications().length).toBe(0);
  });
});
