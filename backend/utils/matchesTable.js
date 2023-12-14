import sequelize from "../middlewares/db.js";
import { DataTypes, Op } from "sequelize";
import { Pets } from "./petsTable.js";
import { Users } from "./usersTable.js";
import { Shelters } from "./sheltersTable.js";
export const Matches = sequelize.define(
  "Matches",
  {
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
      allowNull: true,
      references: {
        model: "Pets",
        key: "id",
      },
    },
    shelterID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Shelters",
        key: "id",
      },
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
  { timestamps: true, autoIncrement: false, primaryKey: false }
);
Matches.removeAttribute("id");
Matches.belongsTo(Pets, { foreignKey: "petID", targetKey: "id" });
Matches.belongsTo(Users, { foreignKey: "userID", targetKey: "id" });
Matches.belongsTo(Shelters, { foreignKey: "shelterID", targetKey: "id" });
