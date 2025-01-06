import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { OrderDetail } from './orderDetails.entity';
import { Cart } from './cart.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productName: string;

  @Column()
  price: number;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  productImage: string;

  @Column()
  userId: number;

  @ManyToOne((type) => User, (user) => user.product)
  user: User;
  @OneToMany((type) => OrderDetail, (orderDetails) => orderDetails.product)
  orderDetail: OrderDetail[];

  @OneToMany((type) => Cart, (cart) => cart.product)
  carts: Cart;
  
}
