import { DataSource } from "typeorm";
import { User } from "src/user/user.entity";
import { Task } from "src/task/task.entity";

import * as dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
    type: process.env.DB_TYPE as 'mysql',
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT!,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [User, Task],
    migrations: ['src/migartions/*.ts'],
    synchronize: false,
});

AppDataSource.initialize();