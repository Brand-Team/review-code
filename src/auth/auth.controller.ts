import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalGuard } from './guards/local.guard';
import { Request } from 'express';
import { JwtAuthGuard } from './guards/jwt.guard';
import { AdminGuard } from './guards/admin.guard';
import { UserGuard } from './guards/user.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('login')
    @UseGuards(LocalGuard)
    login(@Req() req: Request) {
        console.log('Inside AuthController login method');
        return { JWT: req.user };
    }

    @Get('user')
    @UseGuards(JwtAuthGuard, UserGuard)
    status(@Req() req: Request) {
        console.log('Inside AuthController status method');
        console.log(req.user);
        return {
            message: 'Welcome, user',
            payload: req.user
        };
    }

    @Get('admin')
    @UseGuards(JwtAuthGuard, AdminGuard)
    adminLogin(@Req() req: Request) {
        return { 
            message: 'Welcome, admin',
            payload: req.user
        };
    }
}
