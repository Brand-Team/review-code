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

    // Create user
    createUser(user: CreateUserDto): Promise<User> {
        return this.usersRepository.save({
            ...user,
            isAdmin: user.isAdmin ?? false,
        })
    }

    // Edit user
    async editUser(id: number, editUser: Partial<CreateUserDto>): Promise<any> {
        await this.usersRepository.update(id, editUser);
        return this.usersRepository.findOneBy({ id });
    }

    // Delete user
    async softDelete(id: number): Promise<any> {
        await this.usersRepository.update(id, { isActive: false });
        return this.usersRepository.findOneBy({id});
    }

    // Show users list
    async findAll(
        page: number = 1,
        limit: number = 10,
        username?: string,
        email?: string,
    ): Promise<{data: User[]; total: number; page: number; totalPages: number}> {
        const queryBuilder = this.usersRepository.createQueryBuilder('user');

        if (username) {
            queryBuilder.andWhere('user.username ILIKE :username', {
                username: `%${username}%`
            });
        }

        if (email) {
            queryBuilder.andWhere('user.email ILIKE :email', {
                email: `%${email}%`
            });
        }

        const skip = (page - 1) * limit;

        const total = await queryBuilder.getCount();

        const data = await queryBuilder
            .skip(skip)
            .take(limit)
            .getMany();

        return {
            data,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        }
    }

}
