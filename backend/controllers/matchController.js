import {
  insertNotificationsTable,
  findUserEmail,
} from "../models/matchModel.js";
import { findMatchingPets } from "../models/matchModel.js";
import { Pets } from "../utils/petsTable.js";

export async function createNotifications(req, res) {
  try {
    const reqData = await req.body;
    console.log("reqData",reqData)
    const {
      userID: userID,
      snsEmail: snsEmail,
      category: category,
      animalClass: animalClass,
      type: type,
      color: color,
      location: location,
      gender: gender,
    } = reqData;
    const result = await insertNotificationsTable(reqData);
    // const successfullResponse = {
    //   id: result.id,
    //   userID: userID,
    //   snsEmail: snsEmail,
    //   category: category,
    //   animalClass: animalClass,
    //   type: type,
    //   color: color,
    //   location: location,
    //   gender: gender,
    // };
    return snsEmail
    // res.status(200).json(successfullResponse);
  } catch (e) {
    console.error(e);
    res.status(500).json("Server error: " + e.message);
  }
}

export async function publishMatched(req, res) {
  try{
  const userPetsNumMap = await findMatchingPets(Pets);
  return userPetsNumMap
  } catch (e) {
    console.error(e);
  }
}
