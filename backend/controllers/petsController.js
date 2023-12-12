import {
  insertPetsTable,
  insertImageTable,
  getPetsDetailById,
  getPetsByCondition,
  getPetsByConditionCount,
  getPetsDetailByUserId
} from "../models/petsModel.js";
import redisCache from "../middlewares/redis.js";
import {insertGeoLocationDB}  from "../models/gpsModel.js";
import {geocoder} from "../middlewares/geocode.js"
import reqPetsLocations from '../controllers/gpsController.js'

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
    feature:feature,
    userID: userID,
    main_image: mainImageDataUrl,
  };
  
  const result = await insertPetsTable(petsData);
  const insertId = result.id;
  // console.log("location": JSON.parse);
  // insert into GeoLocation Table
  const petlocation = result.city + result.district +result.address;
  const geocode = await geocoder(petlocation);
  if (geocode) {
    console.log(geocode.results[0])
    const geoLocation = geocode.results[0].geometry.location;
    const geoData = {
      petID: insertId,
      lat: geoLocation.lat,
      lng: geoLocation.lng
    };
    const geoResponse = await insertGeoLocationDB(geoData);
    if(geoResponse){ reqPetsLocations();}
  }
  
  const imageUrlsArray = Object.values(imagesUrls);
  const imagesResponse = imageUrlsArray.map(async (url) => {
    const imagesData = {
      petID: insertId,
      url: url,
    };
    console.log("images",imagesData)
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
      district:district,
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
};

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
    main_image: pet.main_image,
    city: pet.city,
    district:pet.district,
    images: image,
  };
  return petsFormat;
};


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
    district:pet.district,
  };
  return petsFormat;
};
export async function reqPetsDetailById(req, res) {
  const id = req.query.id;
  const cacheKey = `pet:${id}`;
  try {
    let results = await redisCache(
      async () => getPetsDetailById(id),
      cacheKey,
      req,
      res
    );
    const { pets, images } = results;
    const petsDetails = formatRes(pets, images);
    res.json({ data: petsDetails });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error Response");
  }
};


export async function reqPetsByCondition(req, res, conditionValue) {
  const page = parseInt(req.query.paging) || 0;
  const perPageItems = 8;
  const itemIndex = page * perPageItems;
  let result;
  let countResult;
  if (conditionValue) {
    result = await getPetsByCondition( conditionValue, perPageItems, itemIndex);
    countResult = await getPetsByConditionCount(conditionValue);
  } else {
    let conditionValue = null;
    result = await getPetsByCondition(conditionValue ,perPageItems, itemIndex);
    countResult = await getPetsByConditionCount();
  };
  
  const allProductPages = Math.ceil(countResult / perPageItems);
  console.log("allProductPages",allProductPages);
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
          images: pet.images.map(image => image.url),
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
};


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
    const petsResults = results.pets
    // console.log("results....",results.pets);
    const petsDetails = await petsResults.map((result)=> {
      // console.log("result",result);
      const petsDetail = UserformatRes(result);
      return petsDetail
    },
    )
    console.log(petsDetails)
    // const petsDetails = UserformatRes(results);
    res.json({ data: petsDetails });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error Response");
  }
};