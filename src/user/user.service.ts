import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities';
import { Repository } from 'typeorm';
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

    async softDelete(id: number): Promise<any> {
        await this.usersRepository.update(id, {isActive: false});
        return this.findOne(id);
    }

    // Old Create user function
    async create(createUser: CreateUserDto): Promise<User> {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(createUser.password, salt);

        return this.usersRepository.save({ 
            ...createUser, 
            password: hashedPassword,
            isAdmin: createUser.isAdmin ?? false,
        });
    }

//     // Create user
//     createUser(createUser: CreateUserDto): Promise<User> {
//         return this.usersRepository.save({
//             ...createUser,
//             isAdmin: createUser.isAdmin ?? false,
//         })
//     }

//     // Edit user
//     editUser(id: number, editUser: EditUserDto): Promise<any> {
//         return this.usersRepository.update(id, editUser);
//     }
}
