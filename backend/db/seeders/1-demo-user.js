'use strict';

const { User } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await User.bulkCreate([
      {
        email: 'demo@user.io',
        username: 'Demo-lition',
        hashedPassword: bcrypt.hashSync('password'),
        firstName: 'Demo',
        lastName: 'Lition'
      },
      {
        email: 'user1@user.io',
        username: 'FakeUser1',
        hashedPassword: bcrypt.hashSync('password2'),
        firstName: 'Fake',
        lastName: 'User1'
      },
      {
        email: 'user2@user.io',
        username: 'FakeUser2',
        hashedPassword: bcrypt.hashSync('password3'),
        firstName: 'Fake',
        lastName: 'User2'
      },
      {
        email: 'emily.jones@example.com',
        username: 'EmilyJones',
        hashedPassword: bcrypt.hashSync('password4'),
        firstName: 'Emily',
        lastName: 'Jones'
      },
      {
        email: 'michael.smith@example.com',
        username: 'MichaelSmith',
        hashedPassword: bcrypt.hashSync('password5'),
        firstName: 'Michael',
        lastName: 'Smith'
      }
    ], { validate: true }).catch(error => console.log('Seeding error:', error));
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2', 'EmilyJones', 'MichaelSmith'] }
    }, {});
  }
};
