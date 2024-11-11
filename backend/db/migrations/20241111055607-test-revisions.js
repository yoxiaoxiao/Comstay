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
    await queryInterface.renameColumn('Spots', 'userId', 'ownerId');
    await queryInterface.removeColumn('Spots', 'spotImagesId');
    await queryInterface.changeColumn('Spots', 'lng', {
      type: Sequelize.DECIMAL,
        allowNull: false,
        unique: false
    })
    await queryInterface.changeColumn('Spots', 'lat', {
      type: Sequelize.DECIMAL,
        allowNull: false,
        unique: false
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.renameColumn('Spots', 'ownerId', 'userId');
    await queryInterface.addColumn('Spots', 'spotImagesId');
    await queryInterface.changeColumn('Spots', 'lng', {
      type: Sequelize.DECIMAL,
        allowNull: false,
        unique: true
    })
    await queryInterface.changeColumn('Spots', 'lat', {
      type: Sequelize.DECIMAL,
        allowNull: false,
        unique: true
    })
  }
};
