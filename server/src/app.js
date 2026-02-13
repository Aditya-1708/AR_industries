import express, { application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import openingRouter from "./routes/openingRoutes.js";
import productRouter from "./routes/productRoutes.js";
import processRouter from "./routes/processRoutes.js";
import applicationRouter from "./routes/applicationRoutes.js";
import cookieParser from "cookie-parser";
import adminRouter from "./routes/adminRoutes.js";
import equipmentRouter from "./routes/equipmentRoutes.js";
import staffRouter from "./routes/staffRoutes.js";
import blogRouter from "./routes/blogRoutes.js";
dotenv.config();


const app = express();


app.use(cors({
  credentials: true,
  origin: [
    "http://192.168.0.9:5173",
    "http://localhost:5173"
  ],
}));

app.use(express.json());
app.use(cookieParser());


app.use("/uploads", express.static(path.join(process.cwd(), "data", "uploads")));


app.use("/api/admins", adminRouter);
app.use("/api/openings", openingRouter);
app.use("/api/processes", processRouter);
app.use("/api/products", productRouter);
app.use("/api/equipments", equipmentRouter);
app.use("/api/applications", applicationRouter);
app.use("/api/staff", staffRouter);
app.use("/api/blogs", blogRouter);
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});

