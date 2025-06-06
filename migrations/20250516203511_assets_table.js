/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    return knex.schema
        .createTable('assets', (table) => {
            table.increments('id').primary();
            table.string('title').notNullable().defaultTo('');
            table.json('media').notNullable().defaultTo([]);
            table.string('price').notNullable().defaultTo('');
            table.string('period').notNullable().defaultTo('');
            table.text('description').notNullable().defaultTo('');
            table.boolean('is_rented').notNullable().defaultTo(false);
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
            table.integer('user_id').notNullable().unsigned();
            table.integer('rented_by_user_id').notNullable().unsigned();
            table.foreign('user_id')
                .references('id')
                .inTable('users')
                .onDelete('CASCADE')
                .onUpdate('CASCADE');
                
            table.foreign('rented_by_user_id')
                .references('id')
                .inTable('users')
                .onDelete('SET NULL')
                .onUpdate('CASCADE');
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
