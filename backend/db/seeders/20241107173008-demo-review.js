'use strict';
const { Review } = require('../models')

/** @type {import('sequelize-cli').Migration} */

let options = {};
options.tableName = 'Reviews'
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await Review.bulkCreate([
      {
        userId: 2,
        spotId: 1,
        review: "I'm not a fan of how drastic some of the changes have been in the staffing latetly, but I can't deny how effective the program was",
        stars: 4
      },
      {
        userId: 3,
        spotId: 1,
        review: "I've learned a lot about how to program here! Would recommend, 10/10",
        stars: 5
      },
      {
        userId: 3,
        spotId: 2,
        review: "Too expensive for my tastes",
        stars: 2
      }
    ], options)
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {}, {});
  }
};