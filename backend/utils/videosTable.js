import sequelize from '../middlewares/db.js';
import { DataTypes, Op } from 'sequelize';

export const Videos = sequelize.define(
  "Videos",
  {
    petID: {
      type: DataTypes.INTEGER,
    },
    videos: {
      type: DataTypes.STRING,
    },
  },
  { timestamps: false }
);
