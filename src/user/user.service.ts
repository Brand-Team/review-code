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

    findOne(id: number): Promise<User | null> {
        return this.usersRepository.findOneBy({id})
    }

    update(id: number, user: Partial<User>): Promise<any> {
        return this.usersRepository.update(id, user);
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

  // Create user
  createUser(createUser: CreateUserDto): Promise<User> {
    return this.usersRepository.save({
      ...createUser,
      isAdmin: createUser.isAdmin ?? false,
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
    return this.usersRepository.findOneBy({ id });
  }

  // Show users list
  async findAll(
    username?: string,
    email?: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ users: User[]; total: number }> {

    const queryBuilder = this.usersRepository.createQueryBuilder('user');

    if (username) {
      queryBuilder.andWhere('user.username LIKE :username', { username: `%${username}%` });
    }

    if (email) {
      queryBuilder.andWhere('user.email LIKE :email', { email: `%${email}%` });
    }

    const [users, total] = await queryBuilder
      .skip((page - 1) * limit) // Calculate how many records to skip based on the page number
      .take(limit) // Limit the number of records to return
      .getManyAndCount(); // Fetch the users and the total count

    return { users, total }; // Return both users and total count for pagination
  }
}
