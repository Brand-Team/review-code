import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Task {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({type: 'text'})
    description: string;

    @Column({default: false})
    completed: boolean;

    @ManyToOne(() => User, (user) => user.assignedTasks)
    user: User;

    @ManyToOne(() => User, (user) => user.ownedTask)
    owner: User;
}