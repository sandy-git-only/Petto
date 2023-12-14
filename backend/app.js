
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
// Enable CORS
app.use(cors());
// app.use(cors({
//   origin: 'https://www.pettotw.com',
//   credentials: true,
// }));
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  next();
});
app.use((req, res, next) => {
  console.log('Request Headers:', req.headers);
  next();
});

app.use(express.json());
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
app.listen("4000", () => {
    console.log(`Server is running on port ${PORT}`);
  });

export default app;