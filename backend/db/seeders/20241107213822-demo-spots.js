'use strict';
const { Spot } = require('../models');
const bcrypt = require("bcryptjs");

/** @type {import('sequelize-cli').Migration} */

let options = {};
options.tableName = 'Spots'
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await Spot.bulkCreate([
      {
        name: 'App Academy',
        description: "We've consistently been regarded as one of the best software engineering coding bootcamps in the world by students and employers.",
        price: 234.45,
        address: "548 Market St Suite 96590",
        city: "San Francisco",
        state: "California",
        country: "United States",
        lat: 37.7899616,
        lng: -122.4034589,
        ownerId: 1
      },
      {
        name: 'My mansion',
        description: "This is the house I don't have yet but I imagine I'll have soon, maybe 5 years from now",
        price: 1299.99,
        address: "1234 Texas Rd.",
        city: "Houston",
        state: "Texas",
        country: "United States",
        lat: 32.3436195,
        lng: -82.6568411,
        ownerId: 1
      },
      {
        name: 'The Up house',
        description: "Its got a lot of ballons and it go up",
        price: 299.99,
        address: "21132 US-84",
        city: "Espanola",
        state: "New Mexico",
        country: "United States",
        lat: 36.2071897,
        lng: -106.3187518,
        ownerId: 2
      }
    ], options)
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['App Academy', 'The Pines Homestead', 'The Up house'] }
    }, {});
  }
};