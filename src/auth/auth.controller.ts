import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { LocalGuard } from './guards/local.guard';
import { Request } from 'express';
import { JwtAuthGuard } from './guards/jwt.guard';
import { AdminGuard } from './guards/admin.guard';
import { UserGuard } from './guards/user.guard';

@Controller('auth')
export class AuthController {

    @Post('login')
    @UseGuards(LocalGuard)
    login(@Req() req: Request) {
        console.log('Inside AuthController login method');
        return { yourJWT: req.user };
    }

    @Get('user')
    @UseGuards(JwtAuthGuard, UserGuard)
    status(@Req() req: Request) {
        console.log('Inside AuthController status method');
        return {
            welcome: 'user',
            payload: req.user
        };
    }

    @Get('admin')
    @UseGuards(JwtAuthGuard, AdminGuard)
    adminLogin(@Req() req: Request) {
        return { 
            welcome: 'admin',
            payload: req.user
        };
    }
}
