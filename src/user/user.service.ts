import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { SigninDto } from './dto/signin.dto';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/createUser.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {}

    findAll(): Promise<User[]> {
        return this.usersRepository.find();
    }

    findOne(id: number): Promise<User | null> {
        return this.usersRepository.findOneBy({id})
    }

    update(id: number, user: Partial<User>): Promise<any> {
        return this.usersRepository.update(id, user);
    }

    softDelete(id: number): Promise<any> {
        return this.usersRepository.update(id, {isActive: false});
    }

    /* ----------------------------------------------------------------------------------------------------------------------------
    
        15/10/2024 - API login to admin
        
    -------------------------------------------------------------------------------------------------------------------------------*/

    // Create user
    async create(createUser: CreateUserDto): Promise<User> {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(createUser.password, salt);

        return this.usersRepository.save({ 
            ...createUser, 
            password: hashedPassword,
            isAdmin: createUser.isAdmin ?? false,
        });
    }

    // Admin login
    async loginAdmin(loginDto: SigninDto): Promise<User | null> {
        const { email, password } = loginDto;
        const user = await this.usersRepository.findOne({where: {email, isAdmin: true}});

        if (user && (await bcrypt.compare(password, user.password))) {
            return user;
        }

        return null;
    }
}
