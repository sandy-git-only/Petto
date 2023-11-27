import Sequelize from "sequelize";
import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();
// const pool = mysql.createPool({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_DATABASE,
//     connectionLimit : 10,
//     waitForConnections : true,
// });
// pool.getConnection((err, connection) => {
//   if (err) {
//       console.error('Error connecting to MySQL:', err.message);
//   } else {
//       console.log('Connected to MySQL!');
//       connection.release(); 
//   }
// });
const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    pool: {
      max: 10, // 最大連接數
      min: 0, // 最小連接數
      acquire: 30000, // 請求等待時間（毫秒）
      idle: 10000 // 連接閒置時間（毫秒）
    },
});

// Test the connection
// sequelize
//   .authenticate()
//   .then(() => {
//     console.log('Connection has been established successfully.');
//   })
//   .catch((err) => {
//     console.error('Unable to connect to the database:', err);
//   });

export default sequelize;