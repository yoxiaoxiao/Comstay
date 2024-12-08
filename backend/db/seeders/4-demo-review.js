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
        userId: 5,
        spotId: 1,
        review: "The place was absolutely charming! Clean, cozy, and perfectly located for exploring the city. Would definitely stay again!",
        stars: 5
      },
      {
        userId: 3,
        spotId: 2,
        review: "The view from the balcony was breathtaking. Waking up to the sunrise over the ocean was unforgettable. Highly recommend!",
        stars: 5
      },
      {
        userId: 4,
        spotId: 3,
        review: "Such a peaceful and relaxing stay. The host was incredibly accommodating, and the space had everything we needed. Loved it!",
        stars: 5
      },
      {
        userId: 5,
        spotId: 4,
        review: "This spot was perfect for our family vacation. Plenty of space, a fully equipped kitchen, and close to all the attractions. We felt right at home!",
        stars: 5
      },
      {
        userId: 2,
        spotId: 5,
        review: "Spotlessly clean with modern decor. The host was friendly and quick to respond to questions. Loved the little touches!",
        stars: 5
      },
      {
        userId: 1,
        spotId: 6,
        review: "You can't beat the location—walking distance to all the main spots. The apartment was small but had everything we needed for our stay.",
        stars: 5
      },
    ], options)
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {}, {});
  }
};