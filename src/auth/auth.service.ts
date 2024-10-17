import { Injectable } from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private jwtService: JwtService
    ) {}

    async validateUser({username, password}: AuthPayloadDto) {

        const findUser = await this.usersRepository.findOne({
            where: {username}
        })

        if (!findUser) return null;

        if (password === findUser.password) {
            const { password, ...user } = findUser;
            console.log(this.jwtService.sign(user))
            return this.jwtService.sign(user);
        }
    }
}
