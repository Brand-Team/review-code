import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user/user.entity";
import { Task } from "./task/task.entity";
import { UserModule } from "./user/user.module";
import { TaskModule } from "./task/task.module";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '1',
      database: 'cms',
      entities: [User, Task],
      migrations: ['dist/migrations/*.js'],
      synchronize: false,
    }),
    UserModule,
    TaskModule,
  ],
})

export class AppModule {}