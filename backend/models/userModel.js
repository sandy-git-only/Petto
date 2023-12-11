import sequelize from "../middlewares/db.js";
import jwt from "jsonwebtoken";
import { Users } from "../utils/usersTable.js";
import dotenv from "dotenv";
dotenv.config();

export async function insertUsersTable(usersData) {
  try {
    const usersResponse = await Users.create(usersData);
    console.log("users information created", usersResponse);
    return usersResponse;
  } catch (error) {
    console.error("users sign up insertion error", error);
  }
}

export async function checkUserFromDB(email) {
  try {
    const user = await Users.findAll({
      where: { email: email },
    });
    return user;
  } catch (err) {
    throw err;
  }
};

export async function getUserProfile(id) {
  try {
    const user = await Users.findAll({
      where: { id: id },
    });
    return user;
  } catch (err) {
    throw err;
  }
}

export function generateJWTAceessToken(payload) {
  const token = jwt.sign(
    { payload, exp: Math.floor(Date.now() / 1000) + 3600 * 24 },
    process.env.JWT_SECRET
  );
  return token;
}

// module.exports =  { insertToUserTable , checkUserFromDB, getUserProfile, generateJWTAceessToken};
