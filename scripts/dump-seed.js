import knex from 'knex';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create knex instance using your database configuration
const db = knex({
    client: 'mysql2',
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    }
});

async function dumpTableToSeed(tableName) {
    try {
        // Get all records from the table
        const records = await db(tableName).select('*');
        
        // Remove created_at and updated_at from each record
        const cleanedRecords = records.map(record => {
            const { created_at, updated_at, ...rest } = record;
            return rest;
        });
        
        // Format the data for the seed file
        const seedContent = `import dotenv from 'dotenv';

/**
 * @param { import('knex').knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
    await knex('${tableName}').del();
    await knex('${tableName}').insert(${JSON.stringify(cleanedRecords, null, 4)});
}`;

        // Create the seed file in the same directory as the script
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const seedFileName = path.join(__dirname, `${tableName}_${timestamp}.js`);
        
        // Check if file exists before writing
        if (fs.existsSync(seedFileName)) {
            console.log(`File ${seedFileName} already exists, skipping...`);
            return;
        }
        
        fs.writeFileSync(seedFileName, seedContent);
        console.log(`Successfully dumped ${tableName} to ${seedFileName}`);
    } catch (error) {
        console.error(`Error dumping ${tableName}:`, error);
    }
}

// Example usage
async function main() {
    try {
        // Dump each table you want to seed
        await dumpTableToSeed('assets');
        // Add more tables as needed
        // await dumpTableToSeed('users');
        // await dumpTableToSeed('other_table');
        
        // Close the database connection
        await db.destroy();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

main(); 