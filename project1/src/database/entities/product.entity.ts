import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('products') 
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productName: string;

  @Column()
  price: number;

  @Column()
  description:string

  @Column({ nullable: true })
  productImage: string;
 
}
