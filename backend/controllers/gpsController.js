import { reqGeoLocation } from "../models/gpsModel.js";
import fs from "fs";


const convertToGeoJSON = (geoLocations) => {
  try {
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
} catch (e) {
  throw e
}

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
          const geoJSON = await convertToGeoJSON(geoLocations);
          await writeGeoJSONToFile(geoJSON);
  
          // 檢查 res 是否有定義且有 send 方法
          if (res && res.send) {
              res.status(200).send({ geoJSON: geoJSON });
          } else {
              console.error("回應物件未定義，或者不具有 send 方法。");
              // 處理錯誤或返回適當的回應
          }
      } catch (error) {
          console.error("處理地理位置時發生錯誤:", error);
          // 處理錯誤或返回適當的回應
      }
  })();
   
  } catch {
    res.status(401).json({ error: "Cannot get Pets locations" });
  }
}
