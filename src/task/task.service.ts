import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from 'src/entities';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDto } from './dto/createTask.dto';

@Injectable()
export class TaskService {
    constructor(
        @InjectRepository(Task)
        private tasksRepository: Repository<Task>,
    ) {}

    // Create task
    createTask(taskData: Partial<CreateTaskDto>, userId: number): Promise<Task> {
        const task = this.tasksRepository.create(taskData);

        task.user = { id: userId } as any;

        return this.tasksRepository.save(task);
    }

    // Edit task
    async editTask(id: number, taskData: Partial<CreateTaskDto>): Promise<Task> {
        await this.tasksRepository.update(id, taskData)
        return this.tasksRepository.findOneBy({id})
    }

    // Delete task
    async deleteTask(id: number): Promise<any> {
        const result = await this.tasksRepository.delete(id);

        if (result.affected === 0) {
            throw new NotFoundException(`Task with ID ${id} not found`);
        }

        return { message: `Task with ID ${id} has been successfully deleted.` };
    }

    // Show all tasks
    async findAll(
        page: number = 1,
        limit: number = 10,
        title?: string
    ): Promise<{data: Task[]; total: number; page: number; totalPages: number}> {
        const queryBuilder = this.tasksRepository.createQueryBuilder('task');

        if (title) {
            queryBuilder.andWhere('task.title ILIKE :title', {
                title: `%${title}%`
            });
        }

        const skip = (page - 1) * limit;

        const total = await queryBuilder.getCount();

        const data = await queryBuilder
            .skip(skip)
            .take(limit)
            .getMany();

        return {
            data,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        }
    }

    // Show assign task
    async findAssignTask(
        userId: number,
        page: number = 1,
        limit: number = 10,
        title?: string
    ): Promise<{data: Task[]; total: number; page: number; totalPages: number}> {
        const queryBuilder = this.tasksRepository.createQueryBuilder('task');

        queryBuilder.where('task.userId = :userId', {userId});

        if (title) {
            queryBuilder.andWhere('task.title ILIKE :title', {
                title: `%${title}%`
            });
        }

        const skip = (page - 1) * limit;

        const total = await queryBuilder.getCount();

        const data = await queryBuilder
            .skip(skip)
            .take(limit)
            .getMany();

        return {
            data,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        }
    }
    
}
