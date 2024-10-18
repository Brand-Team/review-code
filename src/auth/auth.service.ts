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

    async validateUser({email, password}: AuthPayloadDto) {

        const findUser = await this.usersRepository.findOne({
            where: {email}
        })

        if (!findUser) return null;

        if (password === findUser.password) {

            const {id, email, username, isAdmin } = findUser;
            const payload = { id, email, username, isAdmin};

            return this.jwtService.sign(payload);
        }
    }
}
