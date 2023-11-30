import { Notifications } from "../utils/notificationsTable.js";
import { Op } from "sequelize";
import sequelize from "../middlewares/db.js";
import { Users } from "../utils/usersTable.js"; 

export async function insertNotificationsTable(notificationsData) {
    try {
      const notificationsResponse = await Notifications.create(notificationsData);
      console.log("Notifications information created", notificationsResponse);
      return notificationsResponse;
    } catch (error) {
      console.error("Notifications information insertion error", error);
    }
  }


export async function matchingPets (PetsTable){
  Notifications.afterCreate(async (notification, options) => {

    // 查詢 Pets 表中是否存在相同 category 的記錄
    const matchingPets = await PetsTable.findAll({
      where: {
        [Op.and]:[
           {category: notification.category},
           { gender: notification.gender},
           { animalClass: notification.animalClass},
           {type: notification.type},
           {color:notification.color},
           {location: notification.location}
        ]
      }
    });
    return matchingPets;
  });
}


export async function findUserEmail(id) {
  try {
    await sequelize.sync();
    const user = await Users.findOne({
      where: { id },
    });
    if ( user) {
      const userEmail = user.email;
    } else {
      console.log(" User doesn't exist")
    }

  } catch (error) {
    console.error("Error retrieving product details:", error);
    return null;
  }
}