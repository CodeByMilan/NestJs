import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Order } from './order.entity';

export enum PAYMENTSTATUS{
  PENDING='pending',
  SUCCESS='success',
  FAILED='failed',
}

export enum PAYMENTMETHOD{
  COD='cod',
  CARD='card',
  PAYPAL='paypal',
  BANK='BANK'
  }

@Entity('payment')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({default:PAYMENTSTATUS.PENDING})
  paymentStatus: PAYMENTSTATUS;

  @Column({default:PAYMENTMETHOD.COD})
  paymentMethod: PAYMENTMETHOD;

  @OneToMany((type) => Order, (order) => order.payment)
  order: Order[];
}
