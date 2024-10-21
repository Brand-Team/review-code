import { DataSource, DataSourceOptions } from "typeorm";
import * as dotenv from 'dotenv';

dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '1',
  port: parseInt(process.env.DB_PORT) || 3307,
  database: process.env.DB_DATABASE || 'intern',
  entities: ['dist/src/entities/*.entity.js'],
  migrations: ['dist/db/migrations/*.js'],
}

const dataSource = new DataSource(dataSourceOptions)
export default dataSource