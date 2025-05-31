/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    return knex.schema
        .createTable('users', (table) => {
            table.increments('id').primary();
            table.string('firstName').notNullable();
            table.string('lastName').notNullable();
            table.string('email').notNullable().unique();
            table.string('phone').notNullable();
            table.string('password').notNullable();
            table.string('emailVerificationToken').nullable();
            table.timestamp('emailVerificationTokenExpires').nullable();
            table.string('passwordResetToken').nullable();
            table.timestamp('passwordResetTokenExpires').nullable();
            table.timestamp('createdAt').defaultTo(knex.fn.now());
            table.timestamp('updatedAt').defaultTo(knex.fn.now());
            table.timestamp('lastLogin').nullable();
        });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    return knex.schema
        .dropTableIfExists('users');
}
