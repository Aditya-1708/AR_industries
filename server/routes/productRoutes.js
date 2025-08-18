import { Router } from "express";
import  prisma from "../helper/pooler.js";
import { authenticate } from "../middlewares/authenticate.js";
const productRouter = Router();
export default productRouter;
