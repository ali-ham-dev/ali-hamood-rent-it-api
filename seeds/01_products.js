/**
 * @param { import('knex').knex } knex
 * @returns { Promise<void> }
 */

export async function seed(knex) {
    await knex('products').del();
    await knex('products').insert([
        {
            "id": 1,
            "media": JSON.stringify([
                `http://${process.env.IP}:${process.env.PORT}/public/assets/images/products/product-1/uav-1.png`,
                `http://${process.env.IP}:${process.env.PORT}/public/assets/images/products/product-1/uav-2.png`,
                `http://${process.env.IP}:${process.env.PORT}/public/assets/images/products/product-1/uav-3.png`,
                `http://${process.env.IP}:${process.env.PORT}/public/assets/images/products/product-1/uav-4.png`,
                `http://${process.env.IP}:${process.env.PORT}/public/assets/images/products/product-1/uav-5.png`,
                `http://${process.env.IP}:${process.env.PORT}/public/assets/images/products/product-1/uav-6.png`,
                `http://${process.env.IP}:${process.env.PORT}/public/assets/images/products/product-1/uav-7.png`
            ]),
            "title": "NAFYRE N11 PRO GPS Drone",
            "tags": JSON.stringify(["uav", "drone", "gps", "camera", "video", "photo"]),
            "description": "",
            "details": "",
            "specifications": "",
            "cost": 100,
            "charge_frequency": "monthly",
            "is_active": true,
            "created_at": "2021-01-01",
            "updated_at": "2021-01-01",
            // "user_id": "",
            // "store_id": "",
            // "history_id": "",
            // "legal_id": ""
        }
    ]);
}