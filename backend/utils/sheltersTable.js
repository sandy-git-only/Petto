import sequelize from "../middlewares/db.js";
import { DataTypes } from "sequelize";
export const Shelters = sequelize.define(
  "Shelters",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    category: {
      type: DataTypes.STRING,
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
    city: {
      type: DataTypes.INTEGER,
    },
    district: {
      type: DataTypes.INTEGER,
    },
    address: {
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
    ligation: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
    color: {
      type: DataTypes.STRING,
    },
    feature: {
      type: DataTypes.STRING,
    },
    main_image: {
      type: DataTypes.STRING,
    },
    shelter: {
      type: DataTypes.INTEGER,
    },
    tel: {
      type: DataTypes.STRING,
    },
    place: {
      type: DataTypes.STRING,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: true,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);
