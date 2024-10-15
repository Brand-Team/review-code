import { Body, Controller, Delete, Get, Param, Patch, Post, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { SigninDto } from './dto/signin.dto';
import { CreateUserDto } from './dto/createUser.dto';

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

    @Delete('id')
    delete(@Param('id') id: number): Promise<any> {
        return this.usersService.softDelete(id)
    }

    /* ----------------------------------------------------------------------------------------------------------------------------
    
        15/10/2024 - API login to admin
        
    -------------------------------------------------------------------------------------------------------------------------------*/

    // Create user
    @Post('signup')
    async create(@Body() createUser: CreateUserDto): Promise<User> {
        return this.usersService.create(createUser);
    }

    // Admin login
    @Post('login')
    async login(@Body() signinInfo: SigninDto): Promise<string> {
        const user = await this.usersService.loginAdmin(signinInfo);

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return `Welcome, admin ${user.username}`;
    }


}
