import sequelize from "../middlewares/db.js";
import { DataTypes } from "sequelize";

export const GeoLocations = sequelize.define(
  "GeoLocations",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    petID: {
        type: DataTypes.INTEGER,
        references: {
          model: "Pets",
          key: "id",
        },
    },
    lat: {
      type: DataTypes.STRING,
    },
    lng: {
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
    timestamps: false,
  }
);
