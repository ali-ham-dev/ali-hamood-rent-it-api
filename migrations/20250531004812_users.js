/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    return knex.schema
        .createTable('users', (table) => {
            table.increments('id').primary();
            table.string('firstName').notNullable().defaultTo('');
            table.string('lastName').notNullable().defaultTo('');
            table.string('email').notNullable().defaultTo('');
            table.string('phone').notNullable().defaultTo('');
            table.string('password').notNullable().defaultTo('');
            table.timestamp('createdAt').defaultTo(knex.fn.now());
            table.timestamp('lastLogin').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
            table.boolean('isActive').notNullable().defaultTo(true);
        })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    return knex.schema
        .dropTableIfExists('users');
}
