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

export enum ORDERSTATUS {
  PENDING = 'pending',
  ONTHEWAY = 'ontheway',
  DELIVERED = 'delivered',
  CANCELED = 'canceled',
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({default:ORDERSTATUS.PENDING})
  orderStatus: ORDERSTATUS;

  @Column()
  amount: number;

  @Column()
  shippingAddress: string;

  @Column({nullable:false})
  userId:number

  @Column({nullable:false})
  paymentId: number;

  @Column({ nullable: true })
  paypalOrderId:string

  @ManyToOne((type) => User, (user) => user.orders)
  user: User;

  @ManyToOne((type) => Payment, (payment) => payment.order)
  payment: Payment;

  @OneToMany((type) => OrderDetail, (orderDetails) => orderDetails.order)
  orderDetail: OrderDetail[];
}
