import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,

  } from 'typeorm';
  import { User } from './user.entity';
import { Product } from './product.entity';
  
  @Entity('carts')
  export class Cart {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    quantity: number;

    @Column()
    productId: number;

    @Column()
    userId:number;
  
    @ManyToOne((type) => User, (user) => user.cart)
    user: User;
  
    @ManyToOne((type) => Product, (product) => product.carts)
    product: Product;

  }
  