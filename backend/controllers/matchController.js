import {
  insertNotificationsTable,
  findUserEmail,
  insertMatchesTable,
} from "../models/matchModel.js";
import { findMatchingPets,postUserMatchingPets } from "../models/matchModel.js";
import { Pets } from "../utils/petsTable.js";

export async function createNotifications(req, res) {
  try {
    const reqData = await req.body;
    const {
      userID: userID,
      email: email,
      category: category,
      animalClass: animalClass,
      type: type,
      color: color,
      city: city,
      district: district,
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
    return email;
    // res.status(200).json(successfullResponse);
  } catch (e) {
    console.error(e);
    res.status(500).json("Server error: " + e.message);
  }
}

export async function publishMatched(req, res) {
  try {
    const userPetsNumMap = await findMatchingPets(Pets);
    await Promise.all(
      userPetsNumMap.map(async (userPetNum) => {
        userPetNum.matchedPairs.map((matchedPair) => {
          const matchesData = {
            userID: userPetNum.userID,
            petID:  matchedPair.petID
          };
          insertMatchesTable(matchesData)
        });
      })
    );
    return userPetsNumMap;
  } catch (e) {
    console.error(e);
  }
}

export async function userPetsMatchedinsertDB(userID) {
  try {
    const matchedResult = await postUserMatchingPets(userID);
    console.log("matchedResult....",matchedResult);
    await Promise.all(
      matchedResult.matchedPairs.map(async (pet) => {
          const matchesData = {
            userID: matchedResult.userID,
            petID:  pet.petID,
            shelterID:null
          };
          insertMatchesTable(matchesData)
      })
    );
    await Promise.all(
      matchedResult.matchedShelterPairs.map(async (pet) => {
          const matchesData = {
            userID: matchedResult.userID,
            shelterID:  pet.shelterID,
            petID: null
          };
          insertMatchesTable(matchesData)
      })
    );
    return matchedResult;
  } catch (e) {
    console.error(e);
  }
}
