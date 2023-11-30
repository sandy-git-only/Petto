import {
  insertPetsTable,
  insertImageTable,
  getPetsDetailById,
  getPetsByCondition,
  getPetsByConditionCount
} from "../models/petsModel.js";
import redisCache from "../middlewares/redis.js";

export async function createPetsInfo(mainImageDataUrl, imagesUrls, req, res) {
  const requestData = await req.body;
  const {
    category,
    animalClass,
    name,
    type,
    location,
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
    location: location,
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
  const petsResponse = await insertPetsTable(petsData);
  const insertId = petsResponse.id;
  const imageUrlsArray = Object.values(imagesUrls);
  const imagesResponse = imageUrlsArray.map(async (url) => {
    const imagesData = {
      petID: insertId,
      url: url,
    };
    return insertImageTable(imagesData);
  });

  try {
    const successfullResponse = {
      id: insertId,
      category: category,
      animalClass: animalClass,
      name: name,
      type: type,
      location: location,
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
      createdAt: petsResponse.createdAt
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
    location: pet.location,
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
    images: image,
  };
  return petsFormat;
}

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
}


export async function reqPetsByCondition(req, res, conditionType, conditionValue) {
  const page = parseInt(req.query.paging) || 0;
  const perPageItems = 8;
  const itemIndex = page * perPageItems;
  let result;
  let countResult;
  if (conditionValue) {
    result = await getPetsByCondition(conditionType, conditionValue, perPageItems, itemIndex);
    countResult = await getPetsByConditionCount(conditionType,conditionValue);
  } else {
    let conditionType = null;
    let conditionValue = null;
    result = await getPetsByCondition(conditionType,conditionValue ,perPageItems, itemIndex);
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
          location: pet.location,
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
}