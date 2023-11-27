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
    userID,
  } = requestData;

  //注意:sequelize input是"object" 不是 array
  const petsData = {
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
  let result = await getPetsByCondition(conditionType, conditionValue, perPageItems, itemIndex);
  const countResult = await getPetsByConditionCount(conditionType,conditionValue);
  const allProductPages = Math.ceil(countResult / perPageItems);
  
  try {
    const response = {
      data: result.map((pet) => {
        return {
          id: pet.id,
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
// async function getCategoryProduct(req, res, category) {
//   const page = parseInt(req.query.paging) || 0;
//   const perPageItems = 6;
//   const itemIndex = page * perPageItems;
//   let result = await getProductByCategory(category, perPageItems, itemIndex);
//   const countResult = await getProductCountByCategory(category);
//   allProductPages = Math.ceil(countResult / perPageItems);
//   console.log(result);
//   try {
//     const response = {
//       data: result.map((product) => {
//         const colors = product.Variants.map((variant) => ({
//           color: variant.Colors.name,
//           code: variant.Colors.code,
//         }));
//         const variants = product.Variants.map((variant) => ({
//           id: variant.productID,
//           color_code: variant.color_code,
//           size: variant.size,
//           stock: variant.stock,
//         }));

//         return {
//           id: product.id,
//           category: product.category,
//           title: product.title,
//           description: product.description,
//           price: product.price,
//           texture: product.texture,
//           wash: product.wash,
//           place: product.place,
//           note: product.note,
//           story: product.story,
//           colors,
//           sizes: product.sizes,
//           variants,
//           main_image: product.main_image,
//           images: [product.Images[0].url],
//         };
//       }),
//     };

//     if (allProductPages - 1 > page) {
//       response.next_paging = page + 1;
//     }

//     res.status(200).json(response);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "product paging error" });
//   }
// }

// async function searchProduct(req, res) {
//   const keyword = req.query.keyword;
//   const result = await searchProductByKeyword(keyword)
//   try {
//     const response = {
//       data: result.map((product) => {
//         const colors = product.Variants.map((variant) => ({
//           color: variant.Colors.name,
//           code: variant.Colors.code,
//         }));
//         const variants = product.Variants.map((variant) => ({
//           id: variant.productID,
//           color_code: variant.color_code,
//           size: variant.size,
//           stock: variant.stock,
//         }));

//         return {
//           id: product.id,
//           category: product.category,
//           title: product.title,
//           description: product.description,
//           price: product.price,
//           texture: product.texture,
//           wash: product.wash,
//           place: product.place,
//           note: product.note,
//           story: product.story,
//           colors,
//           sizes: product.sizes,
//           variants,
//           main_image: product.main_image,
//           images: [product.Images[0].url],
//         };
//       }),
//     };
//     res.status(200).json(response);
//   } catch (err) {
//     console.error(err);
//   }

// }
