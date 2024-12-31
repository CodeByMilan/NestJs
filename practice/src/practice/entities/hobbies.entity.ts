import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Practice } from "./practice.entity"

@Entity()
export class Hobbies {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string
  
    @ManyToOne(
        type => Practice, 
        (practice) => practice.id)
    practice: Practice
}
 