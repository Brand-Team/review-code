import { Injectable } from '@nestjs/common';
import { Task } from './task.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TaskService {
    constructor(
        @InjectRepository(Task)
        private tasksRepository: Repository<Task>,
    ) {}

    findAll(): Promise<Task[]> {
        return this.tasksRepository.find();
    }

    findOne(id: number): Promise<Task | null> {
        return this.tasksRepository.findOneBy({id})
    }

    create(task: Partial<Task>): Promise<Task> {
        return this.tasksRepository.save(task);
    }

    update(id: number, task: Partial<Task>): Promise<any> {
        return this.tasksRepository.update(id, task);
    }

    delete(id: number): Promise<any> {
        return this.tasksRepository.delete(id);
    }
}
