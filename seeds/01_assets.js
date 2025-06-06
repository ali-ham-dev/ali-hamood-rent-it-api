import dotenv from 'dotenv';

/**
 * @param { import('knex').knex } knex
 * @returns { Promise<void> }
 */

export async function seed(knex) {
    await knex('assets').del();
    await knex('assets').insert([
        {
            "id": 1,
            "title": "NAFYRE N11 PRO GPS Drone",
            "media": JSON.stringify([
                `http://${process.env.SERVER_MEDIA_HOST}:${process.env.SERVER_MEDIA_PORT}/assets/images/products/product-1/uav-1.png`,
                `http://${process.env.SERVER_MEDIA_HOST}:${process.env.SERVER_MEDIA_PORT}/assets/images/products/product-1/uav-2.png`,
                `http://${process.env.SERVER_MEDIA_HOST}:${process.env.SERVER_MEDIA_PORT}/assets/images/products/product-1/uav-3.png`,
                `http://${process.env.SERVER_MEDIA_HOST}:${process.env.SERVER_MEDIA_PORT}/assets/images/products/product-1/uav-4.png`,
                `http://${process.env.SERVER_MEDIA_HOST}:${process.env.SERVER_MEDIA_PORT}/assets/images/products/product-1/uav-5.png`,
                `http://${process.env.SERVER_MEDIA_HOST}:${process.env.SERVER_MEDIA_PORT}/assets/images/products/product-1/uav-6.png`,
                `http://${process.env.SERVER_MEDIA_HOST}:${process.env.SERVER_MEDIA_PORT}/assets/images/products/product-1/uav-7.png`,
                `http://${process.env.SERVER_MEDIA_HOST}:${process.env.SERVER_MEDIA_PORT}/assets/images/products/product-1/uav-8.mov`,
                `http://${process.env.SERVER_MEDIA_HOST}:${process.env.SERVER_MEDIA_PORT}/assets/images/products/product-1/uav-9.mov`
            ]),
            "price": 100,
            "period": "month",
            "description": "Designed with a unique material composition, the N11 PRO is a remarkably valuable mid-sized GPS drone (not mini ones). Its weight is kept under 0.55lb, eliminating the need for FAA registration. This drone provides a perfect solution for hassle-free flying in the States without FAA, making it ideal for capturing stunning footage on the go. Enduring alloy brushless motors feature strong wind resistance and provides a faster, quieter while more powerful flight. Equipped with 3 batteries to provide up to 90 minutes of flight time, plus a long control range of 3328 Feet, let your drone swim in the sky freely.",
            "is_rented": false,
            "user_id": 1,
            "rented_by_user_id": 0
        }
    ]);
}