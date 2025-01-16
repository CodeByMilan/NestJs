import { Entity, Column, PrimaryGeneratedColumn} from 'typeorm';

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
  @Column({select:false})
  hello: string;
  
 
}
