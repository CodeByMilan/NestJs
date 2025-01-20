import { Product } from 'src/database/entities/product.entity';
import { User } from 'src/database/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';


@Entity('wishlists')
export class WishListEntity {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  productId: number;

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.wishList)
  user: User;

  @ManyToOne(() => Product, (product) => product.wishLists)
  product: Product;
}
