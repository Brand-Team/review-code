import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private jwtService: JwtService
    ) {}

    async validateUser({email, password}: AuthPayloadDto) {

        const findUser = await this.usersRepository.findOne({
            where: {email}
        })

        if (!findUser) throw new UnauthorizedException('No such user');

        const isPasswordValid = await bcrypt.compare(password, findUser.password);

        if (!isPasswordValid) throw new UnauthorizedException('Invalid password')

        const { id, email: useremail, username, isAdmin } = findUser;
        const payload = { id, useremail, username, isAdmin };

        return this.jwtService.sign(payload);
    }
}
