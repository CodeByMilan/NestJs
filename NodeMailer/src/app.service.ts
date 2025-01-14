import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { SendMailDto } from './dto/nodeMailer.dto';
import Mail from 'nodemailer/lib/mailer';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  mailTransport() {
    try {
      const transporter = nodemailer.createTransport({
        host: this.configService.get<string>('MAIL_HOST'),
        port: this.configService.get<number>('MAIL_PORT'),
        secure: false,
        auth: {
          user: this.configService.get<string>('MAIL_USERNAME'),
          pass: this.configService.get<string>('MAIL_PASSWORD'),
        },
      });
      return transporter;
    } catch (error) {
      console.error('Error creating mail transporter:', error);
      throw error;
    }  
  }

  template(html: string, replacements: Record<string, string>): string {
    return html.replace(/{(.*?)}/g, (match, key) => 
      replacements.hasOwnProperty(key) ? replacements[key] : ''
    );
  }

  async sendMail(sendMailDto: SendMailDto) {
    const { from, to, subject } = sendMailDto;
    const html = sendMailDto.placeholderReplacement
      ? this.template(sendMailDto.html, sendMailDto.placeholderReplacement)
      : sendMailDto.html;

    const transporter = this.mailTransport();
    const mailOptions: Mail.Options = {
      from: from ?? {
        name: this.configService.get<string>('APP_NAME'),
        address: this.configService.get<string>('DEFAULT_MAIL_FROM'),
      },
      to: to,
      subject: subject,
      html: html,
    };

    try {
      const result = await transporter.sendMail(mailOptions);
      if (result) {
        console.log('Email sent successfully');
      }
      return result;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
}
