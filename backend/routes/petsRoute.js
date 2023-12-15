import express from "express";
import AWS from "aws-sdk";
import multer from "multer";
const router = express.Router();
const upload = multer();
import querystring  from "querystring";
import axios from 'axios';
import { createPetsInfo, reqPetsDetailById, reqPetsByCondition,reqPetsDetailByUserId,getSheltersAPI,reqPetsByConditionForShelter,reqPetsDetailByIdForShelter }  from "../controllers/petsController.js";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_S3_KEY_ID,
  secretAccessKey: process.env.AWS_S3_SECRET_KEY,
});


router.post("/create",
  upload.fields([
    { name: "main_image", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ]),
  async (req, res) => {
    try {
      const main_imageParams = {
        Bucket: "stylish-product/pets-images",
        Key: req.files.main_image[0].originalname,
        Body: req.files.main_image[0].buffer,
      };

      // Upload main image
      const mainImageData = await s3.upload(main_imageParams).promise();
      const mainImageDataUrl = mainImageData.Location;

      // Upload additional images if they exist
      let imagesUrls = [];
      if (req.files.images) {
        await Promise.all(req.files.images.map(async (image) => {
          const imagesParams = {
            Bucket: "petto/pets-images",
            Key: image.originalname,
            Body: image.buffer,
          };

          const imagesData = await s3.upload(imagesParams).promise();
          const imageUrl = imagesData.Location;
          imagesUrls.push(imageUrl);
        }));
      }

      // Create pets info
      const result = await createPetsInfo(mainImageDataUrl, imagesUrls, req, res);

      // Respond with the result if needed
      res.status(200).json({ success: true, result });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  }
);


router.get("/");
router.get('/all', (req, res) =>  reqPetsByCondition(req, res) );
router.get('/category/:category', (req, res) =>  reqPetsByCondition(req, res, 'category',req.params.category));
router.get('/gender/:gender', (req, res) =>  reqPetsByCondition(req, res, 'gender',req.params.gender));
// router.get('/conditions/:conditions', (req, res) =>  {reqPetsByCondition(req, res,'city', req.params.conditions)});
router.get('/conditions/:conditions', (req, res) => {
  const conditions = req.params.conditions;
  const parsedConditions = querystring.parse(conditions);
  reqPetsByCondition(req, res, parsedConditions);
});
// router.get('/accessories' , (req, res) => { getCategoryProduct(req, res, "accessories")});
// router.get('/search',(req, res) => { searchProduct (req, res) });
router.get('/details', (req, res) =>  reqPetsDetailById(req, res));
router.get('/user-post', (req, res) =>  reqPetsDetailByUserId(req, res));


router.get('/shelters', (req, res) =>  getSheltersAPI(req, res))
router.get('/shelters/all', (req, res) => reqPetsByConditionForShelter(req, res))
router.get('/shelters/details',(req, res) => reqPetsDetailByIdForShelter(req, res))
router.get('/shelters/conditions/:conditions',(req, res) => {
  const conditions = req.params.conditions;
  const parsedConditions = querystring.parse(conditions);
  reqPetsByConditionForShelter(req, res, parsedConditions);
});
export { router };