import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { SendMailDto } from './dto/nodeMailer.dto';

@Controller('mail')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('sendMailTemplate')
  async sendMail(
    @Body('body') body: Record<string, string>,
    @Body() sendMailDto: SendMailDto
  ) {
   
    const html = this.appService.template(sendMailDto.html, body);
    const mail: SendMailDto = {
      ...sendMailDto,
      html: html,
    };

    return await this.appService.sendMail(mail);
  }

  @Post('sendMailWithoutTemplate')
  async sendMailWithoutTemplate(@Body() sendMailDto: SendMailDto) {
    return await this.appService.sendMail(sendMailDto);
  }
}
