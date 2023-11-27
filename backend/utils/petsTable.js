import sequelize from '../middlewares/db.js';
import { DataTypes, Op } from 'sequelize';

export const Pets = sequelize.define(
    "Pets",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      animalClass: {
        type: DataTypes.STRING,
      },
      name: {
        type: DataTypes.STRING,
      },
      type: {
        type: DataTypes.STRING,
      },
      location: {
        type: DataTypes.INTEGER,
      },
      gender: {
        type: DataTypes.STRING,
      },
      age: {
        type: DataTypes.INTEGER,
      },
      anthel: {
        type: DataTypes.STRING,
      },
      vaccine: {
        type: DataTypes.STRING,
      },
      ligation: {
        type: DataTypes.STRING,
      },
      description: {
        type: DataTypes.STRING,
      },
      color: {
        type: DataTypes.STRING,
      },
      main_image: {
        type: DataTypes.STRING,
      },
      userID: {
        type: DataTypes.INTEGER,
        // references: {
        //   model: "Users", 
        //   key: "id",
        // },
      },
    },
    { timestamps: false }
  );