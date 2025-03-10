import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { EmailNotificationService } from './email-notification.service';
import { SmsNotificationService } from './sms-notification.service';

@Module({
  providers: [NotificationService,EmailNotificationService,SmsNotificationService],
  exports: [NotificationService,EmailNotificationService,SmsNotificationService],
})
export class NotificationModule {}
