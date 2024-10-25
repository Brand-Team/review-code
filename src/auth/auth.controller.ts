import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { LocalGuard } from './guards/local.guard';
import { Request } from 'express';
import { JwtAuthGuard } from './guards/jwt.guard';
import { AdminGuard } from './guards/admin.guard';
import { UserGuard } from './guards/user.guard';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthPayloadDto } from './dto/auth.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {

    @Post('login')
    @ApiBody({ description: "Details of the user to edit", type: AuthPayloadDto })
    @ApiResponse({ status: 201, description: 'Successfully login' })
    @ApiResponse({ status: 401, description: 'Invalid email or password' })
    @UseGuards(LocalGuard)
    login(@Req() req: Request) {
        console.log('Inside AuthController login method');
        return { yourJWT: req.user };
    }

    @Get('user')
    @ApiBearerAuth('access-token')
    @ApiResponse({ status: 200, description: 'Successfully retrieved user status.' })
    @ApiResponse({ status: 401, description: 'JWT Unauthorized.' })
    @ApiResponse({ status: 403, description: 'You are not a normal user.' })
    @UseGuards(JwtAuthGuard, UserGuard)
    status(@Req() req: Request) {
        console.log('Inside AuthController status method');
        return {
            welcome: 'user',
            payload: req.user
        };
    }

    @Get('admin')
    @ApiBearerAuth('access-token')
    @ApiResponse({ status: 200, description: 'Successfully retrieved admin status.' })
    @ApiResponse({ status: 401, description: 'JWT Unauthorized.' })
    @ApiResponse({ status: 403, description: 'You are not an admin.' })
    @UseGuards(JwtAuthGuard, AdminGuard)
    adminLogin(@Req() req: Request) {
        return { 
            welcome: 'admin',
            payload: req.user
        };
    }
}
