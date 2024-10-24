import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/entities';
import { CreateUserDto } from './dto/createUser.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { AdminGuard } from 'src/auth/guards/admin.guard';

@Controller('user')
export class UserController {
    constructor(private usersService: UserService) {}

    /* ------------------------------------------------------------------------------------------------------------------------

        Admin 

      ------------------------------------------------------------------------------------------------------------------------ */

    // Create user
    @Post('admin/createuser')
    @UseGuards(JwtAuthGuard, AdminGuard)
    createuser(@Body() inputUser: CreateUserDto): Promise<Object> {
        return this.usersService.createUser(inputUser);
    }

    // Edit user
    @Patch('admin/:id')
    @UseGuards(JwtAuthGuard, AdminGuard)
    edituser(@Param('id') id: number, @Body() editUser: Partial<CreateUserDto>): Promise<User> {
        return this.usersService.editUser(id, editUser)
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
