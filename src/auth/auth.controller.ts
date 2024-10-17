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

        const user = req.user;

        // Check if user is a string and parse it to JSON if necessary
        let userJson;
        if (typeof user === 'string') {
            try {
                userJson = JSON.parse(user); // Convert string to JSON
            } catch (error) {
                console.error('Failed to parse user string:', error);
                return { error: 'Failed to parse user data.' }; // Handle parsing error
            }
        } else {
            userJson = user; // If already an object, just assign it
        }

        return userJson; // Return the user as a JSON object
    }

    @Get('user')
    @UseGuards(JwtAuthGuard, UserGuard)
    status(@Req() req: Request) {
        console.log('Inside AuthController status method');
        //console.log(req.user);
       // return req.user;
    }

    @Get('admin')
    @UseGuards(JwtAuthGuard, AdminGuard)
    adminLogin(@Req() req: Request) {
        return { message: 'Welcome, admin'};
    }
}
