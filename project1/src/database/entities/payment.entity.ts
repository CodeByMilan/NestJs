import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Order } from './order.entity';

@Entity('payment')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  paymentStatus: string;

  @Column()
  paymentMethod: string;

  @OneToMany((type) => Order, (order) => order.payment)
  order: Order[];
}
