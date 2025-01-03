import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { Payment } from './payment.entity';
import { OrderDetail } from './orderDetails.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  orderStatus: string;

  @Column()
  amount: number;

  @Column()
  shippingAddress: string;

  @ManyToOne((type) => User, (user) => user.orders)
  user: User;

  @ManyToOne((type) => Payment, (payment) => payment.order)
  payment: Payment;

  @OneToMany((type) => OrderDetail, (orderDetails) => orderDetails.order)
  orderDetail: OrderDetail[];
}
