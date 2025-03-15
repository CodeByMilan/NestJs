import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
      },
    });
  }

  async sendBlogCreationEmail(title: string, content: string) {
    await this.transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'milanacharya2001@gmail.com',
      subject: `New Blog Created: ${title}`,
      text: `A new blog has been posted.\n\nTitle: ${title}\nContent: ${content}`,
    });
  }
}
