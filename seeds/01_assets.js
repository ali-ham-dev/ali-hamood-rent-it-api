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
                "http://127.0.0.1:9090/assets/media/1/uav-1.png",
                "http://127.0.0.1:9090/assets/media/1/uav-2.png",
                "http://127.0.0.1:9090/assets/media/1/uav-3.png",
                "http://127.0.0.1:9090/assets/media/1/uav-4.png",
                "http://127.0.0.1:9090/assets/media/1/uav-5.png",
                "http://127.0.0.1:9090/assets/media/1/uav-6.png",
                "http://127.0.0.1:9090/assets/media/1/uav-7.png",
                "http://127.0.0.1:9090/assets/media/1/uav-8.mov",
                "http://127.0.0.1:9090/assets/media/1/uav-9.mov"
            ]),
            "price": 100,
            "period": "month",
            "description": "Designed with a unique material composition, the N11 PRO is a remarkably valuable mid-sized GPS drone (not mini ones). Its weight is kept under 0.55lb, eliminating the need for FAA registration. This drone provides a perfect solution for hassle-free flying in the States without FAA, making it ideal for capturing stunning footage on the go. Enduring alloy brushless motors feature strong wind resistance and provides a faster, quieter while more powerful flight. Equipped with 3 batteries to provide up to 90 minutes of flight time, plus a long control range of 3328 Feet, let your drone swim in the sky freely.",
            "is_rented": false,
            "user_id": 1,
            "rented_by_user_id": 1
        },
        {
            "id": 2,
            "title": "Pelican - Bass Raider 10E Angler Fishing",
            "media": JSON.stringify([
                "http://127.0.0.1:9090/assets/media/2/screenshot-2025-06-10-at-80310am-1749569470275.png",
                "http://127.0.0.1:9090/assets/media/2/screenshot-2025-06-10-at-80320am-1749569470288.png"
            ]),
            "price": 122,
            "period": "day",
            "description": "<ul class=\"a-unordered-list a-vertical a-spacing-mini\">\n<li class=\"a-spacing-mini\"><span class=\"a-list-item\">Durable: Our patented RAM-X material is known for its high-impact resistance and will make your fishing boat last through time.</span></li>\n<li class=\"a-spacing-mini\"><span class=\"a-list-item\">Comfortable: Navigate in comfort with two folding seats that can slide along the tracks so you can adjust your position on the boat. This comfortable seat also swivels 360 degrees so you can face any direction while you're fishing or reaching for equipment. Additional features include multiple storage compartments, drink holders and two vertical rod holders for your convenience.</span></li>\n</ul>",
            "is_rented": false,
            "user_id": 1,
            "rented_by_user_id": 1
        },
        {
            "id": 3,
            "title": " MAGE MALE Mens Suits Slim Fit 3 Piece Tuxedo Suit One Button Solid Prom Wedding Party Blazer Vest Pants Set with Tie",
            "media": JSON.stringify([
                "http://127.0.0.1:9090/assets/media/3/screenshot-2025-06-10-at-83248am-1749569660548.png",
                "http://127.0.0.1:9090/assets/media/3/screenshot-2025-06-10-at-83315am-1749569660558.png"
            ]),
            "price": 100,
            "period": "day",
            "description": "<p><span class=\"a-list-item a-size-base a-color-base\"><strong>Tailored to Perfection: </strong>The MAGE MALE 3-Piece Slim Fit Suit Set offers a tailored fit that enhances your physique while maintaining comfort. The notched lapel, one-button closure and dual back vents of suit jacket enhance breathability and freedom of movement, showcasing a blend of timeless style and practicality</span></p>",
            "is_rented": false,
            "user_id": 1,
            "rented_by_user_id": 1
        },
        {
            "id": 4,
            "title": "Cordless Drill Set, 20V Electric Power Drill with Battery And Charger",
            "media": JSON.stringify([
                "http://127.0.0.1:9090/assets/media/4/screenshot-2025-06-10-at-83454am-1749569756036.png"
            ]),
            "price": 29,
            "period": "week",
            "description": "<p><span class=\"a-list-item\">POWERFUL TORQUE AND 2.0 Ah Battery: FADAKWALT cordless drill features a 20 V battery and delivers 30 N.m torque; The settings offer precise control for screwing in/out and for effortless drilling into wood, ceramics, plastics, and even metal</span></p>\n<p><span class=\"a-list-item\">21+1 Position Clutch: 21+1 torque settings power drill can provide more precise torque or speed adjustment as required, which helps to prevent sinking a screw too deep, stripping out the head of a screw or even breaking a screw shaft</span></p>",
            "is_rented": false,
            "user_id": 1,
            "rented_by_user_id": 1
        },
        {
            "id": 5,
            "title": "HTC Vive Pro Focus Plus 6DOF VR Headset in Almond White Bundle Including VR Headset, Controllers, face Cushion, QC 3.0 Charger and USB Type-C Cable",
            "media": JSON.stringify([
                "http://127.0.0.1:9090/assets/media/5/screenshot-2025-06-10-at-83728am-1749569961994.png"
            ]),
            "price": 12,
            "period": "day",
            "description": "<table class=\"a-normal a-spacing-micro\">\n<tbody>\n<tr class=\"a-spacing-small po-brand\">\n<td class=\"a-span3\"><span class=\"a-size-base a-text-bold\">Brand</span></td>\n<td class=\"a-span9\"><span class=\"a-size-base po-break-word\">HTC</span></td>\n</tr>\n<tr class=\"a-spacing-small po-color\">\n<td class=\"a-span3\"><span class=\"a-size-base a-text-bold\">Color</span></td>\n<td class=\"a-span9\"><span class=\"a-size-base po-break-word\">White</span></td>\n</tr>\n<tr class=\"a-spacing-small po-special_feature\">\n<td class=\"a-span3\"><span class=\"a-size-base a-text-bold\">Special Feature</span></td>\n<td class=\"a-span9\"><span class=\"a-size-base po-break-word\">Adjustable Headband</span></td>\n</tr>\n<tr class=\"a-spacing-small po-connectivity_technology\">\n<td class=\"a-span3\"><span class=\"a-size-base a-text-bold\">Connectivity Technology</span></td>\n<td class=\"a-span9\"><span class=\"a-size-base po-break-word\">Usb</span></td>\n</tr>\n<tr class=\"a-spacing-small po-included_components\">\n<td class=\"a-span3\"><span class=\"a-size-base a-text-bold\">Included Components</span></td>\n<td class=\"a-span9\"><span class=\"a-size-base po-break-word\">Grip, Cable, Controller</span></td>\n</tr>\n<tr class=\"a-spacing-small po-compatible_devices\">\n<td class=\"a-span3\"><span class=\"a-size-base a-text-bold\">Compatible Devices</span></td>\n<td class=\"a-span9\"><span class=\"a-size-base po-break-word\">Personal Computer</span></td>\n</tr>\n<tr class=\"a-spacing-small po-specific_uses_for_product\">\n<td class=\"a-span3\"><span class=\"a-size-base a-text-bold\">Specific Uses For Product</span></td>\n<td class=\"a-span9\"><span class=\"a-size-base po-break-word\">Gaming</span></td>\n</tr>\n<tr class=\"a-spacing-small po-age_range_description\">\n<td class=\"a-span3\"><span class=\"a-size-base a-text-bold\">Age Range (Description)</span></td>\n<td class=\"a-span9\"><span class=\"a-size-base po-break-word\">Adult</span></td>\n</tr>\n<tr class=\"a-spacing-small po-model_name\">\n<td class=\"a-span3\"><span class=\"a-size-base a-text-bold\">Model Name</span></td>\n<td class=\"a-span9\"><span class=\"a-size-base po-break-word\">focus,vive</span></td>\n</tr>\n<tr class=\"a-spacing-small po-operating_system\">\n<td class=\"a-span3\"><span class=\"a-size-base a-text-bold\">Operating System</span></td>\n<td class=\"a-span9\"><span class=\"a-size-base po-break-word\">Windows 10</span></td>\n</tr>\n</tbody>\n</table>\n<p>&nbsp;</p>",
            "is_rented": false,
            "user_id": 2,
            "rented_by_user_id": 2
        },
        {
            "id": 6,
            "title": "Petmate Sky Kennel - For Air and Travel, Airline Approved Dog Crate for Pets up",
            "media": JSON.stringify([
                "http://127.0.0.1:9090/assets/media/6/screenshot-2025-06-10-at-84404am-1749570307959.png"
            ]),
            "price": 10,
            "period": "week",
            "description": "<p><span class=\"a-list-item\">FIRST-CLASS COMFORT FOR PETS: The Petmate Sky Kenne meet IATA standards and most airline cargo specifications, providing secure air travel for pets; it includes 360-degree ventilation and tie-down strap holes</span></p>",
            "is_rented": false,
            "user_id": 2,
            "rented_by_user_id": 2
        },
        {
            "id": 7,
            "title": "[Auto Focus/4K Support] Projector with WiFi 6 and Bluetooth 5.2, YABER Pro V9 600 ANSI Native 1080P",
            "media": JSON.stringify([
                "http://127.0.0.1:9090/assets/media/7/screenshot-2025-06-10-at-84635am-1749570465422.png",
                "http://127.0.0.1:9090/assets/media/7/screenshot-2025-06-10-at-84653am-1749570465429.png"
            ]),
            "price": 278,
            "period": "year",
            "description": "<p>latest AI optical algorithms, paired with German high-transmittance lens, boasting an impressive 600 ANSI lumens of brightness. Features native 1080P resolution and support for 4K movie playback, the V9 delivers a 20000:1 high contrast ratio for perfect detailing. Also, our projector offers a wide color gamut, including 121% sRGB and 99% NTSC, ensuring the most precise color reproduction possible.</p>",
            "is_rented": false,
            "user_id": 2,
            "rented_by_user_id": 2
        },
        {
            "id": 8,
            "title": "BESTMIG 135A Welder 3-in-1 Welding Machine Supports MIG 110V Welding Machine with IGBT Inverter LED Digital Display MIG/Lift TIG/Stick",
            "media": JSON.stringify([
                "http://127.0.0.1:9090/assets/media/8/screenshot-2025-06-10-at-84847am-1749570686628.png",
                "http://127.0.0.1:9090/assets/media/8/screenshot-2025-06-10-at-84900am-1749570686637.png"
            ]),
            "price": 500,
            "period": "month",
            "description": "<p>MIG FLUX-135 is perfect for novice welders, featuring an all-in-one digital technology that automatically adjusts parameters based on your current settings. Easy setup allows you to start welding right away—simply load the wire spool, connect the gun, plug in, and you're ready to go without complicated gas setups.</p>",
            "is_rented": false,
            "user_id": 3,
            "rented_by_user_id": 3
        },
        {
            "id": 9,
            "title": "Pyle Powered Bluetooth PA Speaker Kit - Event Ready - Just Plug In and Play Active and Passive 350w Loudspeakers with",
            "media": JSON.stringify([
                "http://127.0.0.1:9090/assets/media/9/screenshot-2025-06-10-at-85203am-1749570881194.png"
            ]),
            "price": 20,
            "period": "month",
            "description": "<p>Q Settings and separate inputs for customized sound: This heavy duty PA system features a digital LCD display, rear panel rotary dials with push-button control center for MP3 / audio file playback, mic volume, input volume, treble, and bass</p>",
            "is_rented": 1,
            "user_id": 3,
            "rented_by_user_id": 1
        },
        {
            "id": 10,
            "title": "Bluetooth Turntable HiFi System with 36 Watt Bookshelf Speakers, Patend Designed Vinyl Record Player with",
            "media": JSON.stringify([
                "http://127.0.0.1:9090/assets/media/10/screenshot-2025-06-10-at-85517am-1749570952461.png"
            ]),
            "price": 98,
            "period": "day",
            "description": "<p>The built-in switchable phono line allows connecting to included Hi-Fi speakers 36W High power or to your own externally speakers via the dual RCA output cables, ground wire also allow Connect the ground wire in your home with the ground wire of this product, which can reduce sound interference effectively.</p>",
            "is_rented": false,
            "user_id": 3,
            "rented_by_user_id": 3
        }
    ]);
}