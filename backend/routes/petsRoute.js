import express from "express";
import AWS from "aws-sdk";
import multer from "multer";
const router = express.Router();
const upload = multer();
import { createPetsInfo, reqPetsDetailById, reqPetsByCondition }  from "../controllers/petsController.js";

router.post("/create",
  upload.fields([
    { name: "main_image", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ]),
  (req, res) => {
    const s3 = new AWS.S3({
      accessKeyId: process.env.AWS_S3_KEY_ID,
      secretAccessKey: process.env.AWS_S3_SECRET_KEY,
    });
    const main_imageParams = {
      Bucket: "stylish-product/pets-images",
      Key: req.files.main_image[0].originalname,
      Body: req.files.main_image[0].buffer,
    };
    s3.upload(main_imageParams, function (err, mainImageData) {
      if (err) {
        console.log(err, err.stack);
      } else {
        let mainImageDataUrl = mainImageData.Location;
        let imagesUrls = [];
        req.files.images.forEach((image) => {
          let imagesParams = {
            Bucket: "petto/pets-images",
            Key: image.originalname,
            Body: image.buffer,
          };
          s3.upload(imagesParams, (err, imagesData) => {
            if (err) {
              console.log(err, err.stack);
            } else {
              const imageUrl = imagesData.Location;
              imagesUrls.push(imageUrl);
              if (imagesUrls.length === req.files.images.length) {
                createPetsInfo(mainImageDataUrl, imagesUrls, req, res);
              }
            }
          });
        });
      }
    });
  }
);

router.get("/");
router.get('/all', (req, res) =>  reqPetsByCondition(req, res) );
router.get('/gender/:gender', (req, res) =>  reqPetsByCondition(req, res, 'gender',req.params.gender));
router.get('/location/:location', (req, res) =>  reqPetsByCondition(req, res,'location', req.params.location));

// router.get('/accessories' , (req, res) => { getCategoryProduct(req, res, "accessories")});
// router.get('/search',(req, res) => { searchProduct (req, res) });
router.get('/details', (req, res) =>  reqPetsDetailById(req, res));

export { router };
