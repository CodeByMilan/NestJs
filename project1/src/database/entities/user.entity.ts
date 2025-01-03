import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Order } from './order.entity';
import { Product } from './product.entity';

 export enum ROLE {
  ADMIN = 'admin',
  CUSTOMER='customer'
}
@Entity('users') 
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({default:ROLE.CUSTOMER})
  role: ROLE;
  
  @OneToMany(
    type => Product, product => product.user)
  products: Product[];

  @OneToMany(
    type => Order, order => order.user)
  orders: Order[];
}
