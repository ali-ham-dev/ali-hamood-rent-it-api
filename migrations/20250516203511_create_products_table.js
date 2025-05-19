/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    return knex.schema
        .createTable('assets', (table) => {
            table.increments('id').primary();
            table.text('media').notNullable().defaultTo('');
            table.string('title').notNullable().defaultTo('');
            table.string('tags').notNullable().defaultTo('');
            table.string('description').notNullable().defaultTo('');
            table.string('details').notNullable().defaultTo('');
            table.string('specifications').notNullable().defaultTo('');
            table.integer('cost').unsigned().notNullable().defaultTo(0);
            table.string('charge_frequency').notNullable().defaultTo('monthly');
            table.string('street_address').notNullable().defaultTo('');
            table.string('city').notNullable().defaultTo('');
            table.string('state').notNullable().defaultTo('');
            table.string('postal_code').notNullable().defaultTo('');
            table.string('country').notNullable().defaultTo('');
            table.string('latitude').notNullable().defaultTo('');
            table.string('longitude').notNullable().defaultTo('');
            table.integer('qty').unsigned().notNullable().defaultTo(1);
            table.boolean('is_active').notNullable().defaultTo(true);
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
            // table.integer('user_id').unsigned().references('id').inTable('users').onUpdate('CASCADE').onDelete('CASCADE');
            // table.integer('store_id').unsigned().references('id').inTable('stores').onUpdate('CASCADE').onDelete('CASCADE');
            // table.integer('history_id').unsigned().references('id').inTable('history').onUpdate('CASCADE').onDelete('CASCADE');
            // table.integer('legal_id').unsigned().references('id').inTable('legal').onUpdate('CASCADE').onDelete('CASCADE');
        })
        .createTable('image_file_extensions', (table) => {
            table.increments('id').primary();
            table.string('extension').notNullable().defaultTo('');
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
        })
        .createTable('video_file_extensions', (table) => {
            table.increments('id').primary();
            table.string('extension').notNullable().defaultTo('');
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
        });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    return knex.schema
        .dropTableIfExists('assets')
        .dropTableIfExists('image_file_extensions')
        .dropTableIfExists('video_file_extensions');
}
