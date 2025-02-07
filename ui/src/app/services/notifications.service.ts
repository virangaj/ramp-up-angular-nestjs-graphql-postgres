import { Injectable } from '@angular/core';
import {
  NotificationRef,
  NotificationService,
  NotificationSettings,
} from '@progress/kendo-angular-notification';
@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  constructor(private notificationService: NotificationService) {}

  public notificationState: NotificationSettings = {
    content: 'Your data has been saved.',
    type: { style: 'success', icon: true },
    animation: { type: 'slide', duration: 400 },
    hideAfter: 3000,
  };

  public showNotification(type: 'success' | 'error', message?: string): void {
    switch (type) {
      case 'success':
        this.notificationState.content = message
          ? message
          : 'Data has been saved successfully.';
        this.notificationState.type = { style: 'success', icon: true };
        break;
      case 'error':
        this.notificationState.content = message
          ? message
          : 'Oops, something went wrong...';
        this.notificationState.type = { style: 'error', icon: true };
        break;
    }
    this.notificationService.show(this.notificationState);
  }
}
