import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Product } from './product.entity';
import { Order } from './order.entity';

@Entity('orderDetails')
export class OrderDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  qunatity: number;

  @Column()
  orderId: number;

  @Column()
  productId: number;

  @Column()
  hello: number;

  @Column()
  price: number;

  @ManyToOne(() => Order, (order) => order.orderDetail)
  order: Order;

  @ManyToOne(() => Product, (product) => product.orderDetail)
  product: Product;
}
