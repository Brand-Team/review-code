import { DataSource, DataSourceOptions } from "typeorm";

export const dataSourceOptions: DataSourceOptions = {
  type: 'mariadb',
  host: 'localhost',
  username: 'khoi',
  password: '1',
  port: 3307,
  database: 'intern',
  entities: ['dist/src/entities/*.entity.js'],
  migrations: ['dist/db/migrations/*.js'],
}

const dataSource = new DataSource(dataSourceOptions)
export default dataSource