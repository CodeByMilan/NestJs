import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { SendMailDto } from './mail.dto';
import Mail from 'nodemailer/lib/mailer';
import Handlebars from 'handlebars';
import * as path from 'path';
import * as fs from 'fs'; 

@Injectable()
export class NodeMailerService {
  private transporter;
  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('MAIL_HOST'),
      port: this.configService.get<number>('MAIL_PORT'),
      secure: false,
      auth: {
        user: this.configService.get<string>('MAIL_USERNAME'),
        pass: this.configService.get<string>('MAIL_PASSWORD'),
      },
    });
  }

  template(html: string, replacements: Record<string, string>): string {
    return html.replace(/{(.*?)}/g, (match, key) =>
      replacements.hasOwnProperty(key) ? replacements[key] : '',
    );
  }

  async sendMail(sendMailDto: SendMailDto) {
    const { from, to, subject, text, placeholderReplacement } = sendMailDto;
    let { html } = sendMailDto;

    // console.log('Current Directory:', __dirname);
    const filePath = path.join(process.cwd(), 'views', 'mailTemplate.hbs');
    // console.log('Template File Path:', filePath);

    const emailTemplateSource = fs.readFileSync(filePath, 'utf-8');
    const template = Handlebars.compile(emailTemplateSource);
    html = template({ ...placeholderReplacement });

    const mailOptions: Mail.Options = {
      from: from ?? {
        name: this.configService.get<string>('APP_NAME'),
        address: this.configService.get<string>('DEFAULT_MAIL_FROM'),
      },
      to,
      subject,
      html,
      text,
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully');
      return result;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
}
