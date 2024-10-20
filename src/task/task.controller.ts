import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { TaskService } from './task.service';
import { RequestWithUser } from 'src/auth/types/requestWithUser.interface';
import { Task } from 'src/entities';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { CreateTaskDto } from './dto/createTask.dto';
import { UserGuard } from 'src/auth/guards/user.guard';
import { OwnerGuard } from 'src/auth/guards/owner.guard';

@Controller('task')
export class TaskController {
    constructor(private tasksService: TaskService) {}

     /* ------------------------------------------------------------------------------------------------------------------------

        Admin 

      ------------------------------------------------------------------------------------------------------------------------ */

    // Create task
    @Post('admin/create')
    @UseGuards(JwtAuthGuard, AdminGuard)
    createTaskAdmin(@Body() task: Partial<CreateTaskDto>, @Req() req: RequestWithUser): Promise<Task> {
        const userId = req.user.id;
        console.log(userId);
        return this.tasksService.createTask(task, userId);
    }

    // Edit task
    @Patch('admin/:id')
    @UseGuards(JwtAuthGuard, AdminGuard)
    editTaskAdmin(@Param('id') id: number, @Body() task: Partial<CreateTaskDto>): Promise<Task> {
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
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Query('title') title?: string
    ) {
        return this.tasksService.findAll(page, limit, title);
    }

    /* ------------------------------------------------------------------------------------------------------------------------

        User 

      ------------------------------------------------------------------------------------------------------------------------ */

    // Create task
    @Post('user/create')
    @UseGuards(JwtAuthGuard, UserGuard)
    createtask(@Body() task: Partial<CreateTaskDto>, @Req() req: RequestWithUser): Promise<Task> {
        const userId = req.user.id;
        console.log(userId);
        return this.tasksService.createTask(task, userId);
    }

    // Edit task
    @Patch('user/:id')
    @UseGuards(JwtAuthGuard, UserGuard, OwnerGuard)
    edittask(@Param('id') id: number, @Body() task: Partial<CreateTaskDto>): Promise<Task> {
        return this.tasksService.editTask(id, task)
    }

    // Delete task
    @Delete('user/:id')
    @UseGuards(JwtAuthGuard, UserGuard)
    deletetask(@Param('id') id: number): Promise<any> {
        return this.tasksService.deleteTask(id)
    }

    // Show tasks list
    @Get('user/findall')
    @UseGuards(JwtAuthGuard, UserGuard)
    findall(
        @Req() req: RequestWithUser,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Query('title') title?: string,   
    ) {
        const userId = req.user.id;

        return this.tasksService.findAssignTask(userId, page, limit, title);
    }

}
