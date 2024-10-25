import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/entities';
import { CreateUserDto } from './dto/createUser.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { ApiBearerAuth, ApiBody, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Controller('user')
export class UserController {
    constructor(private usersService: UserService) {}

    /* ------------------------------------------------------------------------------------------------------------------------

        Admin 

      ------------------------------------------------------------------------------------------------------------------------ */

    // Create user
    @Post('admin/createuser')
    @ApiBearerAuth('access-token')
    @ApiBody({description: "Details of the user to create", type: CreateUserDto})
    @ApiResponse({ status: 201, description: 'User successfully created' })
    @ApiResponse({ status: 400, description: 'Password does not match requirement'})
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'You are not an admin.' })
    @ApiResponse({ status: 409, description: 'Email already exists'})
    @UseGuards(JwtAuthGuard, AdminGuard)
    createuser(@Body() inputUser: CreateUserDto): Promise<Object> {
        return this.usersService.createUser(inputUser);
    }

    // Edit user
    @Patch('admin/:id')
    @ApiBearerAuth('access-token')
    @ApiParam({ name: 'id', description: 'ID of the user to edit', type: Number })
    @ApiBody({ description: "Details of the user to edit", type: CreateUserDto })
    @ApiResponse({ status: 200, description: 'User successfully edited' })
    @ApiResponse({ status: 400, description: 'Password does not match requirement'})
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiResponse({ status: 409, description: 'Email already exists'})
    @ApiResponse({ status: 500, description: 'User ID does not exist'})
    @UseGuards(JwtAuthGuard, AdminGuard)
    edituser(@Param('id') id: number, @Body() editUser: Partial<CreateUserDto>): Promise<User> {
        return this.usersService.editUser(id, editUser);
    }

    // Delete user
    @Delete('admin/:id')
    @ApiBearerAuth('access-token')
    @ApiParam({ name: 'id', description: 'ID of the user to delete', type: Number })
    @ApiResponse({ status: 200, description: 'User successfully deleted' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiResponse({ status: 500, description: 'User ID does not exist'})
    @UseGuards(JwtAuthGuard, AdminGuard)
    deleteuser(@Param('id') id: number): Promise<any> {
        return this.usersService.softDelete(id);
    }

    // Show users list
    @Get('admin/findall')
    @ApiBearerAuth('access-token')
    @ApiQuery({ name: 'page', required: false, description: 'Page number for pagination', type: Number, example: 1 })
    @ApiQuery({ name: 'limit', required: false, description: 'Number of users per page', type: Number, example: 10 })
    @ApiQuery({ name: 'username', required: false, description: 'Filter users by username', type: String, example: 'tmk2109' })
    @ApiQuery({ name: 'email', required: false, description: 'Filter users by email', type: String, example: 'tmk2109@gmail.com' })
    @ApiResponse({ status: 200, description: 'Users are successfully fetched' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @UseGuards(JwtAuthGuard, AdminGuard)
    findall(
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '10',
        @Query('username') username?: string,
        @Query('email') email?: string,
    ) {
        const pageNumber = Number(page);
        const limitNumber = Number(limit);

        return this.usersService.findAll(pageNumber, limitNumber, username, email);
    }

}
