'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'Notifications',
      'snsEmail',
      {
        type: Sequelize.STRING(100),
        allowNull: false,
      }
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Notifications', 'snsEmail');
  }
}