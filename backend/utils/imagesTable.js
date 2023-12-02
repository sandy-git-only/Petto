import sequelize from '../middlewares/db.js';
import { DataTypes, Op } from 'sequelize';

export const Images = sequelize.define(
  "Images",
  {
    petID: {
      type: DataTypes.INTEGER,
      references: {
        model: "Pets", 
        key: "id",
      },
    },
    url: {
      type: DataTypes.STRING,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  { timestamps: true, }
);
