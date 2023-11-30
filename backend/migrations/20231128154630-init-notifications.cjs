'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Notifications', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      userID: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      category: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      animalClass: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      type: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      color: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      location: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      gender: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
    });

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Notifications')
  }
};
