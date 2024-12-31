import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Practice } from "./practice.entity"

@Entity()
export class Hobbies {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string
    @OneToMany(
        type => Practice,
        practice => practice.hobbies , 
    )
    practices :Practice
}
