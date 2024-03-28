import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Student {
  @PrimaryGeneratedColumn()
  id:number;

  @Column()
  email:string;

  @Column()
  password:string;

  @Column({default:""})
  token:string;
}
