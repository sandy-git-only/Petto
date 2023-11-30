'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'Images',
      'createdAt',
      {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false,
      }
    );
    await queryInterface.addColumn(
      'Images',
      'updatedAt',
      {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
        allowNull: false,
      }
    )
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Images', 'createdAt');
    await queryInterface.removeColumn('Images', 'updatedAt');
  }
}