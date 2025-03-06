import config from '../config';
import mysql from 'mysql2/promise';
import { Sequelize } from 'sequelize';
import { initUserModel } from '../users/user.model';

interface DatabaseConfig {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
}

const db: { User?: ReturnType<typeof initUserModel>; sequelize?: Sequelize } = {};
export default db;

async function initialize(): Promise<void> {
    const { host, port, user, password, database } = config.database as DatabaseConfig;


    const connection = await mysql.createConnection({ host, port, user, password });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
    await connection.end();

 
    const sequelize = new Sequelize(database, user, password, { dialect: 'mysql' });
    db.sequelize = sequelize;


    db.User = initUserModel(sequelize);


    await sequelize.sync({ alter: true });
    console.log('Database initialized successfully');
}

initialize().catch((err) => console.error('Database initialization failed:', err));