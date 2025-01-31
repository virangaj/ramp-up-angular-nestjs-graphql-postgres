import { TestBed } from '@angular/core/testing';

import { NotificationService } from '@progress/kendo-angular-notification';
import { NotificationsService } from './notifications.service';

describe('NotificationsService', () => {
  let service: NotificationsService;
  let notificationService: jasmine.SpyObj<NotificationService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('NotificationService', ['show']);
    TestBed.configureTestingModule({
      providers: [{ provide: NotificationService, useValue: spy }],
    });
    service = TestBed.inject(NotificationsService);
    notificationService = TestBed.inject(
      NotificationService
    ) as jasmine.SpyObj<NotificationService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should create success notification', () => {
    service.showNotification('success', 'Operation successful');
    expect(notificationService.show).toHaveBeenCalledWith({
      content: 'Operation successful',
      type: { style: 'success', icon: true },
      animation: { type: 'slide', duration: 400 },
      hideAfter: 3000,
    });
  });

  it('should create error notification', () => {
    service.showNotification('error');
    expect(notificationService.show).toHaveBeenCalledWith({
      content: 'Oops, something went wrong...',
      type: { style: 'error', icon: true },
      animation: { type: 'slide', duration: 400 },
      hideAfter: 3000,
    });
  });
});
