import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import userRouter from './routes/userRoutes.js';
import openingRouter from './routes/openingRoutes.js'
import productRouter from './routes/productRoutes.js';
import processRouter from './routes/processRoutes.js';
import cookieParser from 'cookie-parser';

dotenv.config()

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use('/api/user', userRouter);
app.use('api/opening',openingRouter);
app.use('api/process',processRouter);
app.use('api/product',productRouter)

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});