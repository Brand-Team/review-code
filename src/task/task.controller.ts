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
import { ApiBearerAuth, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Task')
@Controller('task')
export class TaskController {
    constructor(private tasksService: TaskService) {}

    // Create task
    @Post('create')
    @ApiBearerAuth('access-token')
    @ApiResponse({ status: 201, description: 'Task successfully created' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
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
    @ApiBearerAuth('access-token')
    @ApiParam({ name: 'id', description: 'ID of the task to edit', type: Number })
    @ApiResponse({ status: 200, description: 'Task successfully edited' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiResponse({ status: 500, description: 'Task ID does not exist'})
    @UseGuards(JwtAuthGuard, AdminGuard)
    editTaskAdmin(@Param('id') id: number, @Body() task: UpdateTaskDto): Promise<Object> {
        return this.tasksService.editTask(id, task)
    }

    // Delete task
    @Delete('admin/:id')
    @ApiBearerAuth('access-token')
    @ApiParam({ name: 'id', description: 'ID of the task to delete', type: Number })
    @ApiResponse({ status: 200, description: 'Task successfully deleted' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiResponse({ status: 500, description: 'Task ID does not exist'})
    @UseGuards(JwtAuthGuard, AdminGuard)
    deleteTaskAdmin(@Param('id') id: number): Promise<any> {
        return this.tasksService.deleteTask(id)
    }

    // Show tasks list
    @Get('admin/findall')
    @ApiBearerAuth('access-token')
    @ApiQuery({ name: 'page', required: false, description: 'Page number for pagination', type: Number, example: 1 })
    @ApiQuery({ name: 'limit', required: false, description: 'Number of users per page', type: Number, example: 10 })
    @ApiQuery({ name: 'title', required: false, description: 'Filter users by title', type: String, example: 'Test title' })
    @ApiResponse({ status: 200, description: 'Tasks successfully fetched' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
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
    @ApiBearerAuth('access-token')
    @ApiParam({ name: 'id', description: 'ID of the task to edit', type: Number })
    @ApiResponse({ status: 200, description: 'User successfully edited' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiResponse({ status: 500, description: 'Task ID does not exist'})
    @UseGuards(JwtAuthGuard, UserGuard, OwnerGuard)
    edittask(@Param('id') id: number, @Body() task: UpdateTaskDto): Promise<Object> {
        return this.tasksService.editTask(id, task)
    }

    // Delete task
    @Delete('user/:id')
    @ApiBearerAuth('access-token')
    @ApiParam({ name: 'id', description: 'ID of the task to delete', type: Number })
    @ApiResponse({ status: 200, description: 'User successfully deleted' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiResponse({ status: 500, description: 'Task ID does not exist'})
    @UseGuards(JwtAuthGuard, UserGuard, OwnerGuard)
    deletetask(@Param('id') id: number): Promise<any> {
        return this.tasksService.deleteTask(id)
    }

    // Show owned tasks list
    @Get('user/findownedtasks')
    @ApiBearerAuth('access-token')
    @ApiQuery({ name: 'page', required: false, description: 'Page number for pagination', type: Number, example: 1 })
    @ApiQuery({ name: 'limit', required: false, description: 'Number of tasks per page', type: Number, example: 10 })
    @ApiQuery({ name: 'title', required: false, description: 'Filter tasks by title', type: String, example: 'Task Title' })
    @ApiResponse({ status: 200, description: 'Owned tasks successfully fetched' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @UseGuards(JwtAuthGuard, UserGuard)
    findownedtask(
        @Req() req: RequestWithUser,
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '10',
        @Query('title') title?: string,   
    ) {
        const id = req.user.id;

        const pageNumber = Number(page);
        const limitNumber = Number(limit);

        return this.tasksService.findTask(id, true, pageNumber, limitNumber, title);
    }

    // Show assigned tasks list
    @Get('user/findassignedtasks')
    @ApiBearerAuth('access-token')
    @ApiQuery({ name: 'page', required: false, description: 'Page number for pagination', type: Number, example: 1 })
    @ApiQuery({ name: 'limit', required: false, description: 'Number of tasks per page', type: Number, example: 10 })
    @ApiQuery({ name: 'title', required: false, description: 'Filter tasks by title', type: String, example: 'Task Title' })
    @ApiResponse({ status: 200, description: 'Assigned tasks successfully fetched' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @UseGuards(JwtAuthGuard, UserGuard)
    findassignedtask(
        @Req() req: RequestWithUser,
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '10',
        @Query('title') title?: string,   
    ) {
        const id = req.user.id;

        const pageNumber = Number(page);
        const limitNumber = Number(limit);

        console.log(id)

        return this.tasksService.findTask(id, false, pageNumber, limitNumber, title);
    }

}
