import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Order } from './order.entity';
import { Product } from './product.entity';
import { Cart } from './cart.entity';
import { WishListEntity } from 'src/modules/wishlist/repository/entities/wishlist.entity';

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

  @Column({select:false})
  password: string;

  @Column({default:ROLE.CUSTOMER})
  role: ROLE;
  
  @OneToMany(
    type => Product, product => product.user)
  product: Product[];

  @OneToMany(
    type => Order, order => order.user)
  orders: Order[];
  @OneToMany(
    type => Cart, cart => cart.user)
  cart: Cart[];

  @OneToMany(
    type => WishListEntity, wishList => wishList.user)
  wishList: WishListEntity[];
}
