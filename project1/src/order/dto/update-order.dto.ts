import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';
import { CreatePaymentDto } from './create-payment.dto';
import { CreateOrderDetailDto } from './create-orderDetails.dto';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {}
export class UpdatePaymentDto extends PartialType(CreatePaymentDto) {}

export class updateOrderDetailsDto extends PartialType(CreateOrderDetailDto) {}
