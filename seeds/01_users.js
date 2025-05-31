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
            "lastName": "Hamood",
            "email": "alihamood96@gmail.com",
            "phone": "1234567890",
            "password": hashedPassword,
            "createdAt": new Date(),
            "updatedAt": new Date(),
            "lastLogin": new Date()
        },
        {
            "firstName": "Test",
            "lastName": "User",
            "email": "test@example.com",
            "phone": "9876543210",
            "password": hashedPassword,
            "createdAt": new Date(),
            "updatedAt": new Date(),
            "lastLogin": new Date()
        }
    ]);
}