import { Router } from "express";
import prisma from "../helper/pooler.js";
import { authenticate } from "../middlewares/authenticate.js";
const processRouter = Router();
export default processRouter;
