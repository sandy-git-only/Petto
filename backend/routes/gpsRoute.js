import express from 'express';
import reqPetsLocations from '../controllers/gpsController.js'
const router = express.Router();



router.get('/', (req, res) =>  reqPetsLocations(req, res) );


export { router };