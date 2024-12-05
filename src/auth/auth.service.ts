import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private jwtService: JwtService
    ) { }

    async validateUser({ email, password }: AuthPayloadDto) {

        const findUser = await this.usersRepository.findOne({
            where: { email }
        })

        if (!findUser) throw new UnauthorizedException('No such user');

        const isPasswordValid = await bcrypt.compare(password, findUser.password);

        if (!isPasswordValid) throw new UnauthorizedException('Invalid password')

        const { id, email: mail, username, isAdmin } = findUser;
        const payload = { id, mail, username, isAdmin };

        return this.jwtService.sign(payload);
    }
}
