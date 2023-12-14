import { Notifications } from "../utils/notificationsTable.js";
import { Op, Sequelize } from "sequelize";
import sequelize from "../middlewares/db.js";
import { Users } from "../utils/usersTable.js";
import { Pets } from "../utils/petsTable.js";
import { Matches } from "../utils/matchesTable.js";
import { Shelters } from "../utils/sheltersTable.js";
export async function insertNotificationsTable(notificationsData) {
  try {
    const notificationsResponse = await Notifications.create(notificationsData);
    console.log("Notifications information created", notificationsResponse);
    return notificationsResponse;
  } catch (error) {
    console.error("Notifications information insertion error", error);
  }
};

export async function insertMatchesTable(matchesData) {
  try {
    const existingMatch = await Matches.findOne({
      where: {
        userID: matchesData.userID,
        petID: matchesData.petID,
        shelterID : matchesData.shelterID,
      },
    });
    if (!existingMatch) {
      const matchesResponse = await Matches.create(matchesData);
      console.log("Matched result created", matchesResponse);
      return matchesResponse;
    } else {
      console.log("Matched result already exists", existingMatch);
      return existingMatch;
    }
  } catch (error) {
    console.error("Matched data insertion error", error);
  }
};

export async function findMatchingPets(PetsTable) {
  try {
    const notifications = await Notifications.findAll({
      raw: true,
    });

    const matchingResults = notifications.map(async (notification) => {
      const {
        userID,
        email,
        animalClass = notification.animalClass,
        gender = notification.gender,
        type = notification.type,
        color = notification.color,
        city = notification.city,
        district = notification.district,
      } = notification;
      const matchingResults = await PetsTable.findAll({
        where: {
          [Op.and]: [
            animalClass !== null
              ? { animalClass }
              : { animalClass: { [Op.not]: null } },
            gender !== null ? { gender } : { gender: { [Op.not]: null } },
            type !== null ? { type } : { type: { [Op.not]: null } },
            color !== null ? { color } : { color: { [Op.not]: null } },
            city !== null ? { city } : { city: { [Op.not]: null } },
            district !== null ? { district } : { district: { [Op.not]: null } },
          ],
        },
      });
      const matchedPairs = matchingResults.map((pet) => ({
        petID: pet.id,
      }));
      var userPetsNumMap = [];
      const petsNum = matchedPairs.length;
      if (email) {
        userPetsNumMap = { userID, email, petsNum , matchedPairs };
      }
      return userPetsNumMap;
    });
    const uniqueSnsEmailsArray = await Promise.all(matchingResults);
    const uniqueSnsEmails = uniqueSnsEmailsArray.flat();
    return uniqueSnsEmails;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export async function findUserEmail(id) {
  try {
    await sequelize.sync();
    const user = await Users.findOne({
      where: { id },
    });
    if (user) {
      const userEmail = user.email;
    } else {
      console.log(" User doesn't exist");
    }
  } catch (error) {
    console.error("Error find user email:", error);
    return null;
  }
};

export async function findUserMatches(userID) {
  try {
    const matches = await Matches.findAll({
      where: { userID },
    });
    
    if (!matches || matches.length === 0) {
      console.log("No matches found for the specified userID");
      return null;
    }
    
    const matchDetails = await Promise.all(
      matches.map(async (match) => {
        const petID = match.petID;
        const shelterID = match.shelterID
        let petData;
        let shelterPetData;
          // If petID is from Shelters table
          shelterPetData = await Shelters.findOne({
            where: { id: shelterID },
            attributes: ['id', 'name', 'main_image', 'gender', 'type', 'anthel', 'ligation','city' ,'age','district'],
          });
       
          // If petID is from Pets table
          petData = await Pets.findOne({
            where: { id: petID },
            attributes: ['id', 'name', 'main_image', 'gender', 'type', 'anthel', 'ligation', 'vaccine', 'age', 'city', 'district'],
          });
        return {
          match,
          petData,
          shelterPetData
        };
      })
    );
    return matchDetails;
  } catch (error) {
    console.error("Error finding user matches:", error);
    return null;
  }
};

export async function postUserMatchingPets(userID) {
  try {
    const notification = await Notifications.findOne({
      where: { userID },
    });  
      const notificationData = {
        userID:notification.userID,
        email:notification.email,
        animalClass:notification.animalClass,
        gender:notification.gender,
        type:notification.type,
        color: notification.color,
        city:notification.city,
        district:notification.district,
      } ;
      try {
        const matchingResults = await Pets.findAll({
        where: {
          [Op.and]: [
            notificationData.animalClass !== null
              ? { animalClass:notificationData.animalClass }
              : { animalClass: { [Op.not]: null } },
              notificationData.gender !== null ? { gender:notificationData.gender } : { gender: { [Op.not]: null } },
              notificationData.type !== null ? { type:notificationData.type } : { type: { [Op.not]: null } },
              notificationData.color !== null ? { color:notificationData.color } : { color: { [Op.not]: null } },
              notificationData.city !== null ? { city:notificationData.city } : { city: { [Op.not]: null } },
              notificationData.district !== null ? { district:notificationData.district } : { district: { [Op.not]: null } },
          ],
        },
      });

      const matchingShelterResults = await Shelters.findAll({
        where: {
          [Op.and]: [
            notificationData.animalClass !== null
              ? { animalClass:notificationData.animalClass }
              : { animalClass: { [Op.not]: null } },
              notificationData.gender !== null ? { gender:notificationData.gender } : { gender: { [Op.not]: null } },
              notificationData.type !== null ? { type:notificationData.type.trim() } : { type: { [Op.not]: null } },
              notificationData.color !== null ? { color:notificationData.color.trim() } : { color: { [Op.not]: null } },
              notificationData.city !== null ? { city:notificationData.city } : { city: { [Op.not]: null } },
              notificationData.district !== null ? { district:notificationData.district } : { district: { [Op.not]: null } },
          ],
        },
        logging: console.log,
      });

      const matchedPairs = matchingResults.map((pet) => ({
        petID: pet.id,
      }));

      const matchedShelterPairs = matchingShelterResults
      .slice(0, 10) // Extract the first 10 entries
      .map((pet) => ({
        shelterID: pet.id
      }));
      
      var userPetsMatchedList = [];
      const petsNum = matchedPairs.length + matchedShelterPairs.length;


      if (notification.email) {
        userPetsMatchedList = { userID:notification.userID, email:notification.email, petsNum , matchedPairs ,matchedShelterPairs };
      };
      return userPetsMatchedList;
      } catch (error) {
        console.error('Error executing Sequelize queries:', error);
      }
      
  } catch (err) {
    console.error(err);
    throw err;
  }
}


