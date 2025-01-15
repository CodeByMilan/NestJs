
export type SmsSendDto={
    phoneNumber:string
}
export type SmsRetunedDto={
    body:string,
    to:string
}
export type  VerifyOtpDto={
    otp:string,
    phoneNumber:string
}