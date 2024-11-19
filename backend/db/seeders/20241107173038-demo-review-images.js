'use strict';

const { ReviewImage } = require('../models')

/** @type {import('sequelize-cli').Migration} */

let options = {};
options.tableName = 'ReviewImages'
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await ReviewImage.bulkCreate([
      {
        url: "https://computersciencehero.com/wp-content/uploads/2019/10/o.jpg",
        reviewId: 1
      },
      {
        url: "https://computersciencehero.com/wp-content/uploads/2019/10/app-academy-cover.jpg",
        reviewId: 2
      },
      {
        url: "https://pbs.twimg.com/media/DBr6IOKXcAEhbbX.jpg",
        reviewId: 1
      }
    ], options)
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {}, {});
  }
};