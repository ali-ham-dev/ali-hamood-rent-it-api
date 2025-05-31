import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
dotenv.config();

const {
    DB_HOST = 'localhost',
    DB_PORT = 3306,
    DB_USER = 'root',
    DB_PASSWORD = '',
    DB_NAME = 'rent_it_db'
} = process.env;

async function setupDatabase() {
    try {
        const connection = await mysql.createConnection({
            host: DB_HOST,
            port: DB_PORT,
            user: DB_USER,
            password: DB_PASSWORD
        });

        console.log('');
        console.log('--------------------------------');
        console.log('npm install knex mysql2 dotenv');
        console.log('npx knex init');
        console.log('Packages for auth: npm install jsonwebtoken bcryptjs');
        console.log('--------------------------------');
        console.log('');

        console.log('Connected to MySQL server');

        await connection.query(`DROP DATABASE IF EXISTS ${DB_NAME}`);
        console.log(`Database '${DB_NAME}' droped or doesn't exist.`);
        await connection.query(`CREATE DATABASE ${DB_NAME}`);
        console.log(`Database '${DB_NAME}' created.`);

        await connection.query(`USE ${DB_NAME}`);
        console.log(`Using database '${DB_NAME}'`);

        await connection.end();
        console.log('Initial connection closed');
        console.log('Create a migration: npx knex migrate:make <migration_file_name>');
        console.log('Run migrations: npx knex migrate:latest');
        console.log('Run seeds: npx knex seed:make <seed_file_name>');
        console.log('Run seeds: npx knex seed:run');
        console.log('End of setup');

    } catch (error) {
        console.error('Error during setup:', error);
    }
}

setupDatabase(); 