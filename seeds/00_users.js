import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

/**
 * @param { import('knex').knex } knex
 * @returns { Promise<void> }
 */

export async function seed(knex) {
    await knex('users').del();

    const hashedPassword = await bcrypt.hash('1234', 10);
    await knex('users').insert([
        {
            "firstName": "Ali",
            "lastName": "ham",
            "email": "ali@gmail.com",
            "phone": "1234567890",
            "password": hashedPassword,
            "verificationRequested": false,
            "createdAt": new Date(),
            "updatedAt": new Date(),
            "lastLogin": new Date()
        },
        {
            "firstName": "John",
            "lastName": "Doe",
            "email": "john@gmail.com",
            "phone": "1234567890",
            "password": hashedPassword,
            "verificationRequested": false,
            "createdAt": new Date(),
            "updatedAt": new Date(),
            "lastLogin": new Date()
        },
        {
            "firstName": "Ben",
            "lastName": "Smith",
            "email": "ben@gmail.com",
            "phone": "1234567890",
            "password": hashedPassword,
            "verificationRequested": false,
            "createdAt": new Date(),
            "updatedAt": new Date(),
            "lastLogin": new Date()
        }
    ]);
}