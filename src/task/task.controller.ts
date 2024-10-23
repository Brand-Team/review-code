import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { TaskService } from './task.service';
import { RequestWithUser } from 'src/auth/types/requestWithUser.interface';
import { Task } from 'src/entities';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { CreateTaskDto } from './dto/createTask.dto';
import { UserGuard } from 'src/auth/guards/user.guard';
import { OwnerGuard } from 'src/auth/guards/owner.guard';
import { UpdateTaskDto } from './dto/updateTask.dto';

@Controller('task')
export class TaskController {
    constructor(private tasksService: TaskService) {}

    // Create task
    @Post('create')
    @UseGuards(JwtAuthGuard)
    createTaskAdmin(@Body() task: CreateTaskDto, @Req() req: RequestWithUser): Promise<Task> {
        const ownerId = req.user.id;
        return this.tasksService.createTask(task, ownerId);
    }

     /* ------------------------------------------------------------------------------------------------------------------------

        Admin 

      ------------------------------------------------------------------------------------------------------------------------ */

    // Edit task
    @Patch('admin/:id')
    @UseGuards(JwtAuthGuard, AdminGuard)
    editTaskAdmin(@Param('id') id: number, @Body() task: UpdateTaskDto): Promise<Object> {
        return this.tasksService.editTask(id, task)
    }

    // Delete task
    @Delete('admin/:id')
    @UseGuards(JwtAuthGuard, AdminGuard)
    deleteTaskAdmin(@Param('id') id: number): Promise<any> {
        return this.tasksService.deleteTask(id)
    }

    // Show tasks list
    @Get('admin/findall')
    @UseGuards(JwtAuthGuard, AdminGuard)
    findallAdmin(
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '10',
        @Query('title') title?: string
    ) {

        const pageNumber = Number(page);
        const limitNumber = Number(limit);

        return this.tasksService.findAll(pageNumber, limitNumber, title);
    }

    /* ------------------------------------------------------------------------------------------------------------------------

        User 

      ------------------------------------------------------------------------------------------------------------------------ */

    // Edit task
    @Patch('user/:id')
    @UseGuards(JwtAuthGuard, UserGuard, OwnerGuard)
    edittask(@Param('id') id: number, @Body() task: UpdateTaskDto): Promise<Object> {
        return this.tasksService.editTask(id, task)
    }

    // Delete task
    @Delete('user/:id')
    @UseGuards(JwtAuthGuard, UserGuard, OwnerGuard)
    deletetask(@Param('id') id: number): Promise<any> {
        return this.tasksService.deleteTask(id)
    }

    // Show owned tasks list
    @Get('user/findownedtasks')
    @UseGuards(JwtAuthGuard, UserGuard)
    findownedtask(
        @Req() req: RequestWithUser,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Query('title') title?: string,   
    ) {
        const id = req.user.id;

        return this.tasksService.findTask(id, true, page, limit, title);
    }

    // Show assigned tasks list
    @Get('user/findassignedtasks')
    @UseGuards(JwtAuthGuard, UserGuard)
    findassignedtask(
        @Req() req: RequestWithUser,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Query('title') title?: string,   
    ) {
        const id = req.user.id;

        return this.tasksService.findTask(id, false, page, limit, title);
    }

}
