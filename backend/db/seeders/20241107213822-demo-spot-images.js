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
        url: "https://assets-global.website-files.com/5dcc7f8c449e597ed83356b8/5e3a384c96ecbe8564dadb2a_Artboard%20Copy%206-p-800.webp",
        spotId: 1,
        preview: true
      },
      {
        url: "https://assets-global.website-files.com/5dcc7f8c449e597ed83356b8/650261d8cce9ccd6eb6e236f_unsplash_ZJEKICY5EXY-p-500.webp",
        spotId: 1
      },
      {
        url: "https://dmn-dallas-news-prod.cdn.arcpublishing.com/resizer/v2/DZDQRXPFSNFLPIJJW3SEHQZWIE.jpg?auth=a21bf310586f62bb7147d61d4cd8ad0ea1e2353bf242a85d297e705e1c8652cf&height=1878&quality=80",
        spotId: 2
      }
    ], options)
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {}, {});
  }
};