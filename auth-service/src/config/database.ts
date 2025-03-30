import { DataSource } from 'typeorm';
import { User } from '../entities/user.entity';
import dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: true, // Không dùng trong production
  logging: true,
  entities: [User],
  subscribers: [],
  migrations: [],
});