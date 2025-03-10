import { Injectable } from "@nestjs/common";



@Injectable()
export class EmailNotificationService implements Notification {
  send(message: string) {
    console.log('Email sent:', message);
  }
}