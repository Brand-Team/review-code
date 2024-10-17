import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UnauthorizedException, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/entities';
import { CreateUserDto } from './dto/createUser.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { AdminGuard } from 'src/auth/guards/admin.guard';

@Controller('user')
export class UserController {
    constructor(private usersService: UserService) {}

    @Get()
    findAll() {
        return this.usersService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.usersService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: number, @Body() user: Partial<User>): Promise<any> {
        return this.usersService.update(id, user);
    }

    @Delete(':id')
    delete(@Param('id') id: number): Promise<any> {
        return this.usersService.softDelete(id)
    }

  // Create user
  @Post('createuser')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async createuser(@Body() createUser: CreateUserDto): Promise<User> {
    return this.usersService.createUser(createUser);
  }

  // Edit user
  @Patch('edituser/:id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async edituser(@Param('id') id: number, @Body() editUser: Partial<CreateUserDto>): Promise<User> {
    return this.usersService.editUser(id, editUser)
  }

  // Delete user
  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  deleteuser(@Param('id') id: number): Promise<any> {
    return this.usersService.softDelete(id);
  }

  // Show users list
  @Get('findall')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async getUsers(
    @Query('username') username?: string,
    @Query('email') email?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<{ users: User[]; total: number }> {
    const result = this.usersService.findAll(username, email, page, limit);
    return result;
  }
}
