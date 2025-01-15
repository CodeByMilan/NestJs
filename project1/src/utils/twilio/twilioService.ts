import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import * as twilio from 'twilio';
import { Cache } from 'cache-manager';
import { SmsRetunedDto, VerifyOtpDto } from './smsTypes.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class TwilioService{
  private client;
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache
) 
    {
    this.client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
  }

  async generateOtp(length: number): Promise<string> {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
      otp += digits.charAt(Math.floor(Math.random() * digits.length));
    }
    return otp;
  }

  async sendOtp(phoneNumber: string, otp: string): Promise<SmsRetunedDto> {
    try {
      const sendData=await this.client.messages.create({
        body: `Your OTP is: ${otp}`,
        from: process.env.TWILIO_SENDER_PHONE_NUMBER,
        to: phoneNumber,
      });
      //storing in redis
      await this.cacheManager.set(
        `OTP`,
        JSON.stringify({ phoneNumber,otp}),
      );
      const {body,to}=sendData
      return{
        body,
        to
      }
    } catch (error) {
      throw new Error(`Failed to send OTP: ${error.message}`);
    }
  }

  // Verify OTP
  async verifyOtp({ phoneNumber, otp }: VerifyOtpDto): Promise<boolean> {
    const userOtp: any = await this.cacheManager.get(`OTP`);
    console.log("inside verify ", userOtp);
  
    if (!userOtp) {
      throw new HttpException('OTP expired or invalid', HttpStatus.BAD_REQUEST);
    }
  
    const { phoneNumber: storedPhoneNumber, otp: storedOtp } = JSON.parse(userOtp);
  
    if (storedPhoneNumber !== phoneNumber) {
      throw new HttpException('Invalid phone number', HttpStatus.BAD_REQUEST);
    }
  
    if (otp !== storedOtp) {
      throw new HttpException('Invalid OTP', HttpStatus.BAD_REQUEST);
    }
  
    // Delete OTP after successful verification
    await this.cacheManager.del(`otp:${otp}`);
  
    return true;
  }
}
