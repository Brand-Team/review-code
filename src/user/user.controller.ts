import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UnauthorizedException, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/entities';
import { CreateUserDto } from './dto/createUser.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { AdminGuard } from 'src/auth/guards/admin.guard';

@Controller('user')
export class UserController {
    constructor(private usersService: UserService) {}

    /* Admin */

    // Create user
    @Post('admin/createuser')
    @UseGuards(JwtAuthGuard, AdminGuard)
    createuser(@Body() user: CreateUserDto): Promise<User> {
        return this.usersService.createUser(user);
    }

    // Edit user
    @Patch('admin/:id')
    @UseGuards(JwtAuthGuard, AdminGuard)
    edituser(@Param('id') id: number, @Body() user: Partial<CreateUserDto>): Promise<User> {
        return this.usersService.editUser(id, user)
    }

    // Delete user
    @Delete('admin/:id')
    @UseGuards(JwtAuthGuard, AdminGuard)
    deleteuser(@Param('id') id: number): Promise<any> {
        return this.usersService.softDelete(id);
    }

    // Show users list
    @Get('admin/findall')
    @UseGuards(JwtAuthGuard, AdminGuard)
    findall(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Query('username') username?: string,
        @Query('email') email?: string,
    ) {
        return this.usersService.findAll(page, limit, username, email);
    }

}
