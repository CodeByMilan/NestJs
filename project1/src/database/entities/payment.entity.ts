import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Order } from './order.entity';

export enum PAYMENT_STATUS {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
}

export enum PAYMENT_METHOD {
  COD = 'cod',
  CARD = 'card',
  PAYPAL = 'paypal',
  STRIPE = 'stripe',
}

@Entity('payment')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: PAYMENT_STATUS.PENDING, type:"enum", enum: PAYMENT_STATUS })
  paymentStatus: PAYMENT_STATUS;

  @Column({ default: PAYMENT_METHOD.COD })
  paymentMethod: PAYMENT_METHOD;

  @OneToMany((type) => Order, (order) => order.payment)
  order: Order[];
}
