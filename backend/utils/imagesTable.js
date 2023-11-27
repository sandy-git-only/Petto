import sequelize from '../middlewares/db.js';
import { DataTypes, Op } from 'sequelize';

export const Images = sequelize.define(
  "Images",
  {
    petID: {
      type: DataTypes.INTEGER,
    },
    url: {
      type: DataTypes.STRING,
    },
    video: {
      type: DataTypes.STRING,
    },
  },
  { timestamps: false }
);
