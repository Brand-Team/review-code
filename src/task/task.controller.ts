import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { TaskService } from './task.service';
import { Task } from './task.entity';

@Controller('task')
export class TaskController {
    constructor(private tasksService: TaskService) {}

    @Get()
    findAll() {
        return this.tasksService.findAll();
    }

    @Get('id')
    findOne(@Param('id') id: number) {
        return this.tasksService.findOne(id);
    }

    @Post()
    create(@Body() task: Partial<Task>): Promise<Task> {
        return this.tasksService.create(task);
    }

    @Patch(':id')
    update(@Param('id') id: number, @Body() task: Partial<Task>): Promise<any> {
        return this.tasksService.update(id, task);
    }

    @Delete(':id') 
    delete(@Param('id') id: number): Promise<any> {
        return this.tasksService.delete(id);
    }
}
