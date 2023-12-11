
import express from 'express';
const app = express();
import { router as petsRouter } from './routes/petsRoute.js'
import { router as usersRouter } from './routes/usersRoute.js'
import { router as matchRouter } from './routes/matchRoute.js'
import { router as gpsRouter } from './routes/gpsRoute.js';
import { fileURLToPath } from 'url';
import { dirname }  from 'path';
import path from 'path'; 
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();

// import jwt from 'jsonwebtoken';
// import cors from 'cors'
app.use(express.json());

// Enable CORS
app.use(cors());




const API_VERSION = "1.0"
app.use(`/api/${API_VERSION}/pets`, petsRouter )  ;
app.use(`/api/${API_VERSION}/users`, usersRouter ) ;
app.use(`/api/${API_VERSION}/matches`, matchRouter ) ;
app.use(`/api/${API_VERSION}/gps`, gpsRouter ) ;
// app.use(`/api/${API_VERSION}/matches`,  ) ;



const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.get(`/api/${API_VERSION}/geojson`, (req, res) => {
  const geoJsonPath = path.join(__dirname, 'geojson', 'petto.geojson');
  res.sendFile(geoJsonPath);
});

app.get(`/api/${API_VERSION}/taiwan-districts`, (req, res) => {
  const taiwanJsonPath = path.join(__dirname, 'taiwanDistrict', 'taiwan_districts.json');
  res.sendFile(taiwanJsonPath);
});


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

export default app;