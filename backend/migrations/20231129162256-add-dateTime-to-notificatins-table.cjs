'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'Notifications',
      'createdAt',
      {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false,
      }
    );
    await queryInterface.addColumn(
      'Notifications',
      'updatedAt',
      {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
        allowNull: false,
      }
    )
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Notifications', 'createdAt');
    await queryInterface.removeColumn('Notifications', 'updatedAt');
  }
}