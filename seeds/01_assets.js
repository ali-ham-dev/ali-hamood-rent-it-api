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
            "metadata": {
                "tags": ["uav", "drone", "gps", "camera", "video", "photo"]
            },
            "media": {
                "images": [
                    `http://${process.env.SERVER_MEDIA_HOST}:${process.env.SERVER_MEDIA_PORT}/assets/images/products/product-1/uav-1.png`,
                    `http://${process.env.SERVER_MEDIA_HOST}:${process.env.SERVER_MEDIA_PORT}/assets/images/products/product-1/uav-2.png`,
                    `http://${process.env.SERVER_MEDIA_HOST}:${process.env.SERVER_MEDIA_PORT}/assets/images/products/product-1/uav-3.png`,
                    `http://${process.env.SERVER_MEDIA_HOST}:${process.env.SERVER_MEDIA_PORT}/assets/images/products/product-1/uav-4.png`,
                    `http://${process.env.SERVER_MEDIA_HOST}:${process.env.SERVER_MEDIA_PORT}/assets/images/products/product-1/uav-5.png`,
                    `http://${process.env.SERVER_MEDIA_HOST}:${process.env.SERVER_MEDIA_PORT}/assets/images/products/product-1/uav-6.png`,
                    `http://${process.env.SERVER_MEDIA_HOST}:${process.env.SERVER_MEDIA_PORT}/assets/images/products/product-1/uav-7.png`
                ],
                "videos": []
            },
            "asset": {
                "title": "NAFYRE N11 PRO GPS Drone",
                "description": "Designed with a unique material composition, the N11 PRO is a remarkably valuable mid-sized GPS drone (not mini ones). Its weight is kept under 0.55lb, eliminating the need for FAA registration. This drone provides a perfect solution for hassle-free flying in the States without FAA, making it ideal for capturing stunning footage on the go. Enduring alloy brushless motors feature strong wind resistance and provides a faster, quieter while more powerful flight. Equipped with 3 batteries to provide up to 90 minutes of flight time, plus a long control range of 3328 Feet, let your drone swim in the sky freely.",
                "specifications": {
                    "manufacturer": "NAFYRE",
                    "asset dimensions": "12 x 7.5 x 5 cm",
                    "weight": "180g",
                    "battery": "3.7V 11.1Wh",
                    "battery type": "Li-Po",
                    "battery capacity": "2500mAh",
                    "battery charge time": "30 minutes",
                    "flight time": "10 minutes",
                    "max speed": "10 m/s",
                    "max flight altitude": "1000m",
                    "max flight distance": "1000m",
                    "max flight time": "10 minutes",
                    "max flight speed": "10 m/s",
                },
                "documents": {
                    "Transportation Instructions": [],
                    "How to Use": [],
                    "User Manual": [],
                    "Contract Terms": [],
                },
                "billing": {
                    "price": 100,
                    "billing_frequency": "month",
                },
                "location": {
                    "address": "123 Main St, Anytown, Canada",
                    "city": "Anytown",
                    "state": "ON",
                    "country": "Canada",
                    "postal_code": "M5A 1A1",
                    "latitude": 43.65107,
                    "longitude": -79.347015,
                }
            },
            "rented": false,
            "is_active": true,
            "created_at": "2023-01-01",
            "updated_at": "2023-01-01",
        }
    ]);
}

// "user_id": "",
// "rented_by_user_id": "",
// "store_id": "",
// for user --> "history_id": "",

// "biiling": {
//     "price": 100,
//     "billing_frequency": "month",
//     "billing_cycle": 1,
//     "billing_start_date": "2021-01-01",
//     "billing_end_date": "2021-01-01",
//     "billing_status": "active",
//     "billing_method": "credit_card",
//     "billing_address": "123 Main St, Anytown, USA",
//     "billing_city": "Anytown",
// }