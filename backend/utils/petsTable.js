import sequelize from "../middlewares/db.js";
import { DataTypes, Op } from "sequelize";
import { Users } from "./usersTable.js"
export const Pets = sequelize.define(
  "Pets",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
    feature: {
      type: DataTypes.STRING,
    },
    main_image: {
      type: DataTypes.STRING,
    },
    userID: {
      type: DataTypes.INTEGER,
      references: {
        model: "Users",
        key: "id",
      },
      field: "userID", 
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
    uniqueKeys: {
      unique_user_pet: {
        fields: ["userID", "petID"],
      },
    },
  }
);

Pets.belongsTo(Users, { foreignKey: 'userID' }); 
Users.hasMany(Pets, { foreignKey: 'userID' });