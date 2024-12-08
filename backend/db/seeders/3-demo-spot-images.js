'use strict';
const { SpotImage } = require('../models');

/** @type {import('sequelize-cli').Migration} */

let options = {};
options.tableName = 'SpotImage'
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await SpotImage.bulkCreate([
      {
        url: "https://a0.muscache.com/im/pictures/44280510-f5e2-40aa-b1cd-a62a13b346f8.jpg?im_w=1200&im_format=avif",
        spotId: 1,
        preview: true
      },
      {
        url: "https://a0.muscache.com/im/pictures/ad3cb52e-5a4b-49a2-a726-ce3ac83eed71.jpg?im_w=720&im_format=avif",
        spotId: 1,
        preview: false
      },
      {
        url: "https://a0.muscache.com/im/pictures/d1f2a6b1-da85-4e2b-8f56-2f1f79306e68.jpg?im_w=720&im_format=avif",
        spotId: 1,
        preview: false
      },
      {
        url: "https://a0.muscache.com/im/pictures/dd62eb93-908f-4d7b-bc3a-3d45af0394b3.jpg?im_w=720&im_format=avif",
        spotId: 1,
        preview: false
      },
      {
        url: "https://www.airbnb.com/rooms/43310433?adults=2&category_tag=Tag%3A789&children=0&enable_m3_private_room=true&infants=0&pets=0&photo_id=1035757674&search_mode=flex_destinations_search&check_in=2025-03-27&check_out=2025-04-01&source_impression_id=p3_1733435606_P3IitdkpDQbpQAej&previous_page_section_name=1000&modal=PHOTO_TOUR_SCROLLABLE&modalItem=1042189478",
        spotId: 1,
        preview: false
      },
      {
        url: "https://www.airbnb.com/rooms/43310433?adults=2&category_tag=Tag%3A789&children=0&enable_m3_private_room=true&infants=0&pets=0&photo_id=1035757674&search_mode=flex_destinations_search&check_in=2025-03-27&check_out=2025-04-01&source_impression_id=p3_1733435854_P3LqZHAh-L3UWLad&previous_page_section_name=1000&modal=PHOTO_TOUR_SCROLLABLE&modalItem=999710392",
        spotId: 1,
        preview: false
      },
      {
        url: "https://a0.muscache.com/im/pictures/80063e44-7b90-42d2-a1fa-73799cb695c9.jpg?im_w=1200&im_format=avif",
        spotId: 2,
        preview: true
      },
      {
        url: "https://a0.muscache.com/im/pictures/ee3fc4d4-9e0a-4cf7-9610-d6f9b38d19c0.jpg?im_w=720&im_format=avif",
        spotId: 2,
        preview: false
      },
      {
        url: "https://a0.muscache.com/im/pictures/e5522b71-32e5-4f02-a939-5d4472b945f9.jpg?im_w=720&im_format=avif",
        spotId: 2,
        preview: false
      },
      {
        url: "https://a0.muscache.com/im/pictures/bf2f9d10-8e02-45f9-bc78-a043fc34921d.jpg?im_w=1200&im_format=avif",
        spotId: 2,
        preview: false
      },
      {
        url: "https://a0.muscache.com/im/pictures/9cdcbcf2-0a2a-4096-9c3a-48bbf07d2c48.jpg?im_w=720&im_format=avif",
        spotId: 2,
        preview: false
      },
      {
        url: "https://a0.muscache.com/im/pictures/168905c6-874f-4c8b-8a56-de063725c389.jpg?im_w=1200&im_format=avif",
        spotId: 2,
        preview: false
      },
      {
        url: "https://a0.muscache.com/im/pictures/miso/Hosting-851739672197637063/original/4566b3a4-79e1-4da1-9a76-fd7a39da0246.jpeg?im_w=1200&im_format=avif",
        spotId: 3,
        preview: true
      },
      {
        url: "https://a0.muscache.com/im/pictures/miso/Hosting-851739672197637063/original/515febee-99c0-4342-a92b-29c822264a72.jpeg?im_w=1200&im_format=avif",
        spotId: 3,
        preview: false
      },
      {
        url: "https://a0.muscache.com/im/pictures/miso/Hosting-851739672197637063/original/41155d7e-3367-4ffa-a65f-444fc828ce9c.jpeg?im_w=720&im_format=avif",
        spotId: 3,
        preview: false
      },
      {
        url: "https://a0.muscache.com/im/pictures/miso/Hosting-851739672197637063/original/5389320e-cd03-48d2-8eaf-4b9be4143d4e.jpeg?im_w=720&im_format=avif",
        spotId: 3,
        preview: false
      },
      {
        url: "https://www.airbnb.com/rooms/851739672197637063?adults=2&search_mode=regular_search&check_in=2025-01-09&check_out=2025-01-11&source_impression_id=p3_1733438327_P33N4kVC5pM9x2wx&previous_page_section_name=1000&federated_search_id=d027906e-bf0f-49aa-a544-21f3d376cce2&modal=PHOTO_TOUR_SCROLLABLE&modalItem=1630401148",
        spotId: 3,
        preview: false
      },
      {
        url: "https://a0.muscache.com/im/pictures/miso/Hosting-851739672197637063/original/b7f2fa2d-77c2-426e-8139-a3d30369550f.jpeg?im_w=720&im_format=avif",
        spotId: 3,
        preview: false
      },
      {
        url: "https://a0.muscache.com/im/pictures/a9b047c3-0e64-4a3a-8454-f29f027b82fe.jpg?im_w=1200&im_format=avif",
        spotId: 4,
        preview: true
      },
      {
        url: "https://a0.muscache.com/im/pictures/e3c329bb-3663-49c0-8496-422510f7859f.jpg?im_w=720&im_format=avif",
        spotId: 4,
        preview: false
      },
      {
        url: "https://a0.muscache.com/im/pictures/cfbb87e9-b118-4f12-8af6-aa5a87583bb7.jpg?im_w=1200&im_format=avif",
        spotId: 4,
        preview: false
      },
      {
        url: "https://a0.muscache.com/im/pictures/c3d3d4c4-8c11-43a5-b1e5-a1ad747a5692.jpg?im_w=720&im_format=avif",
        spotId: 4,
        preview: false
      },
      {
        url: "https://a0.muscache.com/im/pictures/56ecb64f-4dbf-4a08-95ca-ac147542ac0a.jpg?im_w=1200&im_format=avif",
        spotId: 4,
        preview: false
      },
      {
        url: "https://a0.muscache.com/im/pictures/b10d54f6-5efd-471a-a379-ffea9192ead3.jpg?im_w=1200&im_format=avif",
        spotId: 4,
        preview: false
      },
      {
        url: "https://a0.muscache.com/im/pictures/fe88b22e-95a3-47c9-9221-d4d0cf23eb39.jpg?im_w=1200&im_format=avif",
        spotId: 5,
        preview: true
      },
      {
        url: "https://a0.muscache.com/im/pictures/d220a434-148d-44b5-8e93-e7014381ee8b.jpg?im_w=1200&im_format=avif",
        spotId: 5,
        preview: false
      },
      {
        url: "https://a0.muscache.com/im/pictures/980065ac-ec0e-435c-a456-4219816ec92e.jpg?im_w=720&im_format=avif",
        spotId: 5,
        preview: false
      },
      {
        url: "https://a0.muscache.com/im/pictures/bc1cd36a-5e3e-42bb-aadb-e052d830ea74.jpg?im_w=720&im_format=avif",
        spotId: 5,
        preview: false
      },
      {
        url: "https://a0.muscache.com/im/pictures/411b71ce-6a0b-4fc3-b167-95f48589078d.jpg?im_w=720&im_format=avif",
        spotId: 5,
        preview: false
      },
      {
        url: "https://a0.muscache.com/im/pictures/0d6e5490-10ae-44f5-ac92-abcc4dada237.jpg?im_w=1200&im_format=avif",
        spotId: 5,
        preview: false
      },
      {
        url: "https://a0.muscache.com/im/pictures/prohost-api/Hosting-49942000/original/67ec0f15-2ccd-4b3b-8da0-8e520018b5f8.jpeg?im_w=1200&im_format=avif",
        spotId: 6,
        preview: true
      },
      {
        url: "https://a0.muscache.com/im/pictures/prohost-api/Hosting-49942000/original/8ff814cd-f09f-44f0-a495-5a6b39965eab.jpeg?im_w=720&im_format=avif",
        spotId: 6,
        preview: false
      },
      {
        url: "https://a0.muscache.com/im/pictures/prohost-api/Hosting-49942000/original/0e232f28-2369-4d2b-8f79-16b59d95bca8.jpeg?im_w=720&im_format=avif",
        spotId: 6,
        preview: false
      },
      {
        url: "https://a0.muscache.com/im/pictures/prohost-api/Hosting-49942000/original/040b9f21-4c33-4da5-ade1-c19559f81744.jpeg?im_w=720&im_format=avif",
        spotId: 6,
        preview: false
      },
      {
        url: "https://a0.muscache.com/im/pictures/prohost-api/Hosting-49942000/original/4ca52328-4df4-42a8-9b13-2b90521ae533.jpeg?im_w=1200&im_format=avif",
        spotId: 6,
        preview: false
      },
      {
        url: "https://a0.muscache.com/im/pictures/prohost-api/Hosting-49942000/original/37501798-6bb3-4c4a-b2fc-16c3291449e3.jpeg?im_w=1200&im_format=avif",
        spotId: 6,
        preview: false
      },
    ], options)
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {}, {});
  }
};