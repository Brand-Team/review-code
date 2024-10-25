import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
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
    
    // Create user
    async createUser(inputUser: CreateUserDto): Promise<Object> {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(inputUser.password, salt);

        try {
            const user = await this.usersRepository.save({
                ...inputUser,
                password: hashedPassword,
                isAdmin: inputUser.isAdmin ?? false,
            })
    
            return {
                id: user.id,
                username: user.username,
                email: user.email,
                isAdmin: user.isAdmin
            }
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new ConflictException('Email already exists')
            };

            throw new ConflictException('password');
        }
    }

    // Edit user
    async editUser(id: number, editUser: Partial<CreateUserDto>): Promise<any> {

        if (editUser.password) {
            const salt = await bcrypt.genSalt();
            editUser.password = await bcrypt.hash(editUser.password, salt);
        }

        try {
            await this.usersRepository.update(id, editUser);
            const user = await this.usersRepository.findOneBy({ id });

            return {
                id: user.id,
                username: user.username,
                email: user.email,
                isAdmin: user.isAdmin
            } 
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new ConflictException('Email already exists')
            };
        }
    }

    // Delete user
    async softDelete(id: number): Promise<any> {
        await this.usersRepository.update(id, { isActive: false });
        const user = await this.usersRepository.findOneBy({ id });

        return {
            id: user.id,
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin
        } 
    }

    // Show users list
    async findAll(
        page: number = 1,
        limit: number = 10,
        username?: string,
        email?: string,
    ): Promise<{users: {id: number; username: string; email: string; isAdmin: boolean}[]; total: number; page: number; totalPages: number}> {
        const queryBuilder = this.usersRepository.createQueryBuilder('user');

        queryBuilder
            .select(['user.id', 'user.username', 'user.email', 'user.isAdmin'])
            .where('user.isActive = :isActive', { isActive: true });

        if (username) {
            queryBuilder.andWhere('user.username LIKE :username', {
                username: `%${username}%`
            });
        }

        if (email) {
            queryBuilder.andWhere('user.email LIKE :email', {
                email: `%${email}%`
            });
        }

        const skip = (page - 1) * limit;

        const [users, total] = await queryBuilder
            .skip(skip)
            .take(limit)
            .getManyAndCount();

        return {
            users,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        }
    }

}
