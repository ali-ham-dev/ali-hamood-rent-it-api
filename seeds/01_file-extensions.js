import dotenv from 'dotenv';

/**
 * @param { import('knex').knex } knex
 * @returns { Promise<void> }
 */

export async function seed(knex) {
    await knex('image_file_extensions').del();
    await knex('image_file_extensions').insert([
        {
            "extension": "jpg"
        },
        {
            "extension": "jpeg"
        },
        {
            "extension": "png"
        },
        {
            "extension": "gif"
        },
        {
            "extension": "bmp"
        },
        {
            "extension": "svg"
        },
        {
            "extension": "webp"
        }
    ]);

    await knex('video_file_extensions').del();
    await knex('video_file_extensions').insert([
        {
            "extension": "mp4"
        },
        {
            "extension": "webm"
        },
        {
            "extension": "ogg"
        },
        {
            "extension": "mov"
        },
        {
            "extension": "avi"
        }
    ]);
}