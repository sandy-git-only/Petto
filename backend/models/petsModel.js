import { Pets } from "../utils/petsTable.js";
import { Images } from "../utils/imagesTable.js";
import sequelize from "../middlewares/db.js";

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

export async function getPetsDetailById(id) {
  try {
    await sequelize.sync();
    const pets = await Pets.findOne({
      where: { id },
    });

    if (pets) {
      const images = await Images.findAll({
        where: { petID: pets.id },
      });
      return { pets, images };
    } else {
      console.log("Pets not found in petsModel:getPetsDetailById");
      return null;
    }
  } catch (error) {
    console.error("Error retrieving product details:", error);
    return null;
  }
}
