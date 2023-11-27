
import express from 'express';
const app = express();
import { router as petsRouter } from './routes/petsRoute.js'
import dotenv from 'dotenv';
dotenv.config();

// import jwt from 'jsonwebtoken';
// import cors from 'cors'
app.use(express.json());

// Enable CORS
// app.use(cors());


const API_VERSION = "1.0"
app.use(`/api/${API_VERSION}/pets`, petsRouter )  ;
// app.use(`/api/${API_VERSION}/users`, userRouter ) ;
// app.use(`/api/${API_VERSION}/likes`,  ) ;
// app.use(`/api/${API_VERSION}/matches`,  ) ;



const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

export default app;