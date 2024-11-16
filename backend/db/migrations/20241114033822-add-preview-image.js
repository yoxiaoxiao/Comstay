'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('Spots', 'previewImage', {
      type: Sequelize.STRING,
        defaultValue: null,
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Spots', 'previewImage');
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
