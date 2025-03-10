import { Injectable } from "@nestjs/common";



@Injectable()
export class SmsNotificationService implements Notification {
  send(message: string) {
    console.log('SMS sent:', message);
  }
}
