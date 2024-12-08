'use strict';
const { Spot } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
options.tableName = 'Spots';
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await Spot.bulkCreate([
      {
        name: 'Beachside Paradise',
        description: "A tranquil beachfront getaway with stunning ocean views and luxurious amenities.",
        price: 450.00,
        address: "777 Ocean Ave",
        city: "Malibu",
        state: "California",
        country: "United States",
        lat: 34.0259198,
        lng: -118.7797571,
        ownerId: 1,
        previewImage: "https://a0.muscache.com/im/pictures/44280510-f5e2-40aa-b1cd-a62a13b346f8.jpg?im_w=1200&im_format=avif"
      },
      {
        name: 'Mountain Retreat',
        description: "A cozy cabin nestled in the mountains, perfect for hiking and escaping the city.",
        price: 300.00,
        address: "88 Alpine Trail",
        city: "Aspen",
        state: "Colorado",
        country: "United States",
        lat: 39.1910983,
        lng: -106.8175387,
        ownerId: 1,
        previewImage: "https://a0.muscache.com/im/pictures/80063e44-7b90-42d2-a1fa-73799cb695c9.jpg?im_w=1200&im_format=avif"
      },
      {
        name: 'Urban Loft',
        description: "A chic downtown loft with modern designs and close to all major attractions.",
        price: 220.00,
        address: "1025 Main St",
        city: "Seattle",
        state: "Washington",
        country: "United States",
        lat: 47.608013,
        lng: -122.335167,
        ownerId: 2,
        previewImage: "https://a0.muscache.com/im/pictures/miso/Hosting-851739672197637063/original/4566b3a4-79e1-4da1-9a76-fd7a39da0246.jpeg?im_w=1200&im_format=avif"
      },
      {
        name: 'Desert Oasis',
        description: "A luxurious villa in the desert with a private pool and breathtaking views.",
        price: 599.99,
        address: "455 Desert Bloom Rd",
        city: "Palm Springs",
        state: "California",
        country: "United States",
        lat: 33.8302961,
        lng: -116.5452921,
        ownerId: 3,
        previewImage: "https://a0.muscache.com/im/pictures/a9b047c3-0e64-4a3a-8454-f29f027b82fe.jpg?im_w=1200&im_format=avif"
      },
      {
        name: 'Countryside Escape',
        description: "A peaceful farmhouse surrounded by nature, perfect for a quiet getaway.",
        price: 185.00,
        address: "569 Green Acres Rd",
        city: "Nashville",
        state: "Tennessee",
        country: "United States",
        lat: 36.1626638,
        lng: -86.7816016,
        ownerId: 4,
        previewImage: "https://a0.muscache.com/im/pictures/fe88b22e-95a3-47c9-9221-d4d0cf23eb39.jpg?im_w=1200&im_format=avif"
      },
      {
        name: 'Historic Townhouse',
        description: "A charming townhouse in the historic district with easy access to local attractions.",
        price: 250.00,
        address: "120 Old Town Rd",
        city: "Charleston",
        state: "South Carolina",
        country: "United States",
        lat: 32.7764749,
        lng: -79.9310512,
        ownerId: 5,
        previewImage: "https://a0.muscache.com/im/pictures/prohost-api/Hosting-49942000/original/67ec0f15-2ccd-4b3b-8da0-8e520018b5f8.jpeg?im_w=1200&im_format=avif"
      }
    ], options);
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: [ 
        'Beachside Paradise', 
        'Mountain Retreat', 
        'Urban Loft', 
        'Desert Oasis', 
        'Countryside Escape', 
        'Historic Townhouse'
      ]}
    }, {});
  }
};