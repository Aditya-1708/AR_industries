import express, { application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRouter from "./routes/adminRoutes.js";
import openingRouter from "./routes/openingRoutes.js";
import productRouter from "./routes/productRoutes.js";
import processRouter from "./routes/processRoutes.js";
import applicationRouter from "./routes/applicationRoutes.js";
import cookieParser from "cookie-parser";
import adminRouter from "./routes/adminRoutes.js";

dotenv.config();

const app = express();

app.use(cors({
    credentials: true,
    origin: "http://localhost:5173",
  }));
app.use(express.json());
app.use(cookieParser());

app.use("/uploads", express.static("uploads"));

app.use("/api/admins",adminRouter)
app.use("/api/openings", openingRouter);
app.use("/api/processes", processRouter);
app.use("/api/products", productRouter);
app.use("/api/applications", applicationRouter);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
