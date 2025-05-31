/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    return knex.schema
        .createTable('assets', (table) => {
            table.increments('id').primary();
            table.json('metadata').notNullable().defaultTo();
            table.json('media').notNullable().defaultTo();
            table.json('asset').notNullable().defaultTo();
            table.boolean('rented').notNullable().defaultTo(false);
            table.boolean('is_active').notNullable().defaultTo(true);
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
        })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    return knex.schema
        .dropTableIfExists('assets');
}
