import sequelize from '../middlewares/db.js';
import { DataTypes, Op } from 'sequelize';


const Users = sequelize.define('Users', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    provide:{
      type: DataTypes.STRING,
      allowNull: false,
    }
  });