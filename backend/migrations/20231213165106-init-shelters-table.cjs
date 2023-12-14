'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Shelters', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
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
      name: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      type: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      city: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      district: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      address: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      gender: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      age: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      anthel: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      ligation: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      description: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      color: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      feature: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      main_image: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      shelter: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      tel: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      place: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
        allowNull: false
      },
    });

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Shelters')
  }
};
