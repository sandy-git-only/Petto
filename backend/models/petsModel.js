import { Pets } from "../utils/petsTable.js";
import { Images } from "../utils/imagesTable.js";
import sequelize from "../middlewares/db.js";
import { Users } from "../utils/usersTable.js";
Images.removeAttribute("id");
Pets.hasMany(Images, { foreignKey: "petID", as: "images" });
Images.belongsTo(Pets, { foreignKey: "petID" });

export async function insertPetsTable(petsData) {
  try {
    const petsResponse = await Pets.create(petsData);
    console.log("pets information created", petsResponse);
    return petsResponse;
  } catch (error) {
    console.error("pets information insertion error", error);
  }
}

export async function insertImageTable(imagesUrl) {
  try {
    const imagesResponse = await Images.create(imagesUrl);
    return imagesResponse;
  } catch (error) {
    console.error("pets images insertion error", error);
  }
}

export async function insertVediosTable(videosUrl) {
  try {
    const imagesResponse = await Images.create(videosUrl);
    return imagesResponse;
  } catch (error) {
    console.error("pets images insertion error", error);
  }
}

export async function getPetsDetailById(id) {
  try {
    // await sequelize.sync();
    const pets = await Pets.findOne({
      where: { id },
      include: [
        {
          model: Users,
          attributes: ['id', 'name', 'email'],
          where: { id: sequelize.col('Pets.userID') }, 
        },
      ],
    });

    if (pets) {
      const images = await Images.findAll({
        where: { petID: pets.id },
      });
      return { pets, images };
    } else {
      console.error("Pets not found in petsModel:getPetsDetailById");
      return null;
    }
  } catch (error) {
    console.error("Error retrieving pets details:", error);
    return null;
  }
};

export async function getPetsByCondition(
  conditionValue,
  perPageItems,
  itemIndex
) {
  try {
    // const validConditionTypes = ["gender", "location"];
  //   const condition = validConditionTypes.includes(conditionType)
  // ? { [conditionType]: conditionValue }
  // : {};
    const pets = await Pets.findAll({
      where: conditionValue ,
      limit: perPageItems,
      offset: itemIndex,
      include: [
        {
          model: Images,
          as: "images",
          attributes: ["url"],
        },
      ],
    });

    const result = await Promise.all(
      pets.map(async (pet) => {
        const images = await Images.findAll({
          where: { petID: pet.id },
        });
        return {
          ...pet.toJSON(),
          images: images,
        };
      })
    );

    return result;
  } catch (error) {
    console.error("getPetsByConditonerror:", error);
    throw error; // Rethrow the error to be handled by the caller
  }
}

export async function getPetsByConditionCount(conditionValue) {
  try {
  //   const validConditionTypes = ["gender", "location"];
  //   const condition = validConditionTypes.includes(conditionType)
  // ? { [conditionType]: conditionValue }
  // : {};
    const countResult = await Pets.count({
      where: conditionValue
    });
    return countResult;
  } catch (error) {
    console.error("getPetsByConditionCount error:", error);
    throw error; // Rethrow the error to be handled by the caller
  }
}


export async function getPetsDetailByUserId(userID) {
  try {
    // await sequelize.sync();
    const pets = await Pets.findAll({
      where: { userID },
    });
    // console.log(pets);

    return {pets};
    // if (pets) {
    //   const images = await Images.findAll({
    //     where: { petID: pets.id },
    //   });
    //   return { pets, images };
    // } else {
    //   console.log("Pets not found in petsModel:getPetsDetailByUserId");
    //   return null;
    // }
  } catch (error) {
    console.error("Error retrieving pets details:", error);
    return null;
  }
};