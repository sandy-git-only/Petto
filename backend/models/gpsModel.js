import { Pets } from "../utils/petsTable.js";
import { GeoLocations } from "../utils/geoLocationTable.js";


export async function insertGeoLocationDB(data) {
  try {
    const response = await GeoLocations.create(data);
    return response;
  } catch (error) {
    console.error("geolocation insertion error", error);
  }
}

export async function reqGeoLocation() {
  try{
    const geoLocations = await GeoLocations.findAll({
      include: Pets, 
    });
    return geoLocations
  } catch (error) {
    console.error("geolocation request error", error);
    throw error;
  }
}

Pets.hasMany(GeoLocations, { foreignKey: "petID", as: "geoLocations" });
GeoLocations.belongsTo(Pets, { foreignKey: "petID" });