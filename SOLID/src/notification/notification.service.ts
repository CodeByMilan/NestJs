import { Injectable } from "@nestjs/common";

@Injectable()
export class NotificationService {
    constructor(){}
  sendNotification(message: string) {
    console.log('Notification sent:', message);
  }
}