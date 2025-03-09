import 'reflect-metadata';
import { DataSource } from 'typeorm';
import config from '../config';
import { User } from '../users/user.model';

interface DatabaseConfig {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
}

const { host, port, user, password, database } = config.database as DatabaseConfig;

export const AppDataSource = new DataSource({
    type: 'mysql',
    host,
    port,
    username: user,
    password,
    database,
    synchronize: true, // Automatically sync database schema
    logging: true,
    entities: [User], // Add all entities here
    subscribers: [],
    migrations: [],
});

// Initialize the database connection
AppDataSource.initialize()
    .then(() => {
        console.log('Database connection established successfully');
    })
    .catch((err) => {
        console.error('Failed to connect to the database:', err);
    });