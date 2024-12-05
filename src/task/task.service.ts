import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from '../entities';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDto } from './dto/createTask.dto';
import { UpdateTaskDto } from './dto/updateTask.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) { }

  // Find task based on id
  findOne(id: number): Promise<Task> {
    try {
      return this.tasksRepository.findOne({
        where: { id },
        relations: ['user', 'owner'],
      })
    } catch (error) {
      throw new NotFoundException('Cannot find ID')
    }
  }

  // Create task
  createTask(taskData: CreateTaskDto, ownerId: number): Promise<Task> {
    const task = this.tasksRepository.create(taskData);

    task.owner = { id: ownerId } as any;

    task.user = { id: taskData.assignedUserId } as any;

    return this.tasksRepository.save(task);
  }

  // Edit task
  async editTask(id: number, taskData: UpdateTaskDto): Promise<Task> {
    await this.tasksRepository.update(id, taskData)

    try {
      const task = await this.tasksRepository.findOne({
        where: { id },
        relations: ['user', 'owner'],
      })

      return task;
    } catch {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }

  // Delete task
  async deleteTask(id: number): Promise<any> {
    try {
      const result = await this.tasksRepository.delete(id);

      if (result.affected === 0) {
        throw new NotFoundException(`Task with ID ${id} not found`);
      }

      return { message: `Task with ID ${id} has been successfully deleted.` };
    } catch (error) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }

  // Show all tasks
  async findAll(
    page: number = 1,
    limit: number = 10,
    title?: string
  ): Promise<{ tasks: Task[]; total: number; page: number; totalPages: number }> {
    const queryBuilder = this.tasksRepository.createQueryBuilder('task')
      .leftJoinAndSelect('task.user', 'user')
      .leftJoinAndSelect('task.owner', 'owner');

    if (title) {
      queryBuilder.andWhere('task.title LIKE :title', {
        title: `%${title}%`
      });
    }

    const skip = (page - 1) * limit;

    const [tasks, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      tasks,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    }
  }

  // Show owned/asssigned task
  async findTask(
    id: number,
    findOwnedTasks: boolean,
    page: number = 1,
    limit: number = 10,
    title?: string
  ): Promise<{ tasks: Task[]; userInfo: string; total: number; page: number; totalPages: number }> {
    const queryBuilder = this.tasksRepository.createQueryBuilder('task')
      .leftJoinAndSelect('task.user', 'user')
      .leftJoinAndSelect('task.owner', 'owner');

    let userInfo: string;

    if (findOwnedTasks) {
      userInfo = `owned by user ${id}`;
      queryBuilder.where('task.ownerId = :id', { id })
    } else {
      userInfo = `assigned to user ${id}`;
      queryBuilder.where('task.userId = :id', { id })
    }

    if (title) {
      queryBuilder.andWhere('task.title LIKE :title', {
        title: `%${title}%`
      });
    }

    const skip = (page - 1) * limit;

    const [tasks, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      tasks,
      userInfo,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    }
  }

}
