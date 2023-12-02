import sequelize from '../middlewares/db.js';
import { DataTypes, Op } from 'sequelize';

export const Matches = sequelize.define(
  "Matches",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    userID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      },
      petID: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
  { timestamps: true,
    uniqueKeys: {
      unique_user_pet: {
        fields: ["userID", "id"]
      }}
    }
);
