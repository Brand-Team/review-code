import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Task } from "./task.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column({unique: true})
    email: string;

    @Column()
    password: string;

    @Column({default: true})
    isActive: boolean;

    @Column({default: false})
    isAdmin: boolean;

    @OneToMany(() => Task, (task) => task.user)
    assignedTasks: Task[]

    @OneToMany(() => Task, (task) => task.owner)
    ownedTask: Task[]
}