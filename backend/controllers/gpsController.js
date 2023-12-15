import { reqGeoLocation } from "../models/gpsModel.js";
import fs from "fs";


const convertToGeoJSON = (geoLocations) => {
  const features = geoLocations.map((location) => {
    const petData = location.Pet.dataValues;
    return {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [parseFloat(location.lng), parseFloat(location.lat)],
      },
      properties: {
        id: petData.id,
        category: petData.category,
        name: petData.name,
        img: petData.main_image,
        city:petData.city,
        district:petData.district
      },
    };
  });
  const geoJSON = {
    type: "FeatureCollection",
    features: features,
  };

  return geoJSON;
};

export default async function reqPetsLocations(req, res) {
  try {
    const writeGeoJSONToFile = (geoJSON) => {
      const fileName = "geojson/petto.geojson";
      const geoJSONString = JSON.stringify(geoJSON, null, 2);
      if (fs.existsSync(fileName)) {
        // If file exists, delete it
        fs.unlinkSync(fileName);
        console.log(`${fileName} already exists. Deleting the existing file.`);
      };
      fs.writeFileSync(fileName, geoJSONString, "utf-8");

      console.log(`GeoJSON data written to ${fileName}`);
    };

    (async () => {
      try {
        const geoLocations = await reqGeoLocation();
        const geoJSON = convertToGeoJSON(geoLocations);
        writeGeoJSONToFile(geoJSON);
      res.status(200).send({geoJSON: geoJSON});

      } catch (error) {
        console.error("Error processing GeoLocations:", error);
      }
    })();
   
  } catch {
    res.status(401).json({ error: "Cannot get Pets locations" });
  }
}
