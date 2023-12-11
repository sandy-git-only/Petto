import { Notifications } from "../utils/notificationsTable.js";
import { Op, Sequelize } from "sequelize";
import sequelize from "../middlewares/db.js";
import { Users } from "../utils/usersTable.js";
import { Matches } from "../utils/matchesTable.js";
export async function insertNotificationsTable(notificationsData) {
  try {
    const notificationsResponse = await Notifications.create(notificationsData);
    console.log("Notifications information created", notificationsResponse);
    return notificationsResponse;
  } catch (error) {
    console.error("Notifications information insertion error", error);
  }
}

export async function insertMatchesTable(matchesData) {
  try {
    const existingMatch = await Matches.findOne({
      where: {
        userID: matchesData.userID,
        petID: matchesData.petID,
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
}

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
}

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
}
