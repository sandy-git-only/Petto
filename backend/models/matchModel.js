import { Notifications } from "../utils/notificationsTable.js";
import { Op,Sequelize } from "sequelize";
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

async function insertMatchesTable(matchesData) {
  try {
    const matchesResponse = await Notifications.create(matchesData);
    console.log("Matched result created", matchesResponse);
    return notificationsResponse;
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
        snsEmail,
        animalClass =  notification.animalClass ,
        gender = notification.gender ,
        type = notification.type ,
        color = notification.color ,
        location = notification.location ,
      } = notification;
      const matchingResults = await PetsTable.findAll({
        where: {
          [Op.and]: [
            animalClass !== null ? { animalClass } : { animalClass: { [Op.not]: null } },
            gender !== null ? { gender } : { gender: { [Op.not]: null } },
            type !== null ? { type } : { type: { [Op.not]: null } },
            color !== null ? { color } : { color: { [Op.not]: null } },
            location !== null ? { location } : { location: { [Op.not]: null } },
          ],
        },
      });
      const matchedPairs = matchingResults.map((pet) => ({
        userID,
        snsEmail,
        petID: pet.id,
      }
      ));
      var userPetsNumMap = [];
      const petsNum = matchedPairs.length;
      if (snsEmail ) {
        userPetsNumMap= { snsEmail, petsNum };
      }
      // console.log(userPetsNumMap);
      // const uniqueSnsEmails = [...new Set(matchedPairs.map(pair => pair.snsEmail))];
      // const result = await Matches.bulkCreate(matchedPairs, {
      //   updateOnDuplicate: ['updatedAt'],
      //   updateFields: ['updatedAt'],
      // });
      // console.log("result",result);
      return userPetsNumMap
    });
    const uniqueSnsEmailsArray = await Promise.all(matchingResults);
    const uniqueSnsEmails = uniqueSnsEmailsArray.flat();
    return uniqueSnsEmails
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
