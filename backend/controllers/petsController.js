import {
  insertPetsTable,
  insertImageTable,
  getPetsDetailById,
  getPetsByCondition,
  getPetsByConditionCount,
  getPetsDetailByUserId,
  getPetsByConditionCountForShelter,
  getPetsByConditionForShelter,
  getPetsDetailByIdForShelter
} from "../models/petsModel.js";
// import redisCache from "../middlewares/redis.js";
import { insertGeoLocationDB } from "../models/gpsModel.js";
import { geocoder } from "../middlewares/geocode.js";
import reqPetsLocations from "../controllers/gpsController.js";
import axios from "axios";
import { Shelters } from "../utils/sheltersTable.js"
export async function createPetsInfo(mainImageDataUrl, imagesUrls, req, res) {
  const requestData = await req.body;
  const {
    category,
    animalClass,
    name,
    type,
    city,
    district,
    address,
    gender,
    age,
    anthel,
    vaccine,
    ligation,
    description,
    color,
    feature,
    userID,
  } = requestData;

  //注意:sequelize input是"object" 不是 array
  const petsData = {
    category: category,
    animalClass: animalClass,
    name: name,
    type: type,
    city: city,
    district: district,
    address: address,
    gender: gender,
    age: age,
    anthel: anthel,
    vaccine: vaccine,
    ligation: ligation,
    description: description,
    color: color,
    feature: feature,
    userID: userID,
    main_image: mainImageDataUrl,
  };

  const result = await insertPetsTable(petsData);
  const insertId = result.id;
  // console.log("location": JSON.parse);
  // insert into GeoLocation Table
  const petlocation = result.city + result.district + result.address;
  const geocode = await geocoder(petlocation);
  if (geocode) {
    console.log(geocode.results[0]);
    const geoLocation = geocode.results[0].geometry.location;
    const geoData = {
      petID: insertId,
      lat: geoLocation.lat,
      lng: geoLocation.lng,
    };
    const geoResponse = await insertGeoLocationDB(geoData);
    if (geoResponse) {
      reqPetsLocations();
    }
  }

  const imageUrlsArray = Object.values(imagesUrls);
  const imagesResponse = imageUrlsArray.map(async (url) => {
    const imagesData = {
      petID: insertId,
      url: url,
    };
    console.log("images", imagesData);
    return insertImageTable(imagesData);
  });

  try {
    const successfullResponse = {
      id: insertId,
      category: category,
      animalClass: animalClass,
      name: name,
      type: type,
      city: city,
      district: district,
      address: address,
      gender: gender,
      age: age,
      anthel: anthel,
      vaccine: vaccine,
      ligation: ligation,
      description: description,
      color: color,
      feature: feature,
      userID: userID,
      main_image: mainImageDataUrl,
      images: imageUrlsArray,
    };
    res.status(200).json(successfullResponse);
  } catch (error) {
    console.error("Error inserting pet information", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

function formatRes(pet, images) {
  const image = images.map((image) => image.url);
  const petsFormat = {
    id: pet.id,
    category: pet.category,
    animalClass: pet.animalClass,
    name: pet.name,
    type: pet.type,
    address: pet.address,
    gender: pet.gender,
    age: pet.age,
    anthel: pet.anthel,
    vaccine: pet.vaccine,
    ligation: pet.ligation,
    description: pet.description,
    color: pet.color,
    feature: pet.feature,
    userID: pet.userID,
    email: pet.User.email,
    main_image: pet.main_image,
    city: pet.city,
    district: pet.district,
    images: image,
  };
  return petsFormat;
}


function formatResForShelter(pet) {
  const petsFormat = {
    id: pet.id,
    category: pet.category,
    animalClass: pet.animalClass,
    name: pet.name,
    type: pet.type,
    address: pet.address,
    gender: pet.gender,
    age: pet.age,
    anthel: pet.anthel,
    ligation: pet.ligation,
    description: pet.description,
    color: pet.color,
    feature: pet.feature,
    main_image: pet.main_image,
    city: pet.city,
    district: pet.district,
    shelter:pet.shelter,
    tel:pet.tel,
    place: pet.place
  };
  return petsFormat;
}
export async function getSheltersAPI(res,req) {
  const shelterAPIUrl =
    "https://data.moa.gov.tw/Service/OpenData/TransService.aspx?UnitId=QcbUEzN6E6DL";
  try {
    const apiDatas = await axios.get(shelterAPIUrl);
    const pets = apiDatas.data;
    for (const pet of pets) {
      if (!pet.album_file || pet.album_file === "") {
        continue;
      }
      const data = {
        id :pet.animal_id,
        category: "送養",
        animalClass: pet.animal_kind ==="貓"? "cat" : pet.animal_kind==="狗" ? "dog" : "other",
        name: pet.animal_Variety,
        type: pet.animal_Variety,
        address: pet.shelter_address.substring(6),
        gender: pet.animal_sex === "M"? "male" : "female",
        age: pet.animal_age,
        anthel: pet.animal_bacterin === "T" ? 1 : 0,
        ligation: pet.animal_sterilization === "T" ? 1 : 0,
        description: pet.animal_foundplace,
        color: pet.animal_colour,
        feature: pet.animal_remark,
        shelter: pet.animal_place,
        main_image: pet.album_file,
        city: pet.shelter_address.substring(0,3),
        district: pet.shelter_address.substring(3,6),
        place:pet.animal_place,
        tel:pet.shelter_tel
      };
      console.log(data)
      const [shelter, created] = await Shelters.findOrCreate({
        where: { id: pet.animal_id },
        defaults: data,
      });
    
      // If the record already exists, update it
      if (!created) {
        shelter.set(data);
        await shelter.save();
      };
    }
    res.status(200).send("Shelter Data inserted successfully.");
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).send("Internal Server Error");
  }
}

function UserformatRes(pet) {
  const petsFormat = {
    id: pet.id,
    category: pet.category,
    animalClass: pet.animalClass,
    name: pet.name,
    type: pet.type,
    address: pet.address,
    gender: pet.gender,
    age: pet.age,
    anthel: pet.anthel,
    vaccine: pet.vaccine,
    ligation: pet.ligation,
    description: pet.description,
    color: pet.color,
    feature: pet.feature,
    userID: pet.userID,
    main_image: pet.main_image,
    city: pet.city,
    district: pet.district,
  };
  return petsFormat;
}
export async function reqPetsDetailById(req, res) {
  const id = req.query.id;
  // const cacheKey = `pet:${id}`;
  try {
    // let results = await redisCache(
    //   async () => getPetsDetailById(id),
    //   cacheKey,
    //   req,
    //   res
    // );
    let results = await getPetsDetailById(id)
    const { pets, images } = results;
    console.log("users", pets.User.email);
    const petsDetails = formatRes(pets, images);
    res.json({ data: petsDetails });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error Response");
  }
}

export async function reqPetsDetailByIdForShelter(req, res) {
  const id = req.query.id;
  // const cacheKey = `pet:${id}`;
  try {
    // let results = await redisCache(
    //   async () => getPetsDetailByIdForShelter(id),
    //   cacheKey,
    //   req,
    //   res
    // );
    let results = await getPetsDetailByIdForShelter(id);
    const pets = results;
    const petsDetails = formatResForShelter(pets);
    res.json({ data: petsDetails });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error Response");
  }
}

export async function reqPetsByCondition(req, res, conditionValue) {
  const page = parseInt(req.query.paging) || 0;
  const perPageItems = 8;
  const itemIndex = page * perPageItems;
  let result;
  let countResult;
  if (conditionValue) {
    result = await getPetsByCondition(conditionValue, perPageItems, itemIndex);
    countResult = await getPetsByConditionCount(conditionValue);
  } else {
    let conditionValue = null;
    result = await getPetsByCondition(conditionValue, perPageItems, itemIndex);
    countResult = await getPetsByConditionCount();
  }

  const allProductPages = Math.ceil(countResult / perPageItems);
  console.log("allProductPages", allProductPages);
  try {
    const response = {
      data: result.map((pet) => {
        return {
          id: pet.id,
          category: pet.category,
          animalClass: pet.animalClass,
          name: pet.name,
          type: pet.type,
          location: pet.city || pet.district,
          district: pet.district,
          address: pet.address,
          gender: pet.gender,
          age: pet.age,
          anthel: pet.anthel,
          vaccine: pet.vaccine,
          ligation: pet.ligation,
          description: pet.description,
          color: pet.color,
          feature: pet.feature,
          userID: pet.userID,
          main_image: pet.main_image,
          images: pet.images.map((image) => image.url),
          // videos: pet.images.map(image => image.video)
        };
      }),
    };
    if (allProductPages - 1 > page) {
      response.next_paging = page + 1;
    }

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "product paging error" });
  }
}

export async function reqPetsDetailByUserId(req, res) {
  const userID = req.query.userID;
  const cacheKey = `pet:${userID}`;
  try {
    let results = await redisCache(
      async () => getPetsDetailByUserId(userID),
      cacheKey,
      req,
      res
    );
    const petsResults = results.pets;
    // console.log("results....",results.pets);
    const petsDetails = await petsResults.map((result) => {
      // console.log("result",result);
      const petsDetail = UserformatRes(result);
      return petsDetail;
    });
    console.log(petsDetails);
    // const petsDetails = UserformatRes(results);
    res.json({ data: petsDetails });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error Response");
  }
}

export async function reqPetsByConditionForShelter(req, res, conditionValue) {
  const page = parseInt(req.query.paging) || 0;
  const perPageItems = 8;
  const itemIndex = page * perPageItems;
  let result;
  let countResult;
  if (conditionValue) {
    result = await getPetsByConditionForShelter(conditionValue, perPageItems, itemIndex);
    countResult = await getPetsByConditionCountForShelter(conditionValue);
  } else {
    let conditionValue = null;
    result = await getPetsByConditionForShelter(conditionValue, perPageItems, itemIndex);
    countResult = await getPetsByConditionCountForShelter();
  }

  const allProductPages = Math.ceil(countResult / perPageItems);
  console.log("allProductPages", allProductPages);
  try {
    const response = {
      data: result.map((pet) => {
        return {
          id: pet.id,
          category: pet.category,
          animalClass: pet.animalClass,
          name: pet.name,
          type: pet.type,
          location: pet.city || pet.district,
          district: pet.district,
          address: pet.address,
          gender: pet.gender,
          age: pet.age,
          anthel: pet.anthel,
          vaccine: pet.vaccine,
          ligation: pet.ligation,
          description: pet.description,
          color: pet.color,
          feature: pet.feature,
          shelter: pet.shelter,
          tel: pet.tel,
          place: pet.place,
          main_image: pet.main_image,
        };
      }),
    };
    if (allProductPages - 1 > page) {
      response.next_paging = page + 1;
    }

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "product paging error" });
  }
}