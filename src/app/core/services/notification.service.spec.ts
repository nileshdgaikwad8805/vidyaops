import { TestBed } from '@angular/core/testing';

import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationService);
  });

  afterEach(() => service.clear());

  it('should start empty', () => {
    expect(service.notifications()).toEqual([]);
  });

  it('should append a notification with a unique id', () => {
    service.show('First', 'info');
    service.show('Second', 'success');

    const notifications = service.notifications();
    expect(notifications.length).toBe(2);
    expect(notifications[0].id).not.toBe(notifications[1].id);
  });

  it('should default the tone to info', () => {
    service.show('Hello');

    expect(service.notifications()[0].tone).toBe('info');
  });

  it('should remove a notification on dismiss', () => {
    service.show('Hello', 'error');
    const id = service.notifications()[0].id;

    service.dismiss(id);

    expect(service.notifications()).toEqual([]);
  });

  it('should ignore a dismiss for an unknown id', () => {
    service.show('Hello');
    service.dismiss(9999);

    expect(service.notifications().length).toBe(1);
  });

  it('should remove everything on clear', () => {
    service.show('One');
    service.show('Two');

    service.clear();

    expect(service.notifications()).toEqual([]);
  });
});
